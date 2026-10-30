
import json
import bcrypt
import jwt
import datetime
import os

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.db import connection
from dotenv import load_dotenv

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.db import connection


@csrf_exempt
@require_POST
def submit_inquiry(request):
    try:
        data = json.loads(request.body)

        name = data.get("name", "").strip()
        email = data.get("email", "").strip()
        phone = data.get("phone", "").strip()
        user_type = data.get("user_type", "")
        category = data.get("category", "")
        message = data.get("message", "").strip()

        # Check required fields
        if not all([name, email, phone, user_type, category, message]):
            return JsonResponse(
                {"error": "All fields are required."},
                status=400
            )

        # Check allowed values
        if user_type not in ["Parent", "Student", "School"]:
            return JsonResponse(
                {"error": "Invalid user type."},
                status=400
            )

        if category not in [
            "Scholarship", "Concert", "Admission", "General Query"
        ]:
            return JsonResponse(
                {"error": "Invalid inquiry category."},
                status=400
            )

        # Save inquiry in Supabase PostgreSQL
        with connection.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO inquiries
                (name, email, phone, user_type, category, message)
                VALUES (%s, %s, %s, %s, %s, %s)
                """,
                [name, email, phone, user_type, category, message]
            )

        return JsonResponse(
            {"message": "Inquiry submitted successfully!"},
            status=201
        )

    except json.JSONDecodeError:
        return JsonResponse(
            {"error": "Invalid JSON data."},
            status=400
        )

    except Exception as e:
        print("DATABASE ERROR:", e)

        return JsonResponse(
            {"error": "Something went wrong while submitting the inquiry."},
            status=500
        )

@csrf_exempt
@require_POST
def admin_login(request):
    try:
        data = json.loads(request.body)

        username = data.get("username", "").strip()
        password = data.get("password", "")

        if not username or not password:
            return JsonResponse(
                {"error": "Username and password are required"},
                status=400
            )

        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT id, username, password_hash FROM admins WHERE username = %s",
                [username]
            )
            admin = cursor.fetchone()

        if not admin:
            return JsonResponse(
                {"error": "Invalid username or password"},
                status=401
            )

        admin_id, admin_username, password_hash = admin

        if not bcrypt.checkpw(
            password.encode("utf-8"),
            password_hash.encode("utf-8")
        ):
            return JsonResponse(
                {"error": "Invalid username or password"},
                status=401
            )

        token = jwt.encode(
            {
                "admin_id": admin_id,
                "username": admin_username,
                "exp": datetime.datetime.now(datetime.timezone.utc)
                     + datetime.timedelta(hours=2)
            },
            os.environ["DJANGO_SECRET_KEY"],
            algorithm="HS256"
        )

        return JsonResponse({
            "message": "Login successful!",
            "token": token,
            "username": admin_username
        })

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    except Exception:
        import traceback
        traceback.print_exc()
        return JsonResponse({"error": "Login failed"}, status=500)


def admin_token_required(request):
    auth_header = request.headers.get("Authorization", "")

    if not auth_header.startswith("Bearer "):
        return None

    token = auth_header.split(" ", 1)[1]

    try:
        payload = jwt.decode(
            token,
            os.environ["DJANGO_SECRET_KEY"],
            algorithms=["HS256"]
        )
        return payload

    except jwt.ExpiredSignatureError:
        return None

    except jwt.InvalidTokenError:
        return None


@csrf_exempt
def get_inquiries(request):
    if request.method != "GET":
        return JsonResponse({"error": "Method not allowed"}, status=405)

    admin = admin_token_required(request)

    if not admin:
        return JsonResponse(
            {"error": "Unauthorized. Please login again."},
            status=401
        )

    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT id, name, email, phone, user_type,
                   category, message, status, created_at
            FROM inquiries
            ORDER BY created_at DESC
        """)

        columns = [column[0] for column in cursor.description]
        inquiries = [
            dict(zip(columns, row))
            for row in cursor.fetchall()
        ]

    return JsonResponse({"inquiries": inquiries})

@csrf_exempt
@require_POST
def update_inquiry_status(request, inquiry_id):
    admin = admin_token_required(request)

    if not admin:
        return JsonResponse({"error": "Unauthorized"}, status=401)

    try:
        data = json.loads(request.body)
        status = data.get("status")

        if status not in ["New", "Contacted", "Resolved"]:
            return JsonResponse({"error": "Invalid status"}, status=400)

        with connection.cursor() as cursor:
            cursor.execute(
                "UPDATE inquiries SET status = %s WHERE id = %s",
                [status, inquiry_id]
            )

            if cursor.rowcount == 0:
                return JsonResponse({"error": "Inquiry not found"}, status=404)

        return JsonResponse({"message": "Status updated successfully!"})

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)