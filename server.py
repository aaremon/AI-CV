import os
import sys
import json
import socket
import time
import random
import traceback
from http.server import BaseHTTPRequestHandler, HTTPServer
import urllib.request
import urllib.parse
from src.db import (
    get_auth_users,
    insert_auth_user,
    get_users,
    insert_user,
    delete_user_record,
    get_feedback,
    insert_feedback
)

PORT = 5000  # Run internally; our server.ts node bridge will proxy external port 3000 requests to this
API_KEY = os.environ.get("GEMINI_API_KEY")

# Robust retry wrapper matching callGeminiWithRetry in TS
def call_gemini_rest_with_retry(payload: dict, max_retries=5, base_delay=1.0) -> dict:
    attempt = 0
    current_model = payload.get("model", "gemini-3.5-flash")
    while True:
        try:
            # Fallback to gemini-3.1-flash-lite to handle heavy traffic/quota limits on gemini-3.5-flash
            if attempt >= 2 and current_model == "gemini-3.5-flash":
                print("[Gemini Python API] Falling back to 'gemini-3.1-flash-lite' to bypass high demand/rate limits on gemini-3.5-flash...")
                current_model = "gemini-3.1-flash-lite"

            contents_input = payload.get("contents", [])
            config = payload.get("config", {})
            system_instruction = config.get("systemInstruction", "")
            response_schema = config.get("responseSchema", {})

            # Format contents array into standard parts array for Gemini REST format
            parts = []
            for item in contents_input:
                if isinstance(item, str):
                    parts.append({"text": item})
                elif isinstance(item, dict) and "inlineData" in item:
                    parts.append({
                        "inlineData": {
                            "mimeType": item["inlineData"].get("mimeType"),
                            "data": item["inlineData"].get("data")
                        }
                    })
                elif isinstance(item, dict) and "text" in item:
                    parts.append({"text": item["text"]})

            body = {
                "contents": [{"parts": parts}],
                "generationConfig": {
                    "responseMimeType": "application/json"
                }
            }
            
            # Conditionally set thinkingBudget for models supporting it to speed up completions
            if "gemini-3.5" in current_model or "gemini-3-pro" in current_model:
                body["generationConfig"]["thinkingConfig"] = {
                    "thinkingBudget": 0
                }

            if response_schema:
                body["generationConfig"]["responseSchema"] = response_schema
            
            if system_instruction:
                body["systemInstruction"] = {
                    "parts": [{"text": system_instruction}]
                }

            url = f"https://generativelanguage.googleapis.com/v1beta/models/{current_model}:generateContent?key={API_KEY}"
            req_data = json.dumps(body).encode("utf-8")
            
            headers = {
                "Content-Type": "application/json",
                "User-Agent": "aistudio-build-python"
            }
            
            req = urllib.request.Request(url, data=req_data, headers=headers, method="POST")
            
            with urllib.request.urlopen(req, timeout=120) as response:
                resp_data = response.read().decode("utf-8")
                return json.loads(resp_data)

        except Exception as e:
            attempt += 1
            error_message = str(e)
            
            # Enhance readability of HTTPError responses by extracting response body details
            if hasattr(e, "code") and hasattr(e, "read"):
                try:
                    error_body = e.read().decode("utf-8")
                    error_message = f"HTTP Error {e.code}: {e.reason} - {error_body}"
                except Exception:
                    pass

            # Identify retryable errors
            is_retryable = any(term in error_message.upper() for term in [
                "503", "UNAVAILABLE", "HIGH DEMAND", "TEMPORARY", "429", "RESOURCE_EXHAUSTED", "502", "504", "OVERLOADED"
            ])

            if is_retryable and attempt <= max_retries:
                delay = base_delay * (2 ** (attempt - 1)) + random.uniform(0, 0.5)
                print(f"[Gemini Python API] Retryable error (attempt {attempt}/{max_retries}): {error_message}. Retrying in {delay:.2f}s...")
                time.sleep(delay)
                continue

            if is_retryable:
                raise Exception(f"The Gemini model is currently experiencing very high demand globally (Last Error: {error_message}). We attempted to automatically retry the operation multiple times but the service remains unavailable. Please wait a few moments and try analyzing again.")
            
            raise Exception(f"Gemini API Error: {error_message}")


