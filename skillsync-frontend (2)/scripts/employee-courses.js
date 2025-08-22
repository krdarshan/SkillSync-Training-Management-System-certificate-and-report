document.addEventListener("DOMContentLoaded", () => {
  // Check authentication first
  const checkPageAuth = () => {
    // Placeholder for authentication check
    return true
  }

  const getCurrentUser = () => {
    // Placeholder for getting current user
    return { name: "John Doe", role: "employee" }
  }

  const logout = () => {
    // Placeholder for logout functionality
    console.log("Logging out...")
  }

  if (!checkPageAuth()) return

  const user = getCurrentUser()
  if (!user || user.role !== "employee") {
    alert("Access denied. Employee role required.")
    logout()
    return
  }

  initializeCoursesPage()
})

function initializeCoursesPage() {
  const user = getCurrentUser()
  if (!user) return

  updateUserInterface(user)
  loadEnrolledCourses()
  loadAvailableCourses()
  setupEventListeners()
}

function updateUserInterface(user) {
  const userNameElement = document.getElementById("userName")
  const userAvatarElement = document.getElementById("userAvatar")

  if (userNameElement) userNameElement.textContent = user.name
  if (userAvatarElement) userAvatarElement.textContent = getInitials(user.name)
}

function getInitials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}

function loadEnrolledCourses() {
  // Load from localStorage or use defaults
  const defaultCourses = [
    {
      id: 1,
      name: "JavaScript Fundamentals",
      trainer: "Sarah Trainer",
      progress: 75,
      status: "In Progress",
      dueDate: "Dec 31, 2024",
      category: "programming",
      certificateId: null,
    },
    {
      id: 2,
      name: "React Development",
      trainer: "Sarah Trainer",
      progress: 100,
      status: "Completed",
      dueDate: "Nov 15, 2024",
      category: "programming",
      certificateId: "CERT-REACT-2024-002",
    },
    {
      id: 3,
      name: "Database Design",
      trainer: "Mike Manager",
      progress: 30,
      status: "In Progress",
      dueDate: "Jan 15, 2025",
      category: "programming",
      certificateId: null,
    },
  ]

  const enrolledCourses = JSON.parse(localStorage.getItem("enrolledCourses") || JSON.stringify(defaultCourses))
  window.enrolledCourses = enrolledCourses
  localStorage.setItem("enrolledCourses", JSON.stringify(enrolledCourses))
  console.log("Enrolled courses loaded:", enrolledCourses)
}

function loadAvailableCourses() {
  const availableCourses = [
    {
      id: 4,
      name: "Python Programming",
      description: "Learn Python from basics to advanced concepts including data structures and algorithms",
      duration: "40 hours",
      trainer: "Sarah Trainer",
      category: "programming",
    },
    {
      id: 5,
      name: "Project Management",
      description: "Master project management methodologies including Agile and Scrum frameworks",
      duration: "30 hours",
      trainer: "Mike Manager",
      category: "management",
    },
    {
      id: 6,
      name: "UI/UX Design",
      description: "Learn user interface and user experience design principles and tools",
      duration: "35 hours",
      trainer: "Sarah Trainer",
      category: "design",
    },
    {
      id: 7,
      name: "Digital Marketing",
      description: "Comprehensive digital marketing strategies including SEO, social media, and analytics",
      duration: "25 hours",
      trainer: "Mike Manager",
      category: "marketing",
    },
  ]

  window.availableCourses = availableCourses
  console.log("Available courses loaded:", availableCourses)
}

function setupEventListeners() {
  document.addEventListener("click", handleCourseActions)

  // Navigation links
  const navLinks = document.querySelectorAll(".nav-menu a")
  navLinks.forEach((link) => {
    link.addEventListener("click", handleNavigation)
  })

  // Filter inputs
  const filterInputs = document.querySelectorAll("#statusFilter, #categoryFilter, #searchCourse")
  filterInputs.forEach((input) => {
    input.addEventListener("change", filterCourses)
    input.addEventListener("input", filterCourses)
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

  if (buttonText.includes("Continue")) {
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
  } else if (buttonText.includes("Enroll Now")) {
    e.preventDefault()
    const courseCard = button.closest(".card")
    const courseName = courseCard?.querySelector("h4")?.textContent?.trim()
    if (courseName && confirm(`Do you want to enroll in "${courseName}"?`)) {
      enrollInCourse(courseName)
    }
  } else if (buttonText.includes("Update Profile")) {
    e.preventDefault()
    window.location.href = "employee-profile.html"
  } else if (buttonText.includes("Filter")) {
    e.preventDefault()
    filterCourses()
  }
}

function continueCourse(courseName) {
  showNotification(`Opening "${courseName}" course content...`, "info")
  setTimeout(() => {
    showNotification("Course content would open here in a real application.", "info")
  }, 1000)
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

  setTimeout(() => {
    try {
      // Try HTML certificate download (this will actually work)
      const success = downloadCertificateHTML(courseName, certificateId, user.name)
      if (success) {
        showNotification(`Certificate for "${courseName}" downloaded successfully!`, "success")
      } else {
        // Fallback to text certificate
        const textSuccess = downloadTextCertificate(courseName, certificateId, user.name)
        if (textSuccess) {
          showNotification(`Certificate for "${courseName}" downloaded as text file!`, "success")
        } else {
          throw new Error("Certificate generation failed")
        }
      }
    } catch (error) {
      console.error("Certificate download error:", error)
      showNotification("Error downloading certificate. Please try again.", "error")
    }
  }, 1500)
}

function enrollInCourse(courseName) {
  if (!courseName) {
    showNotification("Course name is required for enrollment.", "error")
    return
  }

  showNotification(`Enrolling in "${courseName}"...`, "info")

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

      // Find course details from available courses
      const availableCourses = window.availableCourses || []
      const courseDetails = availableCourses.find((course) => course.name === courseName)

      // Create new course object
      const newCourse = {
        id: Date.now(),
        name: courseName,
        trainer: courseDetails ? courseDetails.trainer : "Sarah Trainer",
        progress: 0,
        status: "In Progress",
        dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
        category: courseDetails ? courseDetails.category : "programming",
        certificateId: null,
        enrolledDate: new Date().toISOString(),
      }

      // Add to enrolled courses
      enrolledCourses.push(newCourse)
      localStorage.setItem("enrolledCourses", JSON.stringify(enrolledCourses))

      showNotification(`Successfully enrolled in "${courseName}"!`, "success")

      // Update the UI
      setTimeout(() => {
        showNotification("Course added to your enrolled courses. Refreshing page...", "info")
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      }, 1000)
    } catch (error) {
      console.error("Enrollment error:", error)
      showNotification("Error enrolling in course. Please try again.", "error")
    }
  }, 1000)
}

