document.addEventListener("DOMContentLoaded", () => {
  // Check authentication first
  const checkPageAuth = () => {
    // Placeholder for authentication check logic
    return true
  }

  const getCurrentUser = () => {
    // Placeholder for getting current user logic
    return { name: "John Doe", role: "employee" }
  }

  const logout = () => {
    // Placeholder for logout logic
    console.log("Logging out...")
  }

  if (!checkPageAuth()) return

  const user = getCurrentUser()
  if (!user || user.role !== "employee") {
    alert("Access denied. Employee role required.")
    logout()
    return
  }

  initializeCertificatesPage()
})

function initializeCertificatesPage() {
  const user = window.getCurrentUser() // Updated to use window.getCurrentUser
  if (!user) return

  updateUserInterface(user)
  loadCertificates()
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

function loadCertificates() {
  // Load certificates from enrolled courses
  const enrolledCourses = JSON.parse(localStorage.getItem("enrolledCourses") || "[]")
  const completedCourses = enrolledCourses.filter((course) => course.status === "Completed")

  // Default certificates if none exist
  const defaultCertificates = [
    {
      id: 1,
      courseName: "React Development",
      completionDate: "March 15, 2024",
      certificateId: "CERT-REACT-2024-001",
      trainer: "Sarah Trainer",
      duration: "40 hours",
    },
    {
      id: 2,
      courseName: "HTML/CSS Fundamentals",
      completionDate: "February 28, 2024",
      certificateId: "CERT-HTML-2024-002",
      trainer: "Sarah Trainer",
      duration: "30 hours",
    },
    {
      id: 3,
      courseName: "Project Management Basics",
      completionDate: "January 20, 2024",
      certificateId: "CERT-PM-2024-003",
      trainer: "Mike Manager",
      duration: "25 hours",
    },
  ]

  // Use completed courses or default certificates
  const certificates =
    completedCourses.length > 0
      ? completedCourses.map((course) => ({
          id: course.id,
          courseName: course.name,
          completionDate: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
          certificateId:
            course.certificateId ||
            `CERT-${course.name.replace(/\s+/g, "").toUpperCase()}-${new Date().getFullYear()}-${Math.floor(
              Math.random() * 1000,
            )
              .toString()
              .padStart(3, "0")}`,
          trainer: course.trainer,
          duration: "40 hours",
        }))
      : defaultCertificates

  window.userCertificates = certificates
  console.log("Certificates loaded:", certificates)
}

function setupEventListeners() {
  document.addEventListener("click", handleCertificateActions)

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

function handleCertificateActions(e) {
  const target = e.target
  const button = target.closest("button")

  if (!button) return

  const buttonText = button.textContent.trim()

  if (buttonText.includes("Download Certificate")) {
    e.preventDefault()
    const card = button.closest(".card")
    const courseName = card?.querySelector("h4")?.textContent?.trim()
    const certificateIdMatch = card?.textContent.match(/Certificate ID:\s*([A-Z0-9-]+)/)
    const certificateId = certificateIdMatch ? certificateIdMatch[1] : null

    if (courseName && certificateId) {
      downloadCertificate(courseName, certificateId)
    } else {
      showNotification("Certificate information not found. Please try again.", "error")
    }
  } else if (buttonText.includes("Download All")) {
    e.preventDefault()
    downloadAllCertificates()
  } else if (buttonText.includes("Browse Courses")) {
    e.preventDefault()
    window.location.href = "employee-dashboard.html"
  }
}

function downloadCertificate(courseName, certificateId) {
  const user = window.getCurrentUser() // Updated to use window.getCurrentUser
  if (!user) {
    showNotification("Please log in to download certificates.", "error")
    return
  }

  if (!courseName || !certificateId) {
    showNotification("Certificate information is missing. Please try again.", "error")
    return
  }

  showNotification(`Preparing certificate for "${courseName}"...`, "info")

  setTimeout(() => {
    try {
      // Try HTML certificate download first (this will actually work)
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

function downloadAllCertificates() {
  showNotification("Preparing all certificates for download...", "info")

  setTimeout(() => {
    const certificates = window.userCertificates || []

    if (certificates.length === 0) {
      showNotification("No certificates available for download.", "warning")
      return
    }

    let downloadCount = 0
    certificates.forEach((cert, index) => {
      setTimeout(() => {
        try {
          const success = generateSimpleCertificate(cert.courseName, cert.certificateId, window.getCurrentUser().name) // Updated to use window.getCurrentUser
          if (success) {
            downloadCount++
          }

          // Show completion message after last download
          if (index === certificates.length - 1) {
            setTimeout(() => {
              showNotification(`Successfully downloaded ${downloadCount} certificates!`, "success")
            }, 500)
          }
        } catch (error) {
          console.error(`Error downloading certificate for ${cert.courseName}:`, error)
        }
      }, index * 1000) // Stagger downloads by 1 second
    })

    showNotification(`Starting download of ${certificates.length} certificates...`, "info")
  }, 1000)
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

// Update the placeholder functions with actual implementations
function downloadCertificateHTML(courseName, certificateId, userName) {
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
    console.error("HTML certificate download error:", error)
    return false
  }
}

function downloadTextCertificate(courseName, certificateId, userName) {
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
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Certificate - ${courseName}</title>
    <style>
        @media print {
            body { margin: 0; padding: 0; }
            .no-print { display: none !important; }
            .certificate { box-shadow: none; margin: 0; }
        }
        
        body {
            font-family: 'Times New Roman', serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .certificate {
            background: white;
            padding: 60px;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 800px;
            width: 100%;
            border: 10px solid #2563eb;
            position: relative;
            margin: 20px;
        }
        
        .certificate::before {
            content: '';
            position: absolute;
            top: 20px;
            left: 20px;
            right: 20px;
            bottom: 20px;
            border: 3px solid #ffd700;
            border-radius: 10px;
        }
        
        .header {
            margin-bottom: 40px;
        }
        
        .logo {
            font-size: 48px;
            color: #2563eb;
            margin-bottom: 20px;
        }
        
        .title {
            font-size: 48px;
            font-weight: bold;
            color: #1e293b;
            margin-bottom: 20px;
            text-transform: uppercase;
            letter-spacing: 3px;
        }
        
        .subtitle {
            font-size: 24px;
            color: #64748b;
            margin-bottom: 40px;
        }
        
        .recipient {
            font-size: 36px;
            font-weight: bold;
            color: #2563eb;
            margin: 30px 0;
            text-decoration: underline;
        }
        
        .course {
            font-size: 28px;
            font-weight: bold;
            color: #1e293b;
            margin: 30px 0;
            font-style: italic;
        }
        
        .details {
            margin: 40px 0;
            font-size: 16px;
            color: #64748b;
        }
        
        .signature-section {
            display: flex;
            justify-content: space-between;
            margin-top: 60px;
            padding-top: 40px;
            border-top: 2px solid #e2e8f0;
        }
        
        .signature {
            text-align: center;
            flex: 1;
        }
        
        .signature-line {
            border-bottom: 2px solid #1e293b;
            margin-bottom: 10px;
            height: 40px;
        }
        
        .action-buttons {
            position: fixed;
            top: 20px;
            right: 20px;
            display: flex;
            gap: 10px;
            z-index: 1000;
        }
        
        .btn {
            background: #2563eb;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            text-decoration: none;
            display: inline-block;
        }
        
        .btn:hover {
            background: #1d4ed8;
        }
        
        .btn-success {
            background: #10b981;
        }
        
        .btn-success:hover {
            background: #059669;
        }
        
        .watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 120px;
            color: rgba(37, 99, 235, 0.05);
            font-weight: bold;
            z-index: 0;
        }
        
        .content {
            position: relative;
            z-index: 1;
        }
        
        @media (max-width: 768px) {
            .certificate {
                padding: 30px;
                margin: 10px;
            }
            .title {
                font-size: 32px;
            }
            .recipient {
                font-size: 28px;
            }
            .course {
                font-size: 22px;
            }
        }
    </style>
</head>
<body>
    <div class="action-buttons no-print">
        <button class="btn" onclick="window.print()">🖨️ Print Certificate</button>
        <button class="btn btn-success" onclick="downloadPDF()">💾 Save as PDF</button>
    </div>
    
    <div class="certificate">
        <div class="watermark">SKILLSYNC</div>
        <div class="content">
            <div class="header">
                <div class="logo">🎓</div>
                <div class="title">Certificate of Completion</div>
                <div class="subtitle">This is to certify that</div>
            </div>
            
            <div class="recipient">${userName}</div>
            
            <div class="subtitle">has successfully completed the course</div>
            
            <div class="course">${courseName}</div>
            
            <div class="details">
                <p><strong>Certificate ID:</strong> ${certificateId}</p>
                <p><strong>Date of Completion:</strong> ${currentDate}</p>
                <p><strong>Issued by:</strong> SkillSync Training System</p>
                <p><strong>Verification URL:</strong> https://skillsync.com/verify/${certificateId}</p>
            </div>
            
            <div class="signature-section">
                <div class="signature">
                    <div class="signature-line"></div>
                    <div><strong>Training Director</strong></div>
                    <div>SkillSync Academy</div>
                </div>
                <div class="signature">
                    <div class="signature-line"></div>
                    <div><strong>Course Instructor</strong></div>
                    <div>Certified Trainer</div>
                </div>
            </div>
            
            <div style="margin-top: 40px; font-size: 14px; color: #64748b;">
                <p><em>This certificate verifies that the above-named individual has completed all requirements for the specified training program and demonstrates competency in the subject matter.</em></p>
                <p><strong>Digital Certificate - Valid and Authentic</strong></p>
            </div>
        </div>
    </div>

    <script>
        function downloadPDF() {
            window.print();
        }
        
        window.onload = function() {
            document.body.focus();
        };
    </script>
</body>
</html>`
}

window.getCurrentUser = getCurrentUser // Declare getCurrentUser globally
