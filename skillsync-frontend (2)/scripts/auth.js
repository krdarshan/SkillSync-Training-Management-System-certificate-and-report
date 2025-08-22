// Authentication handling with backend integration
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm")
  const registerForm = document.getElementById("registerForm")

  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin)
  }

  if (registerForm) {
    registerForm.addEventListener("submit", handleRegister)
  }

  // Check if we're on the login page
  const isLoginPage = window.location.pathname.includes('index.html') || 
                     window.location.pathname.endsWith('/') || 
                     window.location.pathname === '/'
  
  if (isLoginPage) {
    // Clear any existing session on login page to ensure fresh login
    localStorage.removeItem("skillsync_user")
    console.log("Login page loaded - session cleared")
    
    // Ensure login form is visible
    const loginForm = document.getElementById("loginForm")
    const registerForm = document.getElementById("registerForm")
    if (loginForm) loginForm.style.display = "block"
    if (registerForm) registerForm.style.display = "none"
  } else {
    // Only check auth status on other pages
    checkAuthStatus()
  }
})

const API_BASE_URL = "http://localhost:8080/api"

async function handleLogin(e) {
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

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
        role: role.toLowerCase()
      })
    })

    const data = await response.json()

    if (data.success) {
      // Store user session
      const userData = {
        email: data.email,
        role: data.role,
        name: data.name,
        token: data.token,
        loginTime: new Date().toISOString(),
      }

      localStorage.setItem("skillsync_user", JSON.stringify(userData))

      // Show success message
      showSuccess("Login successful! Redirecting...")

      // Redirect to appropriate dashboard after short delay
      setTimeout(() => {
        redirectToDashboard(data.role)
      }, 1000)
    } else {
      showError(data.message || "Login failed. Please check your credentials.")
    }
  } catch (error) {
    console.error("Login error:", error)
    showError("Network error. Please try again.")
  }
}

async function handleRegister(e) {
  e.preventDefault()

  const formData = new FormData(e.target)
  const name = formData.get("name")
  const email = formData.get("email")
  const password = formData.get("password")
  const confirmPassword = formData.get("confirmPassword")

  // Clear any existing error messages
  clearErrorMessages()

  // Validate form inputs
  if (!name || !email || !password || !confirmPassword) {
    showError("Please fill in all fields.")
    return
  }

  if (password !== confirmPassword) {
    showError("Passwords do not match.")
    return
  }

  if (password.length < 6) {
    showError("Password must be at least 6 characters long.")
    return
  }

  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password
      })
    })

    const data = await response.json()

    if (data.success) {
      // Store user session
      const userData = {
        email: data.email,
        role: data.role,
        name: data.name,
        token: data.token,
        loginTime: new Date().toISOString(),
      }

      localStorage.setItem("skillsync_user", JSON.stringify(userData))

      // Show success message
      showSuccess("Registration successful! Redirecting to dashboard...")

      // Redirect to employee dashboard after short delay
      setTimeout(() => {
        redirectToDashboard("employee")
      }, 1000)
    } else {
      showError(data.message || "Registration failed. Please try again.")
    }
  } catch (error) {
    console.error("Registration error:", error)
    showError("Network error. Please try again.")
  }
}

function redirectToDashboard(role) {
  const dashboards = {
    employee: "employee-dashboard.html",
    trainer: "trainer-dashboard.html",
    manager: "manager-dashboard.html",
  }

  const targetPage = dashboards[role.toLowerCase()]
  if (targetPage) {
    window.location.href = targetPage
  } else {
    showError("Invalid role specified.")
  }
}

