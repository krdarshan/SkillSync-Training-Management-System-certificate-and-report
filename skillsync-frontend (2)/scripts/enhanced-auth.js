// Enhanced Authentication with Modern Features
class SkillSyncAuth {
  constructor() {
    this.API_BASE_URL = "http://localhost:8080/api";
    this.currentUser = null;
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.checkAuthStatus();
    this.setupFormValidation();
  }

  setupEventListeners() {
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");

    if (loginForm) {
      loginForm.addEventListener("submit", (e) => this.handleLogin(e));
    }

    if (registerForm) {
      registerForm.addEventListener("submit", (e) => this.handleRegister(e));
    }

    // Setup form switching
    const registerLink = document.querySelector('a[onclick="showRegisterForm()"]');
    const loginLink = document.querySelector('a[onclick="showLoginForm()"]');

    if (registerLink) {
      registerLink.addEventListener("click", (e) => {
        e.preventDefault();
        this.showRegisterForm();
      });
    }

    if (loginLink) {
      loginLink.addEventListener("click", (e) => {
        e.preventDefault();
        this.showLoginForm();
      });
    }
  }

  setupFormValidation() {
    // Real-time password validation
    const passwordInput = document.getElementById("regPassword");
    const confirmPasswordInput = document.getElementById("confirmPassword");

    if (passwordInput && confirmPasswordInput) {
      confirmPasswordInput.addEventListener("input", () => {
        this.validatePasswordMatch();
      });
    }

    // Email validation
    const emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
      input.addEventListener("blur", () => {
        this.validateEmail(input);
      });
    });
  }

  validatePasswordMatch() {
    const password = document.getElementById("regPassword")?.value;
    const confirmPassword = document.getElementById("confirmPassword")?.value;
    const confirmPasswordGroup = document.getElementById("confirmPassword")?.closest(".form-group");

    if (confirmPassword && password !== confirmPassword) {
      this.showFieldError(confirmPasswordGroup, "Passwords do not match");
    } else {
      this.clearFieldError(confirmPasswordGroup);
    }
  }

  validateEmail(input) {
    const email = input.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const formGroup = input.closest(".form-group");

    if (email && !emailRegex.test(email)) {
      this.showFieldError(formGroup, "Please enter a valid email address");
    } else {
      this.clearFieldError(formGroup);
    }
  }

  showFieldError(formGroup, message) {
    if (!formGroup) return;
    
    formGroup.classList.add("error");
    let errorElement = formGroup.querySelector(".error-message");
    
    if (!errorElement) {
      errorElement = document.createElement("div");
      errorElement.className = "error-message";
      formGroup.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
  }

  clearFieldError(formGroup) {
    if (!formGroup) return;
    
    formGroup.classList.remove("error");
    const errorElement = formGroup.querySelector(".error-message");
    if (errorElement) {
      errorElement.remove();
    }
  }

  async handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");
    const role = formData.get("role");

    // Clear previous errors
    this.clearMessages();

    // Validate inputs
    if (!this.validateForm(e.target)) {
      return;
    }

    // Show loading state
    this.setLoadingState(e.target, true);

    try {
      const response = await fetch(`${this.API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          role: role.toLowerCase()
        })
      });

      const data = await response.json();

      if (data.success) {
        this.setCurrentUser(data);
        this.showSuccess("Login successful! Redirecting...");
        
        // Add a small delay for better UX
        setTimeout(() => {
          this.redirectToDashboard(data.role);
        }, 1000);
      } else {
        this.showError(data.message || "Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      this.showError("Network error. Please check your connection and try again.");
    } finally {
      this.setLoadingState(e.target, false);
    }
  }

  async handleRegister(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    // Clear previous errors
    this.clearMessages();

    // Validate inputs
    if (!this.validateForm(e.target)) {
      return;
    }

    if (password !== confirmPassword) {
      this.showError("Passwords do not match.");
      return;
    }

    // Show loading state
    this.setLoadingState(e.target, true);

    try {
      const response = await fetch(`${this.API_BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password
        })
      });

      const data = await response.json();

      if (data.success) {
        this.setCurrentUser(data);
        this.showSuccess("Registration successful! Welcome to SkillSync!");
        
        setTimeout(() => {
          this.redirectToDashboard(data.role);
        }, 1500);
      } else {
        this.showError(data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      this.showError("Network error. Please check your connection and try again.");
    } finally {
      this.setLoadingState(e.target, false);
    }
  }

  validateForm(form) {
    const requiredFields = form.querySelectorAll("[required]");
    let isValid = true;

    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        this.showFieldError(field.closest(".form-group"), "This field is required");
        isValid = false;
      } else {
        this.clearFieldError(field.closest(".form-group"));
      }
    });

    return isValid;
  }

  setLoadingState(form, isLoading) {
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;

    if (isLoading) {
      submitButton.disabled = true;
      submitButton.innerHTML = '<div class="spinner"></div> Loading...';
      form.classList.add("loading");
    } else {
      submitButton.disabled = false;
      submitButton.innerHTML = originalText;
      form.classList.remove("loading");
    }
  }

  setCurrentUser(userData) {
    this.currentUser = {
      email: userData.email,
      role: userData.role,
      name: userData.name,
      token: userData.token,
      loginTime: new Date().toISOString(),
    };

    localStorage.setItem("skillsync_user", JSON.stringify(this.currentUser));
  }

  getCurrentUser() {
    if (!this.currentUser) {
      const stored = localStorage.getItem("skillsync_user");
      if (stored) {
        this.currentUser = JSON.parse(stored);
      }
    }
    return this.currentUser;
  }

  checkAuthStatus() {
    const user = this.getCurrentUser();
    if (user && user.token) {
      // Validate token with backend
      this.validateToken(user.token);
    }
  }

  async validateToken(token) {
    try {
      const response = await fetch(`${this.API_BASE_URL}/auth/validate`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (!data.success) {
        this.logout();
      }
    } catch (error) {
      console.error("Token validation error:", error);
      this.logout();
    }
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem("skillsync_user");
    window.location.href = "index.html";
  }

  redirectToDashboard(role) {
    switch (role.toLowerCase()) {
      case "employee":
        window.location.href = "employee-dashboard.html";
        break;
      case "trainer":
        window.location.href = "trainer-dashboard.html";
        break;
      case "manager":
        window.location.href = "manager-dashboard.html";
        break;
      default:
        window.location.href = "employee-dashboard.html";
    }
  }

  showRegisterForm() {
    document.getElementById("loginForm").classList.remove("active");
    document.getElementById("registerForm").classList.add("active");
  }

  showLoginForm() {
    document.getElementById("registerForm").classList.remove("active");
    document.getElementById("loginForm").classList.add("active");
  }

  showSuccess(message) {
    this.showMessage(message, "success");
  }

  showError(message) {
    this.showMessage(message, "error");
  }

  showWarning(message) {
    this.showMessage(message, "warning");
  }

  showMessage(message, type) {
    // Remove existing messages
    this.clearMessages();

    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${type}`;
    
    const icon = type === "success" ? "✓" : type === "error" ? "✗" : "⚠";
    messageDiv.innerHTML = `<span>${icon}</span> ${message}`;

    // Insert at the top of the auth card
    const authCard = document.querySelector(".auth-card");
    authCard.insertBefore(messageDiv, authCard.firstChild);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (messageDiv.parentNode) {
        messageDiv.remove();
      }
    }, 5000);
  }

  clearMessages() {
    const messages = document.querySelectorAll(".message");
    messages.forEach(msg => msg.remove());
  }
}

// Initialize enhanced auth when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.skillSyncAuth = new SkillSyncAuth();
});

// Global functions for backward compatibility
function showRegisterForm() {
  window.skillSyncAuth?.showRegisterForm();
}

function showLoginForm() {
  window.skillSyncAuth?.showLoginForm();
}

function logout() {
  window.skillSyncAuth?.logout();
} 