# Map schema definitions for API
RESUME_RESPONSE_SCHEMA = {
    "type": "OBJECT",
    "properties": {
        "name": {"type": "STRING", "description": "Candidate's full name"},
        "email": {"type": "STRING", "description": "Candidate's email address"},
        "phone": {"type": "STRING", "description": "Candidate's contact/phone number"},
        "degree": {"type": "STRING", "description": "Candidate's degree or education level"},
        "no_of_pages": {"type": "INTEGER", "description": "Estimated or actual page count"},
        "cand_level": {"type": "STRING", "description": "Fresher, Intermediate, or Experienced"},
        "predicted_field": {"type": "STRING", "description": "Data Science, Web Development, Android Development, iOS Development, UI-UX Development, or Other"},
        "current_skills": {
            "type": "ARRAY",
            "items": {"type": "STRING"},
            "description": "List of existing skills found in resume"
        },
        "recommended_skills": {
            "type": "ARRAY",
            "items": {"type": "STRING"},
            "description": "List of 8-12 recommended skills to boost their resume for their predicted field"
        },
        "resume_score": {"type": "INTEGER", "description": "Overall Resume score out of 100 based on standard content checklist"},
        "score_factors": {
            "type": "OBJECT",
            "properties": {
                "has_objective": {"type": "BOOLEAN"},
                "has_education": {"type": "BOOLEAN"},
                "has_experience": {"type": "BOOLEAN"},
                "has_internship": {"type": "BOOLEAN"},
                "has_skills": {"type": "BOOLEAN"},
                "has_hobbies": {"type": "BOOLEAN"},
                "has_interests": {"type": "BOOLEAN"},
                "has_achievements": {"type": "BOOLEAN"},
                "has_certifications": {"type": "BOOLEAN"},
                "has_projects": {"type": "BOOLEAN"}
            },
            "required": [
                "has_objective", "has_education", "has_experience", "has_internship",
                "has_skills", "has_hobbies", "has_interests", "has_achievements",
                "has_certifications", "has_projects"
            ]
        },
        "feedback": {
            "type": "ARRAY",
            "items": {
                "type": "OBJECT",
                "properties": {
                    "factor": {"type": "STRING", "description": "The name of the checked item"},
                    "status": {"type": "STRING", "description": "added or missing"},
                    "detail": {"type": "STRING", "description": "Full constructive recommendation or congrats details"}
                },
                "required": ["factor", "status", "detail"]
            }
        },
        "recommended_courses": {
            "type": "ARRAY",
            "items": {
                "type": "OBJECT",
                "properties": {
                    "title": {"type": "STRING", "description": "Custom realistic certification course title"},
                    "link": {"type": "STRING", "description": "Learning link"}
                },
                "required": ["title", "link"]
            }
        }
    },
    "required": [
        "name", "email", "phone", "degree", "no_of_pages", "cand_level",
        "predicted_field", "current_skills", "recommended_skills", "resume_score",
        "score_factors", "feedback", "recommended_courses"
    ]
}


