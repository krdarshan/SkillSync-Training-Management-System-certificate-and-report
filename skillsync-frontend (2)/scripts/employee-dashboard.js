// Employee Dashboard with Backend Integration
const API_BASE_URL = "http://localhost:8080/api"

// Use the real authentication functions from auth.js
// These functions are already defined in auth.js and will be available here

// Employee Dashboard with Backend Integration
const API_BASE_URL = "http://localhost:8080/api"

document.addEventListener("DOMContentLoaded", () => {
  // Check authentication and role using the improved auth function
  if (!requireRole("employee")) return

  // Initialize dashboard
  initializeEmployeeDashboard()
})

function initializeEmployeeDashboard() {
  const user = getCurrentUser()
  if (!user) return

  // Update user info in header
  updateUserInterface(user)

  // Load dashboard data
  loadEmployeeStats()
  loadCurrentCourses()
  loadAvailableCourses()
  loadRecentActivity()

  // Add event listeners
  setupEventListeners()
}

function updateUserInterface(user) {
  const userNameElement = document.getElementById("userName")
  const welcomeNameElement = document.getElementById("welcomeName")
  const userAvatarElement = document.getElementById("userAvatar")

  if (userNameElement) userNameElement.textContent = user.name
  if (welcomeNameElement) welcomeNameElement.textContent = user.name.split(" ")[0]
  if (userAvatarElement) userAvatarElement.textContent = getInitials(user.name)
}

function getInitials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}

async function loadEmployeeStats() {
  try {
    const user = getCurrentUser()
    const response = await fetch(`${API_BASE_URL}/enrollments/user/${user.email}/stats`, {
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    })

    if (response.ok) {
      const stats = await response.json()
      updateStatsDisplay(stats)
    } else {
      console.error("Failed to load stats")
      // Use default stats if API fails
      updateStatsDisplay({
        enrolledCourses: 0,
        completedCourses: 0,
        inProgressCourses: 0
      })
    }
  } catch (error) {
    console.error("Error loading stats:", error)
    // Use default stats if API fails
    updateStatsDisplay({
      enrolledCourses: 0,
      completedCourses: 0,
      inProgressCourses: 0
    })
  }
}

function updateStatsDisplay(stats) {
  const statElements = document.querySelectorAll(".stat-value")
  if (statElements.length >= 4) {
    statElements[0].textContent = stats.enrolledCourses || 0
    statElements[1].textContent = stats.completedCourses || 0
    statElements[2].textContent = stats.inProgressCourses || 0
    statElements[3].textContent = stats.completedCourses || 0 // Certificates count
  }
  
  animateStats()
}

function animateStats() {
  const statValues = document.querySelectorAll(".stat-value")
  statValues.forEach((stat, index) => {
    const finalValue = Number.parseInt(stat.textContent)
    let currentValue = 0
    const increment = finalValue / 20

    const timer = setInterval(() => {
      currentValue += increment
      if (currentValue >= finalValue) {
        stat.textContent = finalValue
        clearInterval(timer)
      } else {
        stat.textContent = Math.floor(currentValue)
      }
    }, 50)
  })
}

async function loadCurrentCourses() {
  try {
    const user = getCurrentUser()
    const response = await fetch(`${API_BASE_URL}/enrollments/user/${user.email}`, {
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    })

    if (response.ok) {
      const enrollments = await response.json()
      displayCurrentCourses(enrollments)
    } else {
      console.error("Failed to load current courses")
      displayCurrentCourses([])
    }
  } catch (error) {
    console.error("Error loading current courses:", error)
    displayCurrentCourses([])
  }
}

function displayCurrentCourses(enrollments) {
  const currentCoursesContainer = document.querySelector(".current-courses")
  if (!currentCoursesContainer) return

  if (enrollments.length === 0) {
    currentCoursesContainer.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-book-open"></i>
        <p>No courses enrolled yet</p>
        <small>Browse available courses to get started</small>
      </div>
    `
    return
  }

  const coursesHTML = enrollments.map(enrollment => {
    const course = enrollment.course
    const progress = enrollment.progressPercentage || 0
    const status = enrollment.status || 'ENROLLED'
    
    return `
      <div class="course-card">
        <div class="course-header">
          <h3>${course.name}</h3>
          <span class="badge badge-${getStatusBadgeClass(status)}">${status}</span>
        </div>
        <p class="course-description">${course.description || 'No description available'}</p>
        <div class="course-progress">
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${progress}%"></div>
          </div>
          <span class="progress-text">${progress}% Complete</span>
        </div>
        <div class="course-actions">
          <button class="btn btn-primary btn-sm" onclick="continueCourse('${course.name}')">
            <i class="fas fa-play"></i> Continue
          </button>
          ${progress >= 100 ? `
            <button class="btn btn-success btn-sm" onclick="downloadCertificate('${course.name}', '${enrollment.certificateId}')">
              <i class="fas fa-certificate"></i> Certificate
            </button>
          ` : ''}
        </div>
      </div>
    `
  }).join('')

  currentCoursesContainer.innerHTML = coursesHTML
}

function getStatusBadgeClass(status) {
  switch (status) {
    case 'COMPLETED': return 'success'
    case 'IN_PROGRESS': return 'warning'
    case 'ENROLLED': return 'info'
    default: return 'info'
  }
}

async function loadAvailableCourses() {
  try {
    const response = await fetch(`${API_BASE_URL}/courses`)
    if (response.ok) {
      const courses = await response.json()
      displayAvailableCourses(courses)
    } else {
      console.error("Failed to load available courses")
      displayAvailableCourses([])
    }
  } catch (error) {
    console.error("Error loading available courses:", error)
    displayAvailableCourses([])
  }
}

function displayAvailableCourses(courses) {
  const availableCoursesContainer = document.querySelector(".available-courses")
  if (!availableCoursesContainer) return

  if (courses.length === 0) {
    availableCoursesContainer.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-search"></i>
        <p>No courses available</p>
      </div>
    `
    return
  }

  const coursesHTML = courses.map(course => `
    <div class="course-card">
      <div class="course-header">
        <h3>${course.name}</h3>
        <span class="badge badge-info">${course.category}</span>
      </div>
      <p class="course-description">${course.description || 'No description available'}</p>
      <div class="course-meta">
        <span><i class="fas fa-clock"></i> ${course.totalDuration || 0} mins</span>
        <span><i class="fas fa-user"></i> ${course.trainer?.name || 'Unknown Trainer'}</span>
      </div>
      <div class="course-actions">
        <button class="btn btn-primary btn-sm" onclick="enrollInCourse(${course.id})">
          <i class="fas fa-plus"></i> Enroll
        </button>
      </div>
    </div>
  `).join('')

  availableCoursesContainer.innerHTML = coursesHTML
}

