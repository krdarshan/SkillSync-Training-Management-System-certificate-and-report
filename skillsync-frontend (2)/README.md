# SkillSync - Training Management System

A comprehensive training management system with role-based access control, course enrollment, progress tracking, and certificate generation.

## Project Structure

```
skillsync-project/
├── skillsync-frontend/          # Frontend (HTML/CSS/JavaScript)
│   ├── index.html              # Login/Registration page
│   ├── employee-dashboard.html  # Employee dashboard
│   ├── employee-courses.html    # Course management
│   ├── employee-certificates.html # Certificate downloads
│   ├── employee-profile.html    # User profile
│   ├── manager-dashboard.html   # Manager analytics
│   ├── trainer-dashboard.html   # Trainer interface
│   ├── scripts/                # JavaScript files
│   └── styles/                 # CSS files
└── skillsync-backend/          # Backend (Spring Boot)
    ├── src/main/java/com/skillsync/
    │   ├── controller/         # REST controllers
    │   ├── service/           # Business logic
    │   ├── repository/        # Data access
    │   ├── entity/           # Database entities
    │   ├── dto/              # Data transfer objects
    │   ├── security/         # JWT and security
    │   └── config/           # Configuration
    └── src/main/resources/
        └── application.properties
```

## Features

### 🔐 Authentication & Authorization
- **Employee Registration**: New employees can register with email and password
- **JWT Authentication**: Secure token-based authentication
- **Role-based Access**: Employee, Trainer, and Manager roles
- **Password Encryption**: BCrypt password hashing

### 📚 Course Management
- **Course Catalog**: Browse available courses
- **Enrollment System**: Enroll in courses with progress tracking
- **Progress Monitoring**: Real-time progress updates
- **Certificate Generation**: Automatic certificates upon completion

### 📊 Analytics & Reporting
- **Employee Dashboard**: Personal learning statistics
- **Manager Analytics**: System-wide training overview
- **Trainer Interface**: Course and student management

### 🎯 User Roles

#### Employee
- Register new account
- Browse and enroll in courses
- Track learning progress
- Download completion certificates
- View personal statistics

#### Trainer
- Manage assigned courses
- View student progress
- Generate certificates
- Course content management

#### Manager/Admin
- System-wide analytics
- User management
- Course administration
- Training reports
- System configuration

## Technology Stack

### Frontend
- **HTML5/CSS3**: Modern responsive design
- **JavaScript (ES6+)**: Dynamic functionality
- **Font Awesome**: UI icons
- **Local Storage**: Session management

### Backend
- **Spring Boot 3.2.0**: Main framework
- **Spring Security**: Authentication & authorization
- **Spring Data JPA**: Database operations
- **MySQL 8.0**: Database
- **JWT**: Token-based authentication
- **Maven**: Build tool

## Prerequisites

- Java 17 or higher
- MySQL 8.0
- Maven 3.6+
- Modern web browser

## Database Setup

1. **Start MySQL Server**
   ```bash
   # Make sure MySQL is running on localhost:3306
   ```

2. **Database Configuration**
   - Database: `SkillProject` (auto-created)
   - Username: `root`
   - Password: `Darshan@123`
   - Port: `3306`

## Installation & Setup

### 1. Backend Setup

```bash
# Navigate to backend directory
cd skillsync-backend

# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd skillsync-frontend

# Open index.html in a web browser
# Or serve using a local server
```

## API Endpoints

### Authentication
- `POST /api/register` - Register new employee
- `POST /api/auth/login` - Login user
- `GET /api/auth/validate` - Validate JWT token

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/{id}` - Get course by ID
- `GET /api/courses/category/{category}` - Get courses by category
- `GET /api/courses/search?name={name}` - Search courses

### Enrollments
- `POST /api/enrollments/enroll/{courseId}?userEmail={email}` - Enroll in course
- `GET /api/enrollments/user/{userEmail}` - Get user enrollments
- `GET /api/enrollments/user/{userEmail}/status/{status}` - Get enrollments by status
- `PUT /api/enrollments/{enrollmentId}/progress?progressPercentage={percentage}` - Update progress
- `PUT /api/enrollments/{enrollmentId}/complete` - Complete course
- `GET /api/enrollments/user/{userEmail}/stats` - Get user statistics

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('EMPLOYEE', 'TRAINER', 'MANAGER') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Courses Table
```sql
CREATE TABLE courses (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    trainer_id BIGINT,
    total_duration INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (trainer_id) REFERENCES users(id)
);
```

### Enrollments Table
```sql
CREATE TABLE enrollments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    course_id BIGINT NOT NULL,
    status ENUM('ENROLLED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED') NOT NULL,
    progress_percentage INT DEFAULT 0,
    completed_at TIMESTAMP NULL,
    certificate_id VARCHAR(255),
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (course_id) REFERENCES courses(id)
);
```

## Sample Data

The application automatically initializes with sample data:

### Users
- **Trainer**: trainer@skillsync.com / password123
- **Manager**: manager@skillsync.com / password123

### Courses
- JavaScript Fundamentals (8 hours)
- React Development (10 hours)
- Database Design (6 hours)
- Python Programming (9 hours)
- Agile Project Management (7 hours)

## Usage Guide

### For New Employees
1. Open the application in your browser
2. Click "Register here" on the login page
3. Fill in your details and create an account
4. Browse available courses and enroll
5. Track your progress and download certificates

### For Trainers
1. Login with trainer credentials
2. Manage assigned courses
3. Monitor student progress
4. Generate certificates for completed courses

### For Managers
1. Login with manager credentials
2. View system-wide analytics
3. Manage users and courses
4. Generate training reports

## Security Features

- **JWT Authentication**: Secure token-based sessions
- **Password Encryption**: BCrypt hashing
- **CORS Configuration**: Cross-origin resource sharing
- **Input Validation**: Server-side validation
- **Role-based Access**: Permission-based functionality

## Development

### Backend Development
```bash
# Run with hot reload
mvn spring-boot:run

# Run tests
mvn test

# Build JAR
mvn clean package
```

### Frontend Development
- Edit HTML/CSS/JavaScript files
- Test in browser
- Use browser developer tools for debugging

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify MySQL is running
   - Check database credentials in `application.properties`
   - Ensure database `SkillProject` exists

2. **CORS Errors**
   - Check CORS configuration in `SecurityConfig.java`
   - Verify frontend URL is allowed

3. **JWT Token Issues**
   - Check JWT secret in `application.properties`
   - Verify token expiration settings

4. **Frontend-Backend Connection**
   - Ensure backend is running on port 8080
   - Check API_BASE_URL in frontend JavaScript files

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational purposes.

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review the API documentation
3. Check browser console for errors
4. Verify database connectivity

---

**SkillSync** - Empowering learning through technology 