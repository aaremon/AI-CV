import os
import json
from typing import List, Dict, Any, Optional

DB_DIR = os.path.join(os.getcwd(), 'data')
DB_FILE = os.path.join(DB_DIR, 'db.json')

# Helper function to dynamically establish a MySQL connection if requested by environment variables
def get_mysql_connection():
    # Only initiate if host or db env vars are declared (typical for local XAMPP host setup)
    mysql_host = os.environ.get("MYSQL_HOST")
    mysql_db = os.environ.get("MYSQL_DB")
    if not mysql_host and not mysql_db:
        return None

    try:
        import pymysql
    except ImportError:
        try:
            import mysql.connector as pymysql
        except ImportError:
            # Safe recovery if neither package is installed locally
            print("[DB MySQL] Optional dependency 'pymysql' or 'mysql-connector-python' not found in this runtime environment.")
            print("[DB MySQL] Gracefully falling back to integrated JSON database file.")
            return None

    try:
        user = os.environ.get("MYSQL_USER", "root")
        password = os.environ.get("MYSQL_PASSWORD", "")
        db = mysql_db or "resume_analyzer"
        port_str = os.environ.get("MYSQL_PORT", "3306")
        
        try:
            port = int(port_str)
        except ValueError:
            port = 3306

        conn = pymysql.connect(
            host=mysql_host,
            user=user,
            password=password,
            database=db,
            port=port,
            charset='utf8mb4',
            cursorclass=getattr(pymysql.cursors, "DictCursor", None)
        )
        return conn
    except Exception as e:
        print(f"[DB MySQL] Failed connecting to remote/local MySQL database: {e}.")
        print("[DB MySQL] Gracefully falling back to integrated JSON database module.")
        return None


def init_db():
    if not os.path.exists(DB_DIR):
        os.makedirs(DB_DIR, exist_ok=True)
    if not os.path.exists(DB_FILE):
        with open(DB_FILE, 'w', encoding='utf-8') as f:
            json.dump({"auth_users": [], "users": [], "feedback": []}, f, indent=2)
    else:
        try:
            with open(DB_FILE, 'r', encoding='utf-8') as f:
                data = json.load(f)
            modified = False
            if "auth_users" not in data:
                data["auth_users"] = []
                modified = True
            if "users" not in data:
                data["users"] = []
                modified = True
            if "feedback" not in data:
                data["feedback"] = []
                modified = True
            if modified:
                with open(DB_FILE, 'w', encoding='utf-8') as f:
                    json.dump(data, f, indent=2)
        except Exception:
            with open(DB_FILE, 'w', encoding='utf-8') as f:
                json.dump({"auth_users": [], "users": [], "feedback": []}, f, indent=2)