function loadRecentActivity() {
  // This would typically load from the backend
  // For now, we'll show a placeholder
  const recentActivityContainer = document.querySelector(".recent-activity")
  if (recentActivityContainer) {
    recentActivityContainer.innerHTML = `
      <div class="activity-item">
        <div class="activity-icon">
          <i class="fas fa-graduation-cap"></i>
        </div>
        <div class="activity-content">
          <p>Welcome to SkillSync!</p>
          <small>Start your learning journey today</small>
        </div>
      </div>
    `
  }
}

function setupEventListeners() {
  // Navigation event listeners
  document.addEventListener("click", handleNavigation)
  
  // Course action event listeners
  document.addEventListener("click", handleCourseActions)

  // Quick action event listeners
  document.addEventListener("click", handleQuickActions)
}

function handleNavigation(e) {
  if (e.target.matches('nav a')) {
    e.preventDefault()
    const href = e.target.getAttribute('href')
    if (href) {
      window.location.href = href
    }
  }
}

function handleCourseActions(e) {
  if (e.target.matches('.course-actions button')) {
    e.preventDefault()
    const action = e.target.textContent.trim()
    const courseName = e.target.closest('.course-card').querySelector('h3').textContent
    
    if (action.includes('Continue')) {
      continueCourse(courseName)
    } else if (action.includes('Certificate')) {
      downloadCertificate(courseName)
    } else if (action.includes('Enroll')) {
      const courseId = e.target.getAttribute('onclick').match(/\d+/)[0]
      enrollInCourse(courseId)
    }
  }
}

function handleQuickActions(e) {
  if (e.target.matches('.quick-actions button')) {
    e.preventDefault()
    const action = e.target.textContent.trim()
    
    if (action.includes('Browse')) {
      window.location.href = 'employee-courses.html'
    } else if (action.includes('Certificates')) {
      window.location.href = 'employee-certificates.html'
    } else if (action.includes('Profile')) {
      window.location.href = 'employee-profile.html'
    }
  }
}

async function enrollInCourse(courseId) {
  try {
  const user = getCurrentUser()
    const response = await fetch(`${API_BASE_URL}/enrollments/enroll/${courseId}?userEmail=${user.email}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${user.token}`,
        'Content-Type': 'application/json'
      }
    })

    if (response.ok) {
      showNotification("Successfully enrolled in course!", "success")
      // Reload the dashboard to show updated data
  setTimeout(() => {
        loadEmployeeStats()
        loadCurrentCourses()
      }, 1000)
      } else {
      const error = await response.json()
      showNotification(error.error || "Failed to enroll in course", "error")
      }
    } catch (error) {
    console.error("Error enrolling in course:", error)
    showNotification("Network error. Please try again.", "error")
  }
}

async function continueCourse(courseName) {
  showNotification(`Continuing ${courseName}...`, "info")
  // In a real application, this would redirect to the course content
  // For now, we'll just show a notification
}

async function downloadCertificate(courseName, certificateId) {
  if (!certificateId) {
    showNotification("Certificate not available yet", "warning")
    return
  }

  try {
    const user = getCurrentUser()
    // This would typically call the backend to generate/download certificate
    showNotification(`Downloading certificate for ${courseName}...`, "success")
    
    // Simulate certificate download
      setTimeout(() => {
      showNotification("Certificate downloaded successfully!", "success")
    }, 2000)
    } catch (error) {
    console.error("Error downloading certificate:", error)
    showNotification("Failed to download certificate", "error")
  }
}

function showNotification(message, type = "info") {
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 20px;
    border-radius: 4px;
    color: white;
    font-weight: 500;
    z-index: 1000;
    animation: slideIn 0.3s ease-out;
  `

  // Set background color based on type
  switch (type) {
    case 'success':
      notification.style.backgroundColor = '#10b981'
      break
    case 'error':
      notification.style.backgroundColor = '#ef4444'
      break
    case 'warning':
      notification.style.backgroundColor = '#f59e0b'
      break
    default:
      notification.style.backgroundColor = '#3b82f6'
  }

  notification.textContent = message
  document.body.appendChild(notification)

  // Remove notification after 3 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove()
    }
  }, 3000)
}

function animateProgressBars() {
  const progressBars = document.querySelectorAll('.progress-fill')
  progressBars.forEach(bar => {
    const width = bar.style.width
    bar.style.width = '0%'
    setTimeout(() => {
      bar.style.width = width
    }, 100)
  })
}

// Add CSS animation for notifications
const style = document.createElement('style')
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `
    document.head.appendChild(style)
