import os
import json

# Setup Db file paths
DB_DIR = os.path.join(os.getcwd(), "data")
DB_FILE = os.path.join(DB_DIR, "db.json")

def init_db():
    if not os.path.exists(DB_DIR):
        os.makedirs(DB_DIR, exist_ok=True)
    if not os.path.exists(DB_FILE):
        with open(DB_FILE, "w", encoding="utf-8") as f:
            json.dump({ "auth_users": [], "users": [], "feedback": [] }, f, indent=2)
    else:
        try:
            with open(DB_FILE, "r", encoding="utf-8") as f:
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
                with open(DB_FILE, "w", encoding="utf-8") as f:
                    json.dump(data, f, indent=2)
        except Exception:
            with open(DB_FILE, "w", encoding="utf-8") as f:
                json.dump({ "auth_users": [], "users": [], "feedback": [] }, f, indent=2)

def read_db():
    init_db()
    try:
        with open(DB_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return { "auth_users": [], "users": [], "feedback": [] }

def write_db(data):
    init_db()
    with open(DB_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)

def get_mysql_connection():
    host = os.environ.get("MYSQL_HOST")
    db = os.environ.get("MYSQL_DB")
    if not host or not db:
        return None
    try:
        # Dynamic import of MySQL connector/pymysql
        import mysql.connector
        conn = mysql.connector.connect(
            host=host,
            user=os.environ.get("MYSQL_USER", "root"),
            password=os.environ.get("MYSQL_PASSWORD", ""),
            database=db,
            port=int(os.environ.get("MYSQL_PORT", "3306"))
        )
        return conn
    except Exception as e:
        print(f"[DB MySQL] Dynamic load of MySQL library failed: {e}. Falling back to local JSON database.")
        return None

def get_auth_users():
    conn = get_mysql_connection()
    if conn:
        try:
            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT id, email, name, phone, passwordHash, created_at FROM auth_users")
            results = cursor.fetchall()
            cursor.close()
            return results or []
        except Exception as e:
            print(f"[DB MySQL] Error retrieving auth_users: {e}, falling back to local database.")
        finally:
            conn.close()
    db = read_db()
    return db.get("auth_users", [])

def insert_auth_user(user):
    conn = get_mysql_connection()
    if conn:
        try:
            cursor = conn.cursor(dictionary=True)
            query = "INSERT INTO auth_users (email, name, phone, passwordHash, created_at) VALUES (%s, %s, %s, %s, %s)"
            cursor.execute(query, (user["email"], user["name"], user["phone"], user["passwordHash"], user["created_at"]))
            conn.commit()
            new_id = cursor.lastrowid
            cursor.close()
            user["id"] = new_id
            return user
        except Exception as e:
            print(f"[DB MySQL] Error inserting auth_user: {e}, falling back to local database.")
        finally:
            conn.close()
            
    db = read_db()
    if "auth_users" not in db:
        db["auth_users"] = []
    next_id = max([u.get("id", 0) for u in db["auth_users"]], default=0) + 1
    new_record = { "id": next_id, **user }
    db["auth_users"].append(new_record)
    write_db(db)
    return new_record

def get_users():
    conn = get_mysql_connection()
    if conn:
        try:
            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT * FROM users")
            results = cursor.fetchall()
            cursor.close()
            return results or []
        except Exception as e:
            print(f"[DB MySQL] Error retrieving users: {e}, falling back to local database.")
        finally:
            conn.close()
    db = read_db()
    return db.get("users", [])

def insert_user(user):
    conn = get_mysql_connection()
    if conn:
        try:
            cursor = conn.cursor(dictionary=True)
            query = """
                INSERT INTO users (
                    sec_token, ip_add, host_name, dev_user, os_name_ver, latlong, city, state, country, 
                    act_name, act_mail, act_mob, name, email, resume_score, timestamp, page_no, reco_field, 
                    cand_level, skills, recommended_skills, courses, pdf_name, owner_email
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            cursor.execute(query, (
                user["sec_token"], user["ip_add"], user["host_name"], user["dev_user"], user["os_name_ver"], user["latlong"], user["city"], user["state"], user["country"],
                user["act_name"], user["act_mail"], user["act_mob"], user["name"], user["email"], user["resume_score"], user["timestamp"], user["page_no"], user["reco_field"],
                user["cand_level"], user["skills"], user["recommended_skills"], user["courses"], user["pdf_name"], user.get("owner_email")
            ))
            conn.commit()
            new_id = cursor.lastrowid
            cursor.close()
            user["id"] = new_id
            return user
        except Exception as e:
            print(f"[DB MySQL] Error inserting user: {e}, falling back to local database.")
        finally:
            conn.close()
            
    db = read_db()
    if "users" not in db:
        db["users"] = []
    next_id = max([u.get("id", 0) for u in db["users"]], default=0) + 1
    new_record = { "id": next_id, **user }
    db["users"].append(new_record)
    write_db(db)
    return new_record

def delete_user_record(record_id, owner_email=None):
    conn = get_mysql_connection()
    if conn:
        try:
            cursor = conn.cursor()
            if owner_email:
                query = "DELETE FROM users WHERE id = %s AND owner_email = %s"
                cursor.execute(query, (record_id, owner_email))
            else:
                query = "DELETE FROM users WHERE id = %s"
                cursor.execute(query, (record_id,))
            conn.commit()
            affected = cursor.rowcount > 0
            cursor.close()
            return affected
        except Exception as e:
            print(f"[DB MySQL] Error deleting record: {e}, falling back to local database.")
        finally:
            conn.close()
            
    db = read_db()
    if "users" not in db:
        db["users"] = []
    initial_len = len(db["users"])
    db["users"] = [
        user for user in db["users"]
        if not (user.get("id") == record_id and (not owner_email or user.get("owner_email") == owner_email))
    ]
    write_db(db)
    return len(db["users"]) < initial_len

def get_feedback():
    conn = get_mysql_connection()
    if conn:
        try:
            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT id, feed_name, feed_email, feed_score, comments, timestamp FROM feedback")
            results = cursor.fetchall()
            cursor.close()
            return results or []
        except Exception as e:
            print(f"[DB MySQL] Error retrieving feedback: {e}, falling back to local database.")
        finally:
            conn.close()
    db = read_db()
    return db.get("feedback", [])

def insert_feedback(feedback):
    conn = get_mysql_connection()
    if conn:
        try:
            cursor = conn.cursor(dictionary=True)
            query = "INSERT INTO feedback (feed_name, feed_email, feed_score, comments, timestamp) VALUES (%s, %s, %s, %s, %s)"
            cursor.execute(query, (
                feedback["feed_name"], feedback["feed_email"], feedback["feed_score"], feedback["comments"], feedback["timestamp"]
            ))
            conn.commit()
            new_id = cursor.lastrowid
            cursor.close()
            feedback["id"] = new_id
            return feedback
        except Exception as e:
            print(f"[DB MySQL] Error inserting feedback: {e}, falling back to local database.")
        finally:
            conn.close()
            
    db = read_db()
    if "feedback" not in db:
        db["feedback"] = []
    next_id = max([u.get("id", 0) for u in db["feedback"]], default=0) + 1
    new_record = { "id": next_id, **feedback }
    db["feedback"].append(new_record)
    write_db(db)
    return new_record