function updateProfile() {
  window.location.href = "employee-profile.html"
}

function filterCourses() {
  const statusFilter = document.getElementById("statusFilter")?.value.toLowerCase()
  const categoryFilter = document.getElementById("categoryFilter")?.value.toLowerCase()
  const searchTerm = document.getElementById("searchCourse")?.value.toLowerCase()

  // Filter enrolled courses
  const enrolledRows = document.querySelectorAll("#enrolledCoursesTable tr")
  enrolledRows.forEach((row) => {
    const courseName = row.querySelector("td:first-child")?.textContent.toLowerCase()
    const status = row.querySelector(".badge")?.textContent.toLowerCase()

    let showRow = true

    if (statusFilter && !status.includes(statusFilter.replace("-", " "))) {
      showRow = false
    }

    if (searchTerm && !courseName.includes(searchTerm)) {
      showRow = false
    }

    row.style.display = showRow ? "" : "none"
  })

  // Filter available courses
  const availableCards = document.querySelectorAll("#availableCoursesGrid .card")
  availableCards.forEach((card) => {
    const courseName = card.querySelector("h4")?.textContent.toLowerCase()
    const category = card.querySelector(".badge")?.textContent.toLowerCase()

    let showCard = true

    if (categoryFilter && !category.includes(categoryFilter)) {
      showCard = false
    }

    if (searchTerm && !courseName.includes(searchTerm)) {
      showCard = false
    }

    card.style.display = showCard ? "" : "none"
  })

  showNotification("Courses filtered successfully!", "success")
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
  const existingNotifications = document.querySelectorAll(".notification")
  existingNotifications.forEach((notification) => notification.remove())

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

  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove()
    }
  }, 5000)
}

function downloadCertificateHTML(courseName, certificateId, userName) {
  // This function is now defined in certificate-generator.js
  if (typeof window.downloadCertificateHTML === "function") {
    return window.downloadCertificateHTML(courseName, certificateId, userName)
  }
  // Fallback implementation
  try {
    const certificateContent = generateCertificateHTML(courseName, certificateId, userName)
    const blob = new Blob([certificateContent], { type: "text/html;charset=utf-8" })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${courseName.replace(/[^a-zA-Z0-9]/g, "_")}_Certificate_${certificateId}.html`
    link.style.display = "none"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setTimeout(() => window.URL.revokeObjectURL(url), 1000)
    return true
  } catch (error) {
    console.error("Certificate download error:", error)
    return false
  }
}

function downloadTextCertificate(courseName, certificateId, userName) {
  // This function is now defined in certificate-generator.js
  if (typeof window.downloadTextCertificate === "function") {
    return window.downloadTextCertificate(courseName, certificateId, userName)
  }
  // Fallback implementation
  try {
    const certificateContent = generateSimpleCertificate(courseName, certificateId, userName)
    const blob = new Blob([certificateContent], { type: "text/plain;charset=utf-8" })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${courseName.replace(/[^a-zA-Z0-9]/g, "_")}_Certificate_${certificateId}.txt`
    link.style.display = "none"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setTimeout(() => window.URL.revokeObjectURL(url), 1000)
    return true
  } catch (error) {
    console.error("Text certificate download error:", error)
    return false
  }
}

function generateCertificateHTML(courseName, certificateId, userName) {
  // Placeholder for HTML certificate generation
  return `
    <html>
      <head>
        <title>Certificate of Completion</title>
      </head>
      <body>
        <h1>Certificate of Completion</h1>
        <p>This is to certify that ${userName} has successfully completed the course ${courseName}.</p>
        <p>Certificate ID: ${certificateId}</p>
        <p>Date of Completion: ${new Date().toLocaleDateString()}</p>
        <p>Issued by: SkillSync Training System</p>
      </body>
    </html>
  `
}
