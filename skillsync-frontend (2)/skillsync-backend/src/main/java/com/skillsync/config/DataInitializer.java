package com.skillsync.config;

import com.skillsync.entity.Course;
import com.skillsync.entity.User;
import com.skillsync.entity.UserRole;
import com.skillsync.repository.CourseRepository;
import com.skillsync.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private CourseRepository courseRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        // Initialize sample data only if no users exist
        if (userRepository.count() == 0) {
            initializeSampleData();
        }
    }
    
    private void initializeSampleData() {
        // Create sample trainers
        User sarahTrainer = new User();
        sarahTrainer.setName("Sarah Trainer");
        sarahTrainer.setEmail("trainer@skillsync.com");
        sarahTrainer.setPassword(passwordEncoder.encode("password123"));
        sarahTrainer.setRole(UserRole.TRAINER);
        userRepository.save(sarahTrainer);
        
        // Create sample managers
        User mikeManager = new User();
        mikeManager.setName("Mike Manager");
        mikeManager.setEmail("manager@skillsync.com");
        mikeManager.setPassword(passwordEncoder.encode("password123"));
        mikeManager.setRole(UserRole.MANAGER);
        userRepository.save(mikeManager);
        
        // Create sample courses
        Course jsCourse = new Course();
        jsCourse.setName("JavaScript Fundamentals");
        jsCourse.setDescription("Learn the basics of JavaScript programming language");
        jsCourse.setCategory("programming");
        jsCourse.setTrainer(sarahTrainer);
        jsCourse.setTotalDuration(480); // 8 hours
        courseRepository.save(jsCourse);
        
        Course reactCourse = new Course();
        reactCourse.setName("React Development");
        reactCourse.setDescription("Master React.js for building modern web applications");
        reactCourse.setCategory("programming");
        reactCourse.setTrainer(sarahTrainer);
        reactCourse.setTotalDuration(600); // 10 hours
        courseRepository.save(reactCourse);
        
        Course dbCourse = new Course();
        dbCourse.setName("Database Design");
        dbCourse.setDescription("Learn database design principles and SQL");
        dbCourse.setCategory("programming");
        dbCourse.setTrainer(mikeManager);
        dbCourse.setTotalDuration(360); // 6 hours
        courseRepository.save(dbCourse);
        
        Course pythonCourse = new Course();
        pythonCourse.setName("Python Programming");
        pythonCourse.setDescription("Introduction to Python programming language");
        pythonCourse.setCategory("programming");
        pythonCourse.setTrainer(sarahTrainer);
        pythonCourse.setTotalDuration(540); // 9 hours
        courseRepository.save(pythonCourse);
        
        Course agileCourse = new Course();
        agileCourse.setName("Agile Project Management");
        agileCourse.setDescription("Learn Agile methodologies and project management");
        agileCourse.setCategory("management");
        agileCourse.setTrainer(mikeManager);
        agileCourse.setTotalDuration(420); // 7 hours
        courseRepository.save(agileCourse);
        
        System.out.println("Sample data initialized successfully!");
    }
} 