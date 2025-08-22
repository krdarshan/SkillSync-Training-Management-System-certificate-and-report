# SkillSync Backend

Spring Boot backend for the SkillSync Training Management System.

## Features

- **Employee Registration**: New employees can register with email and password
- **Authentication**: JWT-based authentication for all users
- **Course Management**: Track course enrollments and progress
- **Progress Tracking**: Monitor employee progress in enrolled courses
- **Certificate Generation**: Automatic certificate generation upon course completion
- **Role-based Access**: Support for Employee, Trainer, and Manager roles

## Technology Stack

- **Spring Boot 3.2.0**
- **Spring Security** with JWT
- **Spring Data JPA**
- **MySQL 8.0**
- **Maven**

## Prerequisites

- Java 17 or higher
- MySQL 8.0
- Maven 3.6+

## Database Setup

1. Make sure MySQL is running on localhost:3306
2. Create a database named `SkillProject` (or it will be created automatically)
3. Update database credentials in `application.properties` if needed

## Running the Application

1. **Clone and navigate to the backend directory:**
   ```bash
   cd skillsync-backend
   ```

2. **Build the project:**
   ```bash
   mvn clean install
   ```

3. **Run the application:**
   ```bash
   mvn spring-boot:run
   ```

The application will start on `http://localhost:8080`

## API Endpoints

### Authentication
- `POST /api/register` - Register new employee
- `POST /api/auth/login` - Login user
- `GET /api/auth/validate` - Validate JWT token

### Enrollments
- `POST /api/enrollments/enroll/{courseId}?userEmail={email}` - Enroll in course
- `GET /api/enrollments/user/{userEmail}` - Get user enrollments
- `GET /api/enrollments/user/{userEmail}/status/{status}` - Get enrollments by status
- `PUT /api/enrollments/{enrollmentId}/progress?progressPercentage={percentage}` - Update progress
- `PUT /api/enrollments/{enrollmentId}/complete` - Complete course
- `GET /api/enrollments/user/{userEmail}/stats` - Get user statistics

## Sample Data

The application automatically initializes with sample data:

### Users
- **Trainer**: trainer@skillsync.com / password123
- **Manager**: manager@skillsync.com / password123

### Courses
- JavaScript Fundamentals
- React Development
- Database Design
- Python Programming
- Agile Project Management

## Database Schema

### Users Table
- id (Primary Key)
- name
- email (Unique)
- password (Encrypted)
- role (EMPLOYEE, TRAINER, MANAGER)
- created_at
- updated_at

### Courses Table
- id (Primary Key)
- name
- description
- category
- trainer_id (Foreign Key to Users)
- total_duration
- created_at
- updated_at

### Enrollments Table
- id (Primary Key)
- user_id (Foreign Key to Users)
- course_id (Foreign Key to Courses)
- status (ENROLLED, IN_PROGRESS, COMPLETED, CANCELLED)
- progress_percentage
- completed_at
- certificate_id
- enrolled_at
- updated_at

## Security

- JWT-based authentication
- Password encryption using BCrypt
- CORS enabled for frontend integration
- Role-based access control

## Configuration

Update `application.properties` for:
- Database connection
- JWT secret and expiration
- Server port
- CORS settings 