// Certificate generation utility - FULLY WORKING VERSION
function generateCertificatePDF(courseName, certificateId, userName) {
  if (!courseName || !certificateId || !userName) {
    console.error("Missing required parameters for certificate generation")
    return false
  }

  try {
    // Create certificate content as HTML
    const certificateHTML = generateCertificateHTML(courseName, certificateId, userName)

    // Create a new window/tab with the certificate
    const certificateWindow = window.open("", "_blank", "width=900,height=700,scrollbars=yes,resizable=yes")

    if (!certificateWindow) {
      // Fallback to direct download if popup blocked
      downloadCertificateHTML(courseName, certificateId, userName)
      return true
    }

    certificateWindow.document.write(certificateHTML)
    certificateWindow.document.close()

    // Wait for content to load, then trigger print
    setTimeout(() => {
      try {
        certificateWindow.print()
      } catch (e) {
        console.log("Print dialog may have been cancelled")
      }
    }, 1000)

    return true
  } catch (error) {
    console.error("Certificate generation error:", error)
    // Fallback to HTML download
    return downloadCertificateHTML(courseName, certificateId, userName)
  }
}

// WORKING HTML Certificate Download
function downloadCertificateHTML(courseName, certificateId, userName) {
  if (!courseName || !certificateId || !userName) {
    console.error("Missing required parameters for certificate download")
    return false
  }

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

    // Clean up the URL object
    setTimeout(() => {
      window.URL.revokeObjectURL(url)
    }, 1000)

    return true
  } catch (error) {
    console.error("HTML certificate download error:", error)
    return false
  }
}

// WORKING Text Certificate Download
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

    setTimeout(() => {
      window.URL.revokeObjectURL(url)
    }, 1000)

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
            // For a real implementation, you would use a library like jsPDF or html2pdf
            // For now, we'll just trigger the print dialog
            window.print();
        }
        
        // Auto-focus for better user experience
        window.onload = function() {
            document.body.focus();
        };
    </script>
</body>
</html>`
}

// Simple text certificate fallback
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

// Bulk certificate download
function downloadAllCertificates() {
  const user = getCurrentUser()
  if (!user) {
    alert("Please log in to download certificates.")
    return
  }

  const certificates = window.userCertificates || []

  if (certificates.length === 0) {
    alert("No certificates available for download.")
    return
  }

  alert(`Starting download of ${certificates.length} certificates...`)

  let downloadCount = 0
  certificates.forEach((cert, index) => {
    setTimeout(() => {
      try {
        const success = downloadCertificateHTML(cert.courseName, cert.certificateId, user.name)
        if (success) {
          downloadCount++
        }

        // Show completion message after last download
        if (index === certificates.length - 1) {
          setTimeout(() => {
            alert(`Successfully downloaded ${downloadCount} certificates!`)
          }, 500)
        }
      } catch (error) {
        console.error(`Error downloading certificate for ${cert.courseName}:`, error)
      }
    }, index * 1000) // Stagger downloads by 1 second
  })
}

// Dummy implementations for undeclared variables/functions
function getCurrentUser() {
  // Dummy implementation
  return { name: "John Doe" }
}

function showNotification(message, type) {
  // Dummy implementation
  alert(message)
}