def get_auth_users() -> List[Dict[str, Any]]:
    # 1. Attempt MySQL Retrieval
    conn = get_mysql_connection()
    if conn:
        try:
            with conn.cursor() as cursor:
                cursor.execute("SELECT id, email, name, phone, passwordHash, created_at FROM auth_users")
                rows = cursor.fetchall()
                if rows and not isinstance(rows[0], dict):
                    # Convert list/tuples if standard Cursor was used instead of DictCursor
                    return [{"id": r[0], "email": r[1], "name": r[2], "phone": r[3], "passwordHash": r[4], "created_at": r[5]} for r in rows]
                return list(rows) if rows else []
        except Exception as e:
            print(f"[DB MySQL] Error retrieving auth_users: {e}. Falling back to JSON...")
        finally:
            conn.close()

    # 2. File Fallback
    init_db()
    try:
        with open(DB_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
            return data.get("auth_users", [])
    except Exception:
        return []


def insert_auth_user(user: Dict[str, Any]) -> Dict[str, Any]:
    # 1. Attempt MySQL Insertion
    conn = get_mysql_connection()
    if conn:
        try:
            with conn.cursor() as cursor:
                query = "INSERT INTO auth_users (email, name, phone, passwordHash, created_at) VALUES (%s, %s, %s, %s, %s)"
                cursor.execute(query, (
                    user.get("email"),
                    user.get("name"),
                    user.get("phone"),
                    user.get("passwordHash"),
                    user.get("created_at")
                ))
                conn.commit()
                inserted_id = cursor.lastrowid
                return {"id": inserted_id, **user}
        except Exception as e:
            print(f"[DB MySQL] Error inserting auth_user to MySQL: {e}. Falling back to JSON...")
        finally:
            conn.close()

    # 2. File Fallback
    init_db()
    try:
        with open(DB_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        auth_users = data.get("auth_users", [])
        next_id = max([r.get("id", 0) for r in auth_users]) + 1 if auth_users else 1
        
        new_record = {"id": next_id, **user}
        auth_users.append(new_record)
        data["auth_users"] = auth_users
        
        with open(DB_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2)
        return new_record
    except Exception as e:
        print(f"Error inserting auth user: {e}")
        raise e


def get_users() -> List[Dict[str, Any]]:
    # 1. Attempt MySQL Retrieval
    conn = get_mysql_connection()
    if conn:
        try:
            with conn.cursor() as cursor:
                cursor.execute("""
                    SELECT id, sec_token, ip_add, host_name, dev_user, os_name_ver, latlong, city, state, country, 
                           act_name, act_mail, act_mob, name, email, resume_score, timestamp, page_no, reco_field, 
                           cand_level, skills, recommended_skills, courses, pdf_name, owner_email 
                    FROM users
                """)
                rows = cursor.fetchall()
                if rows and not isinstance(rows[0], dict):
                    # Manual convert matching user model
                    fields = [
                        "id", "sec_token", "ip_add", "host_name", "dev_user", "os_name_ver", "latlong", "city", 
                        "state", "country", "act_name", "act_mail", "act_mob", "name", "email", "resume_score", 
                        "timestamp", "page_no", "reco_field", "cand_level", "skills", "recommended_skills", 
                        "courses", "pdf_name", "owner_email"
                    ]
                    return [dict(zip(fields, r)) for r in rows]
                return list(rows) if rows else []
        except Exception as e:
            print(f"[DB MySQL] Error retrieving users from MySQL: {e}. Falling back to JSON...")
        finally:
            conn.close()

    # 2. File Fallback
    init_db()
    try:
        with open(DB_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
            return data.get("users", [])
    except Exception:
        return []


def delete_user_record(record_id: int, owner_email: Optional[str] = None) -> bool:
    # 1. Attempt MySQL Deletion
    conn = get_mysql_connection()
    if conn:
        try:
            with conn.cursor() as cursor:
                if owner_email:
                    query = "DELETE FROM users WHERE id = %s AND owner_email = %s"
                    cursor.execute(query, (record_id, owner_email))
                else:
                    query = "DELETE FROM users WHERE id = %s"
                    cursor.execute(query, (record_id,))
                conn.commit()
                return cursor.rowcount > 0
        except Exception as e:
            print(f"[DB MySQL] Error deleting record in MySQL: {e}. Falling back to JSON...")
        finally:
            conn.close()

    # 2. File Fallback
    init_db()
    try:
        with open(DB_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        users = data.get("users", [])
        initial_length = len(users)
        
        filtered_users = []
        for r in users:
            if r.get("id") != record_id:
                filtered_users.append(r)
            elif owner_email and r.get("owner_email") != owner_email:
                filtered_users.append(r)
        
        data["users"] = filtered_users
        
        with open(DB_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2)
        return len(filtered_users) < initial_length
    except Exception as e:
        print(f"Error deleting user record: {e}")
        return False


def insert_user(user: Dict[str, Any]) -> Dict[str, Any]:
    # 1. Attempt MySQL Insertion
    conn = get_mysql_connection()
    if conn:
        try:
            with conn.cursor() as cursor:
                query = """
                    INSERT INTO users (
                        sec_token, ip_add, host_name, dev_user, os_name_ver, latlong, city, state, country, 
                        act_name, act_mail, act_mob, name, email, resume_score, timestamp, page_no, reco_field, 
                        cand_level, skills, recommended_skills, courses, pdf_name, owner_email
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """
                cursor.execute(query, (
                    user.get("sec_token"),
                    user.get("ip_add"),
                    user.get("host_name"),
                    user.get("dev_user"),
                    user.get("os_name_ver"),
                    user.get("latlong"),
                    user.get("city"),
                    user.get("state"),
                    user.get("country"),
                    user.get("act_name"),
                    user.get("act_mail"),
                    user.get("act_mob"),
                    user.get("name"),
                    user.get("email"),
                    user.get("resume_score"),
                    user.get("timestamp"),
                    user.get("page_no"),
                    user.get("reco_field"),
                    user.get("cand_level"),
                    user.get("skills"),
                    user.get("recommended_skills"),
                    user.get("courses"),
                    user.get("pdf_name"),
                    user.get("owner_email")
                ))
                conn.commit()
                inserted_id = cursor.lastrowid
                return {"id": inserted_id, **user}
        except Exception as e:
            print(f"[DB MySQL] Error inserting user into MySQL: {e}. Falling back to JSON...")
        finally:
            conn.close()

    # 2. File Fallback
    init_db()
    try:
        with open(DB_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        users = data.get("users", [])
        next_id = max([r.get("id", 0) for r in users]) + 1 if users else 1
        
        new_record = {"id": next_id, **user}
        users.append(new_record)
        data["users"] = users
        
        with open(DB_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2)
        return new_record
    except Exception as e:
        print(f"Error inserting user record: {e}")
        raise e


def get_feedback() -> List[Dict[str, Any]]:
    # 1. Attempt MySQL Retrieval
    conn = get_mysql_connection()
    if conn:
        try:
            with conn.cursor() as cursor:
                cursor.execute("SELECT id, feed_name, feed_email, feed_score, comments, timestamp FROM feedback")
                rows = cursor.fetchall()
                if rows and not isinstance(rows[0], dict):
                    fields = ["id", "feed_name", "feed_email", "feed_score", "comments", "timestamp"]
                    return [dict(zip(fields, r)) for r in rows]
                return list(rows) if rows else []
        except Exception as e:
            print(f"[DB MySQL] Error retrieving feedback: {e}. Falling back to JSON...")
        finally:
            conn.close()

    # 2. File Fallback
    init_db()
    try:
        with open(DB_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
            return data.get("feedback", [])
    except Exception:
        return []


def insert_feedback(feedback: Dict[str, Any]) -> Dict[str, Any]:
    # 1. Attempt MySQL Insertion
    conn = get_mysql_connection()
    if conn:
        try:
            with conn.cursor() as cursor:
                query = "INSERT INTO feedback (feed_name, feed_email, feed_score, comments, timestamp) VALUES (%s, %s, %s, %s, %s)"
                cursor.execute(query, (
                    feedback.get("feed_name"),
                    feedback.get("feed_email"),
                    feedback.get("feed_score"),
                    feedback.get("comments", ""),
                    feedback.get("timestamp")
                ))
                conn.commit()
                inserted_id = cursor.lastrowid
                return {"id": inserted_id, **feedback}
        except Exception as e:
            print(f"[DB MySQL] Error inserting feedback to MySQL: {e}. Falling back to JSON...")
        finally:
            conn.close()

    # 2. File Fallback
    init_db()
    try:
        with open(DB_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        feed = data.get("feedback", [])
        next_id = max([r.get("id", 0) for r in feed]) + 1 if feed else 1
        
        new_record = {"id": next_id, **feedback}
        feed.append(new_record)
        data["feedback"] = feed
        
        with open(DB_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2)
        return new_record
    except Exception as e:
        print(f"Error inserting feedback: {e}")
        raise e