class PythonAPIHandler(BaseHTTPRequestHandler):
    def send_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, DELETE")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_cors_headers()
        self.end_headers()

    def send_json(self, data, status_code=200):
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json")
        self.send_cors_headers()
        self.end_headers()
        self.wfile.write(json.dumps(data).encode("utf-8"))

    def send_error_response(self, message, status_code=500):
        self.send_json({"error": message}, status_code)

    def read_post_body(self) -> dict:
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)
        if not post_data:
            return {}
        return json.loads(post_data.decode('utf-8'))

    def do_GET(self):
        parsed_url = urllib.parse.urlparse(self.path)
        path = parsed_url.path
        query = urllib.parse.parse_qs(parsed_url.query)

        # GET /api/records
        if path == "/api/records":
            try:
                email = query.get("email", [None])[0]
                all_records = get_users()
                if email:
                    target_email = email.lower().strip()
                    filtered = [r for r in all_records if r.get("owner_email") == target_email]
                    return self.send_json(filtered)
                self.send_json(all_records)
            except Exception as e:
                self.send_error_response(str(e))

        # GET /api/feedback
        elif path == "/api/feedback":
            try:
                return self.send_json(get_feedback())
            except Exception as e:
                self.send_error_response(str(e))

        # GET /api/admin/records
        elif path == "/api/admin/records":
            try:
                # In basic mode, returns all records
                return self.send_json(get_users())
            except Exception as e:
                self.send_error_response(str(e))

        else:
            self.send_error_response("Resource Not Found", 404)

    def do_POST(self):
        parsed_url = urllib.parse.urlparse(self.path)
        path = parsed_url.path

        # POST /api/auth/signup
        if path == "/api/auth/signup":
            try:
                body = self.read_post_body()
                email = body.get("email")
                password = body.get("password")
                name = body.get("name")
                phone = body.get("phone")

                if not email or not password or not name or not phone:
                    return self.send_error_response("Please fill out all signup criteria.", 400)

                normalized_email = email.lower().strip()
                existing = get_auth_users()
                if any(u.get("email") == normalized_email for u in existing):
                    return self.send_error_response("An account with this email address already exists.", 400)

                password_hash = f"plain:{password}"
                timestamp = time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())

                user_payload = {
                    "email": normalized_email,
                    "name": name.strip(),
                    "phone": phone.strip(),
                    "passwordHash": password_hash,
                    "created_at": timestamp
                }
                new_user = insert_auth_user(user_payload)
                user_safe = {k: v for k, v in new_user.items() if k != "passwordHash"}
                
                self.send_json({"success": True, "user": user_safe})
            except Exception as e:
                traceback.print_exc()
                self.send_error_response(str(e))

        # POST /api/auth/login
        elif path == "/api/auth/login":
            try:
                body = self.read_post_body()
                email = body.get("email")
                password = body.get("password")

                if not email or not password:
                    return self.send_error_response("Missing login details.", 400)

                normalized_email = email.lower().strip()
                users = get_auth_users()
                found = next((u for u in users if u.get("email") == normalized_email), None)

                if not found or found.get("passwordHash") != f"plain:{password}":
                    return self.send_error_response("Invalid email account or wrong credential passwords.", 401)

                user_safe = {k: v for k, v in found.items() if k != "passwordHash"}
                self.send_json({"success": True, "user": user_safe})
            except Exception as e:
                self.send_error_response(str(e))

        # POST /api/analyze
        elif path == "/api/analyze":
            try:
                body = self.read_post_body()
                act_name = body.get("act_name")
                act_mail = body.get("act_mail")
                act_mob = body.get("act_mob")
                file_base64 = body.get("fileBase64")
                file_type = body.get("fileType")
                raw_text = body.get("rawText")
                file_name = body.get("fileName")
                owner_email = body.get("owner_email")

                if not act_name or not act_mail or not act_mob:
                    return self.send_error_response("Missing required contact fields (Name, Mail, Mobile)", 400)

                if not file_base64 and not raw_text:
                    return self.send_error_response("Please upload a resume file or paste resume details.", 400)

                if not API_KEY:
                    return self.send_error_response("GEMINI_API_KEY environment variable is not configured.", 500)

                contents = []
                if file_base64 and file_type:
                    # Strip standard base64 preambles
                    if "," in file_base64:
                        file_base64 = file_base64.split(",", 1)[1]
                    mime = "application/pdf" if "pdf" in file_type else "text/plain"
                    contents.append({
                        "inlineData": {
                            "mimeType": mime,
                            "data": file_base64
                        }
                    })

                prompt_text = """
                  You are an elite, rapid talent acquisition AI model and resume analyzer. Keep outputs compact and fast.
                  Identify basic details (Degree, contact, email, skills, and Name).
                  Verify if the following components are present and compute the resume_score:
                  - Objective or Summary (worth 6 points)
                  - Education Details (worth 12 points)
                  - Experience or Work Experience (worth 16 points)
                  - Internships (worth 6 points)
                  - Skills section (worth 7 points)
                  - Hobbies (worth 4 points)
                  - Interests (worth 5 points)
                  - Achievements (worth 13 points)
                  - Certifications section (worth 12 points)
                  - Projects (worth 19 points)
                  Compute exact score (sum of present factors up to 100).
                  Determine experience level: "Fresher", "Intermediate", or "Experienced".
                  Predict best track from: Data Science, Web Development, Android Development, iOS Development, UI-UX Development, or Other.
                  Suggest exactly 5-8 missing recommended skills.
                  In the feedback array of 10 items, provide extremely brief (under 10 words) 1-sentence diagnostic recommendations.
                  Recommend exactly 3 high-quality learning course titles with realistic links.
                """
                contents.append(prompt_text)

                gemini_payload = {
                    "model": "gemini-3.5-flash",
                    "contents": contents,
                    "config": {
                        "responseSchema": RESUME_RESPONSE_SCHEMA,
                        "systemInstruction": "You are a rapid Recruiter. Keep every single response and feedback details extremely brief and under 10 words."
                    }
                }

                gemini_response = call_gemini_rest_with_retry(gemini_payload)
                
                # Extract text out of the API responses structural standard
                candidates = gemini_response.get("candidates", [])
                if not candidates:
                    raise Exception("API call was successful but no generation candidates returned.")
                
                parts = candidates[0].get("content", {}).get("parts", [])
                if not parts:
                    raise Exception("No content parts found in candidate generation.")
                
                text_response = parts[0].get("text", "").strip()
                parsed_result = json.loads(text_response)

                token = ''.join(random.choices('abcdefghijklmnopqrstuvwxyz0123456789', k=12))
                timestamp = time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())

                # Prepare records with realistic varied geo-telemetry logs for placement analytics
                mock_locations = [
                    {"city": "Sydney", "state": "NSW", "country": "Australia", "latlong": "[-33.86, 151.20]"},
                    {"city": "New York", "state": "NY", "country": "United States", "latlong": "[40.71, -74.00]"},
                    {"city": "San Francisco", "state": "CA", "country": "United States", "latlong": "[37.77, -122.41]"},
                    {"city": "Mumbai", "state": "MH", "country": "India", "latlong": "[19.07, 72.87]"},
                    {"city": "Paris", "state": "IDF", "country": "France", "latlong": "[48.85, 2.35]"},
                    {"city": "London", "state": "England", "country": "United Kingdom", "latlong": "[51.50, -0.12]"},
                    {"city": "Toronto", "state": "ON", "country": "Canada", "latlong": "[43.65, -79.38]"},
                    {"city": "Berlin", "state": "BE", "country": "Germany", "latlong": "[52.52, 13.40]"}
                ]
                loc = random.choice(mock_locations)

                record_payload = {
                    "sec_token": token,
                    "ip_add": "127.0.0.1",
                    "host_name": socket.gethostname(),
                    "dev_user": os.environ.get("USER", os.environ.get("USERNAME", "user")),
                    "os_name_ver": f"{sys.platform} Python-{sys.version.split()[0]}",
                    "latlong": loc["latlong"],
                    "city": loc["city"],
                    "state": loc["state"],
                    "country": loc["country"],
                    "act_name": act_name,
                    "act_mail": act_mail,
                    "act_mob": act_mob,
                    "name": parsed_result.get("name", act_name),
                    "email": parsed_result.get("email", act_mail),
                    "resume_score": str(parsed_result.get("resume_score", 0)),
                    "timestamp": timestamp,
                    "page_no": str(parsed_result.get("no_of_pages", 1)),
                    "reco_field": parsed_result.get("predicted_field", "Other"),
                    "cand_level": parsed_result.get("cand_level", "Fresher"),
                    "skills": json.dumps(parsed_result.get("current_skills", [])),
                    "recommended_skills": json.dumps(parsed_result.get("recommended_skills", [])),
                    "courses": json.dumps(parsed_result.get("recommended_courses", [])),
                    "pdf_name": file_name or "Pasted_Resume_Text.txt",
                }
                
                if owner_email:
                    record_payload["owner_email"] = owner_email.lower().strip()

                inserted_record = insert_user(record_payload)

                self.send_json({
                    "success": True,
                    "data": parsed_result,
                    "record": inserted_record
                })

            except Exception as e:
                traceback.print_exc()
                self.send_error_response(str(e))

        # POST /api/feedback
        elif path == "/api/feedback":
            try:
                body = self.read_post_body()
                name = body.get("name")
                email = body.get("email")
                rating = body.get("rating")
                comments = body.get("comments", "")

                if not name or not email or not rating:
                    return self.send_error_response("Name, email, and rating score are required.", 400)

                timestamp = time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())
                payload = {
                    "feed_name": name,
                    "feed_email": email,
                    "feed_score": str(rating),
                    "comments": comments,
                    "timestamp": timestamp
                }

                record = insert_feedback(payload)
                self.send_json({"success": True, "record": record})
            except Exception as e:
                self.send_error_response(str(e))

        # POST /api/admin/login
        elif path == "/api/admin/login":
            try:
                body = self.read_post_body()
                username = body.get("username")
                password = body.get("password")

                if username == "admin" and password == "admin@resume-analyzer":
                    self.send_json({"success": True, "token": "admin-authenticated-token"})
                else:
                    self.send_json({"success": False, "error": "Wrong ID & Password Provided"}, 401)
            except Exception as e:
                self.send_error_response(str(e))

        else:
            self.send_error_response("Not Found", 404)

    def do_DELETE(self):
        parsed_url = urllib.parse.urlparse(self.path)
        path = parsed_url.path
        query = urllib.parse.parse_qs(parsed_url.query)

        # DELETE /api/records/<id>
        if path.startswith("/api/records/"):
            try:
                record_id_str = path.split("/")[-1]
                if not record_id_str:
                    return self.send_error_response("Missing record ID", 400)
                record_id = int(record_id_str)
                email = query.get("email", [None])[0]
                
                owner_email = email.lower().strip() if email else None
                deleted = delete_user_record(record_id, owner_email)
                
                if deleted:
                    self.send_json({"success": True, "message": "Record successfully deleted from database."})
                else:
                    self.send_json({"success": False, "error": "Record not found or access unauthorized."}, 404)
            except Exception as e:
                self.send_error_response(str(e))
        else:
            self.send_error_response("Not Found", 404)


def run_http_server():
    server_address = ('0.0.0.0', PORT)
    httpd = HTTPServer(server_address, PythonAPIHandler)
    print(f"[Python API Server] Starting internally on {server_address[0]}:{server_address[1]}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.server_close()


if __name__ == "__main__":
    run_http_server()
