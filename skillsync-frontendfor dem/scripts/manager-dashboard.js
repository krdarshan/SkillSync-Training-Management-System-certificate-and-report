document.addEventListener("DOMContentLoaded", () => {
  // Check authentication first
  const checkPageAuth = () => {
    // Placeholder for authentication check logic
    return true
  }

  const getCurrentUser = () => {
    // Placeholder for getting current user logic
    return { name: "John Doe", role: "manager" }
  }

  const logout = () => {
    // Placeholder for logout logic
    console.log("Logging out...")
  }

  if (!checkPageAuth()) return

  const user = getCurrentUser()
  if (!user || user.role !== "manager") {
    alert("Access denied. Manager role required.")
    logout()
    return
  }

  initializeManagerDashboard()
})

function initializeManagerDashboard() {
  const user = getCurrentUser()
  if (!user) return

  updateUserInterface(user)
  loadManagerStats()
  loadTrainingOverview()
  loadRecentActivity()
  setupEventListeners()
  setDefaultDates()
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

function setDefaultDates() {
  const today = new Date()
  const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate())

  const dateFromElement = document.getElementById("dateFrom")
  const dateToElement = document.getElementById("dateTo")

  if (dateFromElement) dateFromElement.value = lastMonth.toISOString().split("T")[0]
  if (dateToElement) dateToElement.value = today.toISOString().split("T")[0]
}

function loadManagerStats() {
  const stats = {
    totalCourses: 24,
    activeUsers: 156,
    completionRate: 78,
    certificatesIssued: 342,
  }

  animateStats()
  console.log("Manager stats loaded:", stats)
}

function loadTrainingOverview() {
  const courses = [
    {
      id: 1,
      name: "JavaScript Fundamentals",
      trainer: "Sarah Trainer",
      enrolled: 25,
      completed: 20,
      completionRate: 80,
      status: "Active",
    },
    {
      id: 2,
      name: "React Development",
      trainer: "Sarah Trainer",
      enrolled: 18,
      completed: 12,
      completionRate: 67,
      status: "Active",
    },
    {
      id: 3,
      name: "Python Programming",
      trainer: "Mike Manager",
      enrolled: 22,
      completed: 8,
      completionRate: 36,
      status: "In Progress",
    },
  ]

  window.managerCourses = courses
  console.log("Training overview loaded:", courses)
}

function loadRecentActivity() {
  const activities = [
    {
      type: "certificate",
      title: "5 certificates issued for React Development",
      time: "1 hour ago",
    },
    {
      type: "user",
      title: "New trainer Sarah Trainer added to system",
      time: "3 hours ago",
    },
    {
      type: "course",
      title: "Database Design course created",
      time: "1 day ago",
    },
  ]

  console.log("Recent activity loaded:", activities)
}

function setupEventListeners() {
  document.addEventListener("click", handleManagerActions)

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

function handleManagerActions(e) {
  const target = e.target
  const buttonText = target.textContent || target.closest("button")?.textContent

  if (buttonText?.includes("Manage")) {
    e.preventDefault()
    const courseRow = target.closest("tr")
    const courseName = courseRow?.querySelector("td:first-child")?.textContent
    manageCourse(courseName)
  } else if (buttonText?.includes("Filter")) {
    e.preventDefault()
    generateReport()
  } else if (buttonText?.includes("Excel")) {
    e.preventDefault()
    exportExcel()
  } else if (buttonText?.includes("PDF")) {
    e.preventDefault()
    exportPDF()
  } else if (buttonText?.includes("New Course") || buttonText?.includes("Create Course")) {
    e.preventDefault()
    createCourse()
  } else if (buttonText?.includes("Add User")) {
    e.preventDefault()
    addUser()
  } else if (buttonText?.includes("Assign Trainer")) {
    e.preventDefault()
    assignTrainer()
  } else if (buttonText?.includes("View All Reports")) {
    e.preventDefault()
    viewAllReports()
  } else if (buttonText?.includes("System Settings")) {
    e.preventDefault()
    systemSettings()
  }
}

function generateReport() {
  const courseFilter = document.getElementById("courseFilter")?.value
  const departmentFilter = document.getElementById("departmentFilter")?.value
  const dateFrom = document.getElementById("dateFrom")?.value
  const dateTo = document.getElementById("dateTo")?.value

  const filters = {
    course: courseFilter,
    department: departmentFilter,
    dateFrom: dateFrom,
    dateTo: dateTo,
  }

  showNotification("Generating filtered report...", "info")

  setTimeout(() => {
    showNotification(`Report generated with filters applied!`, "success")
  }, 1500)
}

function exportExcel() {
  showNotification("Preparing Excel export...", "info")

  setTimeout(() => {
    // Simulate Excel file download
    const link = document.createElement("a")
    link.href = "data:application/vnd.ms-excel;base64,UEsDBBQAAAAIAA=="
    link.download = `training_report_${new Date().toISOString().split("T")[0]}.xlsx`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    showNotification("Excel report downloaded successfully!", "success")
  }, 2000)
}

function exportPDF() {
  showNotification("Generating PDF report...", "info")

  setTimeout(() => {
    // Simulate PDF file download
    const link = document.createElement("a")
    link.href = "data:application/pdf;base64,JVBERi0xLjQK"
    link.download = `training_report_${new Date().toISOString().split("T")[0]}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    showNotification("PDF report downloaded successfully!", "success")
  }, 2000)
}

function createCourse() {
  showNotification("Opening course creation wizard...", "info")
  setTimeout(() => {
    showNotification("Course creation interface would open here.", "info")
  }, 1000)
}

function addUser() {
  showNotification("Opening user registration form...", "info")
  setTimeout(() => {
    showNotification("User registration interface would open here.", "info")
  }, 1000)
}

function assignTrainer() {
  showNotification("Opening trainer assignment panel...", "info")
  setTimeout(() => {
    showNotification("Trainer assignment interface would open here.", "info")
  }, 1000)
}

function viewAllReports() {
  showNotification("Loading comprehensive reports dashboard...", "info")
  setTimeout(() => {
    showNotification("Reports dashboard would open here.", "info")
  }, 1000)
}

function systemSettings() {
  showNotification("Opening system configuration...", "info")
  setTimeout(() => {
    showNotification("System settings interface would open here.", "info")
  }, 1000)
}

function manageCourse(courseName) {
  showNotification(`Opening management panel for "${courseName}"...`, "info")
  setTimeout(() => {
    showNotification("Course management interface would open here.", "info")
  }, 1000)
}

function animateStats() {
  const statValues = document.querySelectorAll(".stat-value")
  statValues.forEach((stat, index) => {
    const finalValue = stat.textContent.includes("%")
      ? Number.parseInt(stat.textContent)
      : Number.parseInt(stat.textContent)
    let currentValue = 0
    const increment = finalValue / 30

    const timer = setInterval(() => {
      currentValue += increment
      if (currentValue >= finalValue) {
        stat.textContent = stat.textContent.includes("%") ? finalValue + "%" : finalValue
        clearInterval(timer)
      } else {
        stat.textContent = stat.textContent.includes("%") ? Math.floor(currentValue) + "%" : Math.floor(currentValue)
      }
    }, 30)
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
