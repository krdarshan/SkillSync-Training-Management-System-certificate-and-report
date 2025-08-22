// Declare necessary variables or import them here
function checkPageAuth() {
  // Placeholder for authentication check logic
  return true // Replace with actual logic
}

function getCurrentUser() {
  // Placeholder for getting current user logic
  return JSON.parse(localStorage.getItem("skillsync_user") || "{}") // Replace with actual logic
}

function logout() {
  // Placeholder for logout logic
  localStorage.removeItem("skillsync_user") // Replace with actual logic
  window.location.href = "/login" // Redirect to login page or handle logout
}

document.addEventListener("DOMContentLoaded", () => {
  // Check authentication first
  if (!checkPageAuth()) return

  const user = getCurrentUser()
  if (!user || user.role !== "employee") {
    alert("Access denied. Employee role required.")
    logout()
    return
  }

  initializeProfilePage()
})

function initializeProfilePage() {
  const user = getCurrentUser()
  if (!user) return

  updateUserInterface(user)
  loadProfileData()
  setupEventListeners()
}

function updateUserInterface(user) {
  const userNameElement = document.getElementById("userName")
  const userAvatarElement = document.getElementById("userAvatar")
  const profileAvatarElement = document.getElementById("profileAvatar")

  if (userNameElement) userNameElement.textContent = user.name
  if (userAvatarElement) userAvatarElement.textContent = getInitials(user.name)
  if (profileAvatarElement) profileAvatarElement.textContent = getInitials(user.name)
}

function getInitials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}

function loadProfileData() {
  // Load saved profile data from localStorage
  const savedProfile = JSON.parse(localStorage.getItem("userProfile") || "{}")

  // Update form fields with saved data
  if (savedProfile.firstName) document.getElementById("firstName").value = savedProfile.firstName
  if (savedProfile.lastName) document.getElementById("lastName").value = savedProfile.lastName
  if (savedProfile.phone) document.getElementById("phone").value = savedProfile.phone
  if (savedProfile.department) document.getElementById("department").value = savedProfile.department
  if (savedProfile.position) document.getElementById("position").value = savedProfile.position
  if (savedProfile.bio) document.getElementById("bio").value = savedProfile.bio

  // Load preferences
  if (savedProfile.emailNotifications !== undefined) {
    document.getElementById("emailNotifications").checked = savedProfile.emailNotifications
  }
  if (savedProfile.courseReminders !== undefined) {
    document.getElementById("courseReminders").checked = savedProfile.courseReminders
  }
  if (savedProfile.certificateAlerts !== undefined) {
    document.getElementById("certificateAlerts").checked = savedProfile.certificateAlerts
  }
  if (savedProfile.language) document.getElementById("language").value = savedProfile.language
}

function setupEventListeners() {
  // Profile form submission
  const profileForm = document.getElementById("profileForm")
  if (profileForm) {
    profileForm.addEventListener("submit", handleProfileUpdate)
  }

  // Password form submission
  const passwordForm = document.getElementById("passwordForm")
  if (passwordForm) {
    passwordForm.addEventListener("submit", handlePasswordChange)
  }

  // Preferences form submission
  const preferencesForm = document.getElementById("preferencesForm")
  if (preferencesForm) {
    preferencesForm.addEventListener("submit", handlePreferencesUpdate)
  }

  // Profile picture upload
  const profilePicture = document.getElementById("profilePicture")
  if (profilePicture) {
    profilePicture.addEventListener("change", handleProfilePictureChange)
  }
}

function handleProfileUpdate(e) {
  e.preventDefault()

  try {
    const formData = new FormData(e.target)
    const profileData = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      department: formData.get("department"),
      position: formData.get("position"),
      bio: formData.get("bio"),
      updatedAt: new Date().toISOString(),
    }

    // Validate required fields
    if (!profileData.firstName || !profileData.lastName || !profileData.email) {
      showNotification("Please fill in all required fields.", "error")
      return
    }

    // Save to localStorage
    const existingProfile = JSON.parse(localStorage.getItem("userProfile") || "{}")
    const updatedProfile = { ...existingProfile, ...profileData }
    localStorage.setItem("userProfile", JSON.stringify(updatedProfile))

    // Update user session with new name
    const user = getCurrentUser()
    if (user) {
      user.name = `${profileData.firstName} ${profileData.lastName}`
      localStorage.setItem("skillsync_user", JSON.stringify(user))
    }

    showNotification("Profile updated successfully!", "success")

    // Update UI elements immediately
    setTimeout(() => {
      updateUserInterface({ name: `${profileData.firstName} ${profileData.lastName}` })
    }, 500)
  } catch (error) {
    console.error("Profile update error:", error)
    showNotification("Error updating profile. Please try again.", "error")
  }
}

function handlePasswordChange(e) {
  e.preventDefault()

  try {
    const formData = new FormData(e.target)
    const currentPassword = formData.get("currentPassword")
    const newPassword = formData.get("newPassword")
    const confirmPassword = formData.get("confirmPassword")

    // Validate passwords
    if (!currentPassword || !newPassword || !confirmPassword) {
      showNotification("Please fill in all password fields.", "error")
      return
    }

    if (currentPassword !== "password123") {
      showNotification("Current password is incorrect.", "error")
      return
    }

    if (newPassword.length < 6) {
      showNotification("New password must be at least 6 characters long.", "error")
      return
    }

    if (newPassword !== confirmPassword) {
      showNotification("New passwords do not match.", "error")
      return
    }

    // Save new password (in real app, this would be hashed and sent to server)
    const userProfile = JSON.parse(localStorage.getItem("userProfile") || "{}")
    userProfile.password = newPassword
    userProfile.passwordUpdatedAt = new Date().toISOString()
    localStorage.setItem("userProfile", JSON.stringify(userProfile))

    showNotification("Password changed successfully!", "success")

    // Clear form
    e.target.reset()
  } catch (error) {
    console.error("Password change error:", error)
    showNotification("Error changing password. Please try again.", "error")
  }
}

function handlePreferencesUpdate(e) {
  e.preventDefault()

  try {
    const preferences = {
      emailNotifications: document.getElementById("emailNotifications").checked,
      courseReminders: document.getElementById("courseReminders").checked,
      certificateAlerts: document.getElementById("certificateAlerts").checked,
      language: document.getElementById("language").value,
      updatedAt: new Date().toISOString(),
    }

    // Save to localStorage
    const existingProfile = JSON.parse(localStorage.getItem("userProfile") || "{}")
    const updatedProfile = { ...existingProfile, ...preferences }
    localStorage.setItem("userProfile", JSON.stringify(updatedProfile))

    showNotification("Preferences saved successfully!", "success")
  } catch (error) {
    console.error("Preferences update error:", error)
    showNotification("Error saving preferences. Please try again.", "error")
  }
}

function handleProfilePictureChange(e) {
  const file = e.target.files[0]
  if (!file) return

  try {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      showNotification("Please select a valid image file.", "error")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showNotification("Image file size must be less than 5MB.", "error")
      return
    }

    // Create file reader
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const imageData = event.target.result

        // Update profile picture display
        const profileAvatar = document.getElementById("profileAvatar")
        if (profileAvatar) {
          profileAvatar.innerHTML = `<img src="${imageData}" alt="Profile Picture" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`
        }

        // Save to localStorage
        const existingProfile = JSON.parse(localStorage.getItem("userProfile") || "{}")
        existingProfile.profilePicture = imageData
        existingProfile.updatedAt = new Date().toISOString()
        localStorage.setItem("userProfile", JSON.stringify(existingProfile))

        showNotification("Profile picture updated successfully!", "success")
      } catch (error) {
        console.error("Profile picture save error:", error)
        showNotification("Error saving profile picture. Please try again.", "error")
      }
    }

    reader.onerror = () => {
      showNotification("Error reading image file. Please try again.", "error")
    }

    reader.readAsDataURL(file)
  } catch (error) {
    console.error("Profile picture change error:", error)
    showNotification("Error changing profile picture. Please try again.", "error")
  }
}

function resetForm() {
  if (confirm("Are you sure you want to reset all changes?")) {
    // Clear saved profile data
    localStorage.removeItem("userProfile")

    // Reload the page to reset form
    window.location.reload()
  }
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