function checkAuthStatus() {
  const userData = localStorage.getItem("skillsync_user")
  const currentPage = window.location.pathname.split("/").pop() || "index.html"

  // Don't redirect if on login page
  if (currentPage === "index.html" || currentPage === "" || currentPage === "/") {
    console.log("On login page - no redirection needed")
    return
  }

  if (userData) {
    try {
      const user = JSON.parse(userData)
      if (user.role) {
        // Check if user is on the correct dashboard for their role
        const expectedDashboard = getDashboardForRole(user.role)
        if (currentPage !== expectedDashboard) {
          console.log(`Redirecting from ${currentPage} to ${expectedDashboard}`)
          redirectToDashboard(user.role)
        } else {
          console.log(`User is on correct dashboard: ${currentPage}`)
        }
      }
    } catch (e) {
      console.error("Error parsing user data:", e)
      localStorage.removeItem("skillsync_user")
      window.location.href = "index.html"
    }
  } else {
    // No user data, redirect to login
    console.log("No user data found - redirecting to login")
    window.location.href = "index.html"
  }
}

function getDashboardForRole(role) {
  const dashboards = {
    employee: "employee-dashboard.html",
    trainer: "trainer-dashboard.html",
    manager: "manager-dashboard.html",
  }
  return dashboards[role.toLowerCase()] || "index.html"
}

function logout() {
  localStorage.removeItem("skillsync_user")
  window.location.href = "index.html"
}

function clearErrorMessages() {
  const errorElements = document.querySelectorAll(".error-message")
  errorElements.forEach((element) => element.remove())
}

function showError(message) {
  clearErrorMessages()

  const errorDiv = document.createElement("div")
  errorDiv.className = "error-message"
  errorDiv.style.cssText = `
    color: #ef4444;
    background-color: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 4px;
    padding: 12px;
    margin: 10px 0;
    font-size: 14px;
    text-align: center;
  `

  errorDiv.textContent = message

  const form = document.querySelector(".auth-form")
  if (form) {
    form.insertBefore(errorDiv, form.firstChild)
  }
}

function showSuccess(message) {
  clearErrorMessages()

  const successDiv = document.createElement("div")
  successDiv.className = "success-message"
  successDiv.style.cssText = `
    color: #10b981;
    background-color: #f0fdf4;
    border: 1px solid #bbf7d0;
    border-radius: 4px;
    padding: 12px;
    margin: 10px 0;
    font-size: 14px;
    text-align: center;
  `

  successDiv.textContent = message

  const form = document.querySelector(".auth-form")
  if (form) {
    form.insertBefore(successDiv, form.firstChild)
  }
}

function getCurrentUser() {
  const userData = localStorage.getItem("skillsync_user")
  if (userData) {
    try {
      return JSON.parse(userData)
    } catch (e) {
      console.error("Error parsing user data:", e)
      return null
    }
  }
  return null
}

function hasRole(role) {
  const user = getCurrentUser()
  return user && user.role && user.role.toLowerCase() === role.toLowerCase()
}

function requireRole(requiredRole) {
  const user = getCurrentUser()
  if (!user) {
    console.log("No user found - redirecting to login")
    window.location.href = "index.html"
    return false
  }
  
  if (!user.role) {
    console.log("User has no role - redirecting to login")
    localStorage.removeItem("skillsync_user")
    window.location.href = "index.html"
    return false
  }
  
  if (user.role.toLowerCase() !== requiredRole.toLowerCase()) {
    console.log(`Access denied. ${requiredRole} role required. User has: ${user.role}`)
    alert(`Access denied. ${requiredRole} role required.`)
    logout()
    return false
  }
  
  console.log(`Role validated: ${user.name} (${user.role})`)
  return true
}

function requireAuth() {
  const user = getCurrentUser()
  if (!user) {
    console.log("No user found - redirecting to login")
    window.location.href = "index.html"
    return false
  }
  
  // Check if user has a valid role
  if (!user.role) {
    console.log("User has no role - redirecting to login")
    localStorage.removeItem("skillsync_user")
    window.location.href = "index.html"
    return false
  }
  
  console.log(`User authenticated: ${user.name} (${user.role})`)
  return true
}

function checkPageAuth() {
  const user = getCurrentUser()
  if (!user) {
    window.location.href = "index.html"
    return false
  }
  return true
}
