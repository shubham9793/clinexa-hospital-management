# 🏥 Clinexa - Hospital Management System

Clinexa is a full-stack Hospital Management System built using **Spring Boot**, **Angular**, **PostgreSQL**, and **JWT Authentication**. The application streamlines hospital operations by providing separate modules for Admin, Receptionist, Doctor, and Patient with secure authentication and appointment management.

---

# 🚀 Tech Stack

## Backend
- Java 21
- Spring Boot 3
- Spring Security
- JWT Authentication
- Spring Data JPA
- Hibernate
- PostgreSQL
- Maven
- Java Mail Sender (Gmail SMTP)

## Frontend
- Angular
- TypeScript
- Angular Material
- Bootstrap
- SweetAlert2
- HTML5
- SCSS

## Database
- PostgreSQL

---

# 👨‍💻 User Roles

## Admin
- Manage Doctors
- Manage Departments
- Manage Categories
- Activate / Deactivate Doctors
- Dashboard Statistics
- Recent Activities

## Receptionist
- Register Patients
- Book Appointments
- Update Appointments
- Cancel Appointments
- Reschedule Appointments
- View Appointment History

## Doctor
- View Own Appointments
- Confirm Appointment
- Cancel Appointment
- Complete Appointment
- Manage Medical Records (Upcoming)

## Patient
- Self Registration
- Email Verification
- Login
- Book Appointment
- Cancel Appointment
- Reschedule Appointment
- View Appointment History
- Forgot Password
- Reset Password

---

# 🔐 Authentication Features

## JWT Authentication
- Secure Login
- Role Based Authorization
- Protected APIs
- Stateless Authentication

---

## Patient Registration

Patients can register themselves by providing:

- Name
- Email
- Phone
- Gender
- DOB
- Address
- Password

Password is encrypted using BCrypt before storing.

---

## Email Verification

After successful registration

- User account remains disabled
- 6 Digit OTP generated
- OTP sent to registered Gmail
- Email verification required before login

Features

- OTP Expiry (5 Minutes)
- Resend OTP
- One Active OTP per User
- Secure OTP Verification

---

## Forgot Password

Implemented secure password recovery flow.

Flow

Forgot Password

↓

Enter Email

↓

Receive OTP

↓

Verify OTP

↓

Reset Password

↓

Login using New Password

Features

- Separate OTP Purpose
- Password Reset Verification
- Secure Reset Session
- OTP Expiry
- Resend OTP

---

## Security

Implemented

- BCrypt Password Encryption
- JWT Token Authentication
- Role Based Authorization
- Spring Security
- Global Exception Handling

Custom Exceptions

- BadRequestException
- ResourceNotFoundException
- DuplicateResourceException
- AuthException

---

# 📅 Appointment Module

Implemented Features

### Patient

- Book Appointment
- Cancel Appointment
- Reschedule Appointment
- View Appointment History

### Receptionist

- Book Appointment
- Update Appointment
- Cancel Appointment
- Reschedule Appointment

### Doctor

- Confirm Appointment
- Cancel Appointment
- Complete Appointment

---

## Appointment Validations

- Duplicate Appointment Prevention
- Doctor Slot Validation
- Patient Slot Validation
- Appointment Status Validation
- Cancelled Appointment cannot be Rescheduled

---

# 📧 Email Integration

Integrated Gmail SMTP.

Current Emails

- Email Verification OTP
- Forgot Password OTP

Upcoming

- Appointment Confirmation
- Appointment Cancellation
- Appointment Reschedule
- Appointment Completion
- Welcome Email

---

# 🎨 Frontend Features

- Responsive UI
- Premium Dashboard Design
- Glassmorphism UI
- SweetAlert Notifications
- Loading Buttons
- Form Validation
- Professional Error Messages

---

# 📂 Project Structure

Backend

```
Spring Boot
│
├── Authentication
├── Security
├── Appointment
├── Doctor
├── Patient
├── Receptionist
├── Department
├── Category
├── OTP
├── Exception
└── Medical Records (Upcoming)
```

Frontend

```
Angular
│
├── Authentication
├── Admin Dashboard
├── Receptionist Dashboard
├── Doctor Dashboard
├── Patient Dashboard
├── Shared
├── Services
└── Components
```

---

# ✅ Completed Modules

- Authentication
- Registration
- Email Verification
- Forgot Password
- JWT Security
- Appointment Booking
- Appointment Rescheduling
- Appointment Cancellation
- Doctor Status Update
- Dashboard UI
- Global Exception Handling
- Email Integration

---

# 🚧 Upcoming Features

- Medical Records
- Prescription Module
- PDF Generation
- Appointment Email Notifications
- SMS Notifications
- Google Login
- Billing Module
- Reports & Analytics
- Admin Reports
- Doctor Availability Calendar

---

# 📌 Future Enhancements

- Google OAuth Login
- SMS OTP Login
- Appointment Reminder Emails
- Prescription PDF Email
- Cloud Deployment
- Docker Support
- CI/CD Pipeline
- Unit Testing
- Audit Logs

---

# 📷 Screenshots

(Add screenshots here)

- Login
- Registration
- OTP Verification
- Forgot Password
- Dashboards
- Appointment Booking

---

# 👨‍💻 Developed By

**Shubham Sahu**

Full Stack Developer

Java | Spring Boot | Angular | PostgreSQL

---

# ⭐ Current Status

✅ Authentication Module Completed

✅ Appointment Module Completed

🚧 Medical Records Module In Progress
