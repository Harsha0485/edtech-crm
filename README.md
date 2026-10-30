# EdTech CRM & Inquiry Management System

A full-stack web application developed to collect, manage, and track inquiries for an EdTech platform.

## Technologies Used

**Frontend**
- React.js
- Vite
- Axios
- CSS

**Backend**
- Python
- Django
- Django REST Framework
- JWT Authentication
- bcrypt Password Hashing

**Database**
- Supabase PostgreSQL

## Features

### Public Inquiry Form
- Submit inquiries with personal details.
- Select user type: Parent, Student, or School.
- Select inquiry category: Scholarship, Concert, Admission, or General Query.
- Form validation and success/error notifications.

### Admin Login
- Custom admin authentication.
- Password verification using bcrypt.
- JWT-based authentication.

### Admin Dashboard
- View submitted inquiries.
- Search by name or phone number.
- Filter by category and user type.
- Update inquiry status: New, Contacted, or Resolved.
- Secure logout.

## Project Structure

- `frontend/` – React application
- `backend/` – Django REST API
- `schema.sql` – Database schema

## Setup Instructions

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd edtech-crm
```

### 2. Backend Setup

```bash
cd backend
python -m venv env
env\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file using `.env.example` as a template and add your own Supabase database URL and Django secret key.

Run migrations and start the server:

```bash
python manage.py migrate
python manage.py runserver
```

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

Configure the required environment variables in `backend/.env`:

- `DATABASE_URL`
- `DJANGO_SECRET_KEY`
- `DEBUG`

Never commit your actual `.env` file or credentials.

## Developer

Developed as a Full-Stack Developer Intern assessment project.