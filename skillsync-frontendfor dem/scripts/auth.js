// Authentication handling
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm")

  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin)
  }

  // Check if user is already logged in
  checkAuthStatus()
})

function handleLogin(e) {
  e.preventDefault()

  const formData = new FormData(e.target)
  const email = formData.get("email")
  const password = formData.get("password")
  const role = formData.get("role")

  // Clear any existing error messages
  clearErrorMessages()

  // Validate form inputs
  if (!email || !password || !role) {
    showError("Please fill in all fields.")
    return
  }

  // Demo authentication - in real app, this would be an API call
  if (validateCredentials(email, password, role)) {
    // Store user session
    const userData = {
      email: email,
      role: role,
      name: getNameFromEmail(email),
      loginTime: new Date().toISOString(),
    }

    localStorage.setItem("skillsync_user", JSON.stringify(userData))

    // Show success message
    showSuccess("Login successful! Redirecting...")

    // Redirect to appropriate dashboard after short delay
    setTimeout(() => {
      redirectToDashboard(role)
    }, 1000)
  } else {
    showError("Invalid credentials. Please check your email, password, and role.")
  }
}

function validateCredentials(email, password, role) {
  // Demo credentials - in real app, this would validate against backend
  const validCredentials = {
    "employee@skillsync.com": { password: "password123", role: "employee" },
    "trainer@skillsync.com": { password: "password123", role: "trainer" },
    "manager@skillsync.com": { password: "password123", role: "manager" },
  }

  const user = validCredentials[email]
  return user && user.password === password && user.role === role
}

function getNameFromEmail(email) {
  const names = {
    "employee@skillsync.com": "John Employee",
    "trainer@skillsync.com": "Sarah Trainer",
    "manager@skillsync.com": "Mike Manager",
  }
  return names[email] || "User"
}

function redirectToDashboard(role) {
  const dashboards = {
    employee: "employee-dashboard.html",
    trainer: "trainer-dashboard.html",
    manager: "manager-dashboard.html",
  }

  const targetPage = dashboards[role]
  if (targetPage) {
    window.location.href = targetPage
  } else {
    showError("Invalid role specified.")
  }
}

function checkAuthStatus() {
  const userData = localStorage.getItem("skillsync_user")
  const currentPage = window.location.pathname.split("/").pop() || "index.html"

  if (userData && currentPage === "index.html") {
    try {
      const user = JSON.parse(userData)
      if (user.role) {
        redirectToDashboard(user.role)
      }
    } catch (e) {
      // Clear corrupted data
      localStorage.removeItem("skillsync_user")
    }
  }
}

function logout() {
  if (confirm("Are you sure you want to logout?")) {
    localStorage.removeItem("skillsync_user")
    window.location.href = "index.html"
  }
}

function clearErrorMessages() {
  const existingMessages = document.querySelectorAll(".error-message, .success-message")
  existingMessages.forEach((msg) => msg.remove())
}

function showError(message) {
  clearErrorMessages()
  const errorDiv = document.createElement("div")
  errorDiv.className = "error-message"
  errorDiv.style.cssText = `
        background: #fee2e2;
        color: #991b1b;
        padding: 1rem;
        border-radius: 0.5rem;
        margin-bottom: 1rem;
        border: 1px solid #fecaca;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    `
  errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i>${message}`

  const form = document.getElementById("loginForm")
  if (form) {
    form.parentNode.insertBefore(errorDiv, form)
  }

  setTimeout(() => {
    if (errorDiv.parentElement) {
      errorDiv.remove()
    }
  }, 5000)
}

function showSuccess(message) {
  clearErrorMessages()
  const successDiv = document.createElement("div")
  successDiv.className = "success-message"
  successDiv.style.cssText = `
        background: #dcfce7;
        color: #166534;
        padding: 1rem;
        border-radius: 0.5rem;
        margin-bottom: 1rem;
        border: 1px solid #bbf7d0;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    `
  successDiv.innerHTML = `<i class="fas fa-check-circle"></i>${message}`

  const form = document.getElementById("loginForm")
  if (form) {
    form.parentNode.insertBefore(successDiv, form)
  }
}

// Utility function to get current user
function getCurrentUser() {
  const userData = localStorage.getItem("skillsync_user")
  try {
    return userData ? JSON.parse(userData) : null
  } catch (e) {
    localStorage.removeItem("skillsync_user")
    return null
  }
}

// Utility function to check if user has specific role
function hasRole(role) {
  const user = getCurrentUser()
  return user && user.role === role
}

// Utility function to require authentication
function requireAuth() {
  const user = getCurrentUser()
  if (!user) {
    window.location.href = "index.html"
    return false
  }
  return true
}

// Global function to check authentication on page load
function checkPageAuth() {
  const user = getCurrentUser()
  const currentPage = window.location.pathname.split("/").pop() || "index.html"

  // If no user and not on login page, redirect to login
  if (!user && currentPage !== "index.html") {
    window.location.href = "index.html"
    return false
  }

  // If user exists, check role permissions
  if (user) {
    const rolePages = {
      employee: [
        "employee-dashboard.html",
        "employee-courses.html",
        "employee-certificates.html",
        "employee-profile.html",
      ],
      trainer: ["trainer-dashboard.html", "trainer-courses.html", "trainer-reports.html", "trainer-profile.html"],
      manager: [
        "manager-dashboard.html",
        "manager-courses.html",
        "manager-users.html",
        "manager-reports.html",
        "manager-profile.html",
      ],
    }

    const allowedPages = rolePages[user.role] || []

    if (!allowedPages.includes(currentPage) && currentPage !== "index.html") {
      alert(`Access denied. ${user.role} role cannot access this page.`)
      redirectToDashboard(user.role)
      return false
    }
  }

  return true
}
