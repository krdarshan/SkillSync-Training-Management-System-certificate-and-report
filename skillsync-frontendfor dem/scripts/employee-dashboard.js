// Declare necessary variables or import them here
const checkPageAuth = () => true // Placeholder for actual authentication check
const getCurrentUser = () => ({ name: "John Doe", role: "employee" }) // Placeholder for actual user retrieval
const logout = () => console.log("Logging out...") // Placeholder for actual logout functionality
const generateCertificatePDF = (courseName, certificateId, userName) =>
  console.log(`Generating PDF certificate for ${courseName} with ID ${certificateId} for ${userName}`) // Placeholder for actual certificate generation
const downloadCertificateHTML = (courseName, certificateId, userName) =>
  console.log(`Downloading HTML certificate for ${courseName} with ID ${certificateId} for ${userName}`) // Placeholder for actual certificate download

document.addEventListener("DOMContentLoaded", () => {
  // Check authentication first
  if (!checkPageAuth()) return

  // Check if user has employee role
  const user = getCurrentUser()
  if (!user || user.role !== "employee") {
    alert("Access denied. Employee role required.")
    logout()
    return
  }

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

function loadEmployeeStats() {
  // Get enrolled courses from localStorage or use defaults
  const enrolledCourses = JSON.parse(localStorage.getItem("enrolledCourses") || "[]")
  const completedCourses = enrolledCourses.filter((course) => course.status === "Completed")
  const inProgressCourses = enrolledCourses.filter((course) => course.status === "In Progress")

  const stats = {
    enrolledCourses: enrolledCourses.length || 8,
    completedCourses: completedCourses.length || 5,
    inProgressCourses: inProgressCourses.length || 3,
    certificates: completedCourses.length || 5,
  }

  console.log("Employee stats loaded:", stats)
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

function loadCurrentCourses() {
  // Load from localStorage or use defaults
  const defaultCourses = [
    {
      id: 1,
      name: "JavaScript Fundamentals",
      trainer: "Sarah Trainer",
      progress: 75,
      status: "In Progress",
      certificateId: "CERT-JS-2024-001",
    },
    {
      id: 2,
      name: "React Development",
      trainer: "Sarah Trainer",
      progress: 100,
      status: "Completed",
      certificateId: "CERT-REACT-2024-002",
    },
    {
      id: 3,
      name: "Database Design",
      trainer: "Mike Manager",
      progress: 30,
      status: "In Progress",
      certificateId: null,
    },
  ]

  const courses = JSON.parse(localStorage.getItem("enrolledCourses") || JSON.stringify(defaultCourses))
  window.currentCourses = courses
  localStorage.setItem("enrolledCourses", JSON.stringify(courses))
  console.log("Current courses loaded:", courses)
}

function loadAvailableCourses() {
  const availableCourses = [
    {
      id: 4,
      name: "Python Programming",
      description: "Learn Python from basics to advanced concepts",
      duration: "40 hours",
      trainer: "Sarah Trainer",
    },
    {
      id: 5,
      name: "Project Management",
      description: "Master project management methodologies",
      duration: "30 hours",
      trainer: "Mike Manager",
    },
  ]

  window.availableCourses = availableCourses
  console.log("Available courses loaded:", availableCourses)
}

function loadRecentActivity() {
  const activities = [
    {
      id: 1,
      type: "completion",
      title: "Completed React Development",
      time: "2 hours ago",
      icon: "fas fa-check",
    },
    {
      id: 2,
      type: "start",
      title: "Started JavaScript Fundamentals",
      time: "1 day ago",
      icon: "fas fa-play",
    },
    {
      id: 3,
      type: "certificate",
      title: "Received HTML/CSS Certificate",
      time: "3 days ago",
      icon: "fas fa-certificate",
    },
  ]

  console.log("Recent activity loaded:", activities)
}

function setupEventListeners() {
  // Course action buttons
  document.addEventListener("click", handleCourseActions)

  // Navigation links
  const navLinks = document.querySelectorAll(".nav-menu a")
  navLinks.forEach((link) => {
    link.addEventListener("click", handleNavigation)
  })

  // Quick action buttons
  const quickActionButtons = document.querySelectorAll(".btn")
  quickActionButtons.forEach((button) => {
    button.addEventListener("click", handleQuickActions)
  })
}

function handleNavigation(e) {
  const href = e.target.getAttribute("href")
  if (href && href !== "#") {
    // Let the browser handle the navigation naturally
    return true
  }
  e.preventDefault()
}

function handleCourseActions(e) {
  const target = e.target
  const button = target.closest("button")

  if (!button) return

  const buttonText = button.textContent.trim()

  if (buttonText === "Continue" || buttonText.includes("Continue")) {
    e.preventDefault()
    const courseRow = button.closest("tr")
    const courseName = courseRow?.querySelector("td:first-child")?.textContent?.trim()
    if (courseName) {
      continueCourse(courseName)
    }
  } else if (buttonText.includes("Certificate")) {
    e.preventDefault()
    const courseRow = button.closest("tr")
    const courseName = courseRow?.querySelector("td:first-child")?.textContent?.trim()
    if (courseName) {
      downloadCertificate(courseName)
    }
  } else if (buttonText === "Enroll Now" || buttonText.includes("Enroll")) {
    e.preventDefault()
    const courseCard = button.closest(".card")
    const courseName = courseCard?.querySelector("h4")?.textContent?.trim()
    if (courseName && confirm(`Do you want to enroll in "${courseName}"?`)) {
      enrollInCourse(courseName)
    }
  }
}

function handleQuickActions(e) {
  const target = e.target
  const button = target.closest("button") || target.closest("a")

  if (!button) return

  const buttonText = button.textContent.trim()

  if (buttonText.includes("Update Profile")) {
    e.preventDefault()
    window.location.href = "employee-profile.html"
  } else if (buttonText.includes("View All Courses")) {
    // Let the link work naturally
    return true
  } else if (buttonText.includes("My Certificates")) {
    // Let the link work naturally
    return true
  }
}

function downloadCertificate(courseName) {
  const user = getCurrentUser()
  if (!user) {
    showNotification("Please log in to download certificates.", "error")
    return
  }

  if (!courseName) {
    showNotification("Course name not found. Please try again.", "error")
    return
  }

  showNotification(`Preparing certificate for "${courseName}"...`, "info")

  // Generate certificate ID
  const certificateId = `CERT-${courseName.replace(/\s+/g, "").toUpperCase()}-${new Date().getFullYear()}-${Math.floor(
    Math.random() * 1000,
  )
    .toString()
    .padStart(3, "0")}`

  // Simulate certificate generation delay
  setTimeout(() => {
    try {
      // Try HTML certificate first (this will actually download)
      const success = downloadCertificateHTML(courseName, certificateId, user.name)
      if (success) {
        showNotification(`Certificate for "${courseName}" downloaded successfully!`, "success")
      } else {
        // Fallback to text certificate
        const textSuccess = downloadTextCertificate(courseName, certificateId, user.name)
        if (textSuccess) {
          showNotification(`Certificate for "${courseName}" downloaded as text file!`, "success")
        } else {
          throw new Error("All certificate generation methods failed")
        }
      }
    } catch (error) {
      console.error("Certificate generation error:", error)
      showNotification("Error generating certificate. Please try again.", "error")
    }
  }, 1000)
}

function enrollInCourse(courseName) {
  if (!courseName) {
    showNotification("Course name is required for enrollment.", "error")
    return
  }

  showNotification(`Enrolling in "${courseName}"...`, "info")

  // Simulate API call
  setTimeout(() => {
    try {
      // Get existing enrolled courses
      const enrolledCourses = JSON.parse(localStorage.getItem("enrolledCourses") || "[]")

      // Check if already enrolled
      const alreadyEnrolled = enrolledCourses.some((course) => course.name === courseName)
      if (alreadyEnrolled) {
        showNotification(`You are already enrolled in "${courseName}".`, "warning")
        return
      }

      // Create new course object
      const newCourse = {
        id: Date.now(),
        name: courseName,
        trainer: "Sarah Trainer",
        progress: 0,
        status: "In Progress",
        certificateId: null,
        enrolledDate: new Date().toISOString(),
        dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString(), // 90 days from now
      }

      // Add to enrolled courses
      enrolledCourses.push(newCourse)
      localStorage.setItem("enrolledCourses", JSON.stringify(enrolledCourses))

      showNotification(`Successfully enrolled in "${courseName}"!`, "success")

      // Update the UI immediately
      setTimeout(() => {
        showNotification("Updating your dashboard...", "info")
        // Reload the page to show updated data
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      }, 1500)
    } catch (error) {
      console.error("Enrollment error:", error)
      showNotification("Error enrolling in course. Please try again.", "error")
    }
  }, 1000)
}

function continueCourse(courseName) {
  showNotification(`Opening "${courseName}" course content...`, "info")

  // Simulate navigation to course content
  setTimeout(() => {
    showNotification("Course content would open here in a real application.", "info")
  }, 1000)
}

function downloadTextCertificate(courseName, certificateId, userName) {
  const certificateContent = generateSimpleCertificate(courseName, certificateId, userName)
  const blob = new Blob([certificateContent], { type: "text/plain" })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `${courseName.replace(/\s+/g, "_")}_Certificate_${certificateId}.txt`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
  return true
}

function generateSimpleCertificate(courseName, certificateId, userName) {
  const currentDate = new Date().toLocaleDateString()

  return `
═══════════════════════════════════════════════════════════════════════════════
                            SKILLSYNC TRAINING SYSTEM
                            CERTIFICATE OF COMPLETION
═══════════════════════════════════════════════════════════════════════════════

This is to certify that

                                ${userName}

has successfully completed the course

                            ${courseName}

Certificate ID: ${certificateId}
Date of Completion: ${currentDate}
Issued by: SkillSync Training System

This certificate verifies that the above-named individual has completed all 
requirements for the specified training program and demonstrates competency 
in the subject matter.

═══════════════════════════════════════════════════════════════════════════════
                        Digital Certificate - Valid and Authentic
                            SkillSync Training Tracker System
═══════════════════════════════════════════════════════════════════════════════
  `
}

function showNotification(message, type = "info") {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll(".notification")
  existingNotifications.forEach((notification) => notification.remove())

  // Create notification element
  const notification = document.createElement("div")
  notification.className = "notification"

  const colors = {
    success: { bg: "#dcfce7", color: "#166534", border: "#bbf7d0" },
    error: { bg: "#fee2e2", color: "#991b1b", border: "#fecaca" },
    info: { bg: "#dbeafe", color: "#1e40af", border: "#bfdbfe" },
    warning: { bg: "#fef3c7", color: "#92400e", border: "#fde68a" },
  }

  const colorScheme = colors[type] || colors.info

  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${colorScheme.bg};
    color: ${colorScheme.color};
    border: 1px solid ${colorScheme.border};
    padding: 1rem 1.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    max-width: 400px;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    animation: slideIn 0.3s ease-out;
  `

  const icons = {
    success: "fas fa-check-circle",
    error: "fas fa-exclamation-circle",
    info: "fas fa-info-circle",
    warning: "fas fa-exclamation-triangle",
  }

  notification.innerHTML = `
    <i class="${icons[type] || icons.info}"></i>
    <span>${message}</span>
    <button onclick="this.parentElement.remove()" style="
      background: none;
      border: none;
      color: inherit;
      cursor: pointer;
      margin-left: auto;
      padding: 0;
      font-size: 1.2rem;
    ">×</button>
  `

  // Add CSS animation
  const style = document.createElement("style")
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
  if (!document.head.querySelector("style[data-notification]")) {
    style.setAttribute("data-notification", "true")
    document.head.appendChild(style)
  }

  document.body.appendChild(notification)

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove()
    }
  }, 5000)
}

// Progress bar animation
function animateProgressBars() {
  const progressBars = document.querySelectorAll("[style*='width:']")
  progressBars.forEach((bar) => {
    const width = bar.style.width
    bar.style.width = "0%"
    setTimeout(() => {
      bar.style.transition = "width 1s ease-out"
      bar.style.width = width
    }, 100)
  })
}

// Initialize progress bar animation when page loads
setTimeout(animateProgressBars, 500)
