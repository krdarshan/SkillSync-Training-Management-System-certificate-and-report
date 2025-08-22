// Trainer Dashboard with Backend Integration
// Use the real authentication functions from auth.js
// These functions are already defined in auth.js and will be available here

document.addEventListener("DOMContentLoaded", () => {
  // Check authentication and role using the improved auth function
  if (!requireRole("trainer")) return

  initializeTrainerDashboard()
})

function initializeTrainerDashboard() {
  const user = getCurrentUser()
  if (!user) return

  updateUserInterface(user)
  loadTrainerStats()
  loadMyCourses()
  loadRecentActivity()
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

function loadTrainerStats() {
  const stats = {
    assignedCourses: 6,
    activeStudents: 45,
    pendingReviews: 12,
    completionRate: 87,
  }

  animateStats()
  console.log("Trainer stats loaded:", stats)
}

function loadMyCourses() {
  const courses = [
    {
      id: 1,
      name: "JavaScript Fundamentals",
      students: 15,
      avgProgress: 80,
      status: "Active",
    },
    {
      id: 2,
      name: "React Development",
      students: 12,
      avgProgress: 65,
      status: "Active",
    },
    {
      id: 3,
      name: "Python Programming",
      students: 18,
      avgProgress: 45,
      status: "In Progress",
    },
  ]

  window.trainerCourses = courses
  console.log("Trainer courses loaded:", courses)
}

function loadRecentActivity() {
  const activities = [
    {
      type: "completion",
      title: "John Employee completed React Development",
      time: "2 hours ago",
    },
    {
      type: "enrollment",
      title: "3 new students enrolled in JavaScript Fundamentals",
      time: "4 hours ago",
    },
    {
      type: "question",
      title: "New question posted in Python Programming",
      time: "6 hours ago",
    },
  ]

  console.log("Recent activity loaded:", activities)
}

function setupEventListeners() {
  document.addEventListener("click", handleTrainerActions)

  // Navigation links
  const navLinks = document.querySelectorAll(".nav-menu a")
  navLinks.forEach((link) => {
    link.addEventListener("click", handleNavigation)
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

function handleTrainerActions(e) {
  const target = e.target
  const buttonText = target.textContent || target.closest("button")?.textContent

  if (buttonText?.includes("Manage")) {
    e.preventDefault()
    const courseRow = target.closest("tr")
    const courseName = courseRow?.querySelector("td:first-child")?.textContent
    manageCourse(courseName)
  } else if (buttonText?.includes("Create Course") || buttonText?.includes("Create New Course")) {
    e.preventDefault()
    createCourse()
  } else if (buttonText?.includes("View Reports")) {
    e.preventDefault()
    viewReports()
  } else if (buttonText?.includes("Review Submissions")) {
    e.preventDefault()
    reviewSubmissions()
  } else if (buttonText?.includes("Update Profile")) {
    e.preventDefault()
    updateProfile()
  }
}

function manageCourse(courseName) {
  showNotification(`Opening management panel for "${courseName}"...`, "info")
  setTimeout(() => {
    showNotification("Course management interface would open here.", "info")
  }, 1000)
}

function createCourse() {
  showNotification("Opening course creation wizard...", "info")
  setTimeout(() => {
    showNotification("Course creation form would open here.", "info")
  }, 1000)
}

function viewReports() {
  showNotification("Loading reports dashboard...", "info")
  setTimeout(() => {
    showNotification("Reports interface would open here.", "info")
  }, 1000)
}

function reviewSubmissions() {
  showNotification("Loading pending submissions...", "info")
  setTimeout(() => {
    showNotification("Submissions review interface would open here.", "info")
  }, 1000)
}

function updateProfile() {
  showNotification("Profile update feature coming soon!", "info")
}

function animateStats() {
  const statValues = document.querySelectorAll(".stat-value")
  statValues.forEach((stat, index) => {
    const finalValue = stat.textContent.includes("%")
      ? Number.parseInt(stat.textContent)
      : Number.parseInt(stat.textContent)
    let currentValue = 0
    const increment = finalValue / 20

    const timer = setInterval(() => {
      currentValue += increment
      if (currentValue >= finalValue) {
        stat.textContent = stat.textContent.includes("%") ? finalValue + "%" : finalValue
        clearInterval(timer)
      } else {
        stat.textContent = stat.textContent.includes("%") ? Math.floor(currentValue) + "%" : Math.floor(currentValue)
      }
    }, 50)
  })
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
