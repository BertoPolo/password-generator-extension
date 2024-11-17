document.addEventListener("DOMContentLoaded", () => {
  const lengthInput = document.getElementById("length")
  const lengthValue = document.getElementById("lengthValue")
  const symbolsCheckbox = document.getElementById("symbols")
  const generateButton = document.getElementById("generate")
  const resultElement = document.getElementById("result")
  const errorElement = document.getElementById("error")
  const saveSection = document.getElementById("save-section")
  const usernameInput = document.getElementById("username")
  const websiteInput = document.getElementById("website")
  const saveButton = document.getElementById("save-to-file")

  // Load saved settings
  chrome.storage.sync.get(["length", "includeSymbols"], (settings) => {
    lengthInput.value = settings.length || 15
    lengthValue.textContent = settings.length || 15
    symbolsCheckbox.checked = settings.includeSymbols || false
  })

  // Update length value dynamically
  lengthInput.addEventListener("input", () => {
    lengthValue.textContent = lengthInput.value
    saveSettings()
  })

  // Save settings when symbols are toggled
  symbolsCheckbox.addEventListener("change", saveSettings)

  // Generate password on button click
  generateButton.addEventListener("click", () => {
    const length = parseInt(lengthInput.value)
    const includeSymbols = symbolsCheckbox.checked

    if (isNaN(length) || length < 1) {
      errorElement.textContent = "Please, insert a valid length."
      resultElement.textContent = ""
      return
    }

    errorElement.textContent = ""
    const password = generatePassword(length, includeSymbols)
    resultElement.textContent = password

    // Ask to save
    saveSection.style.display = "block"
  })

  // Save password to a file
  saveButton.addEventListener("click", () => {
    const username = usernameInput.value.trim()
    const website = websiteInput.value.trim()
    const password = resultElement.textContent.trim()

    if (!username || !website || !password) {
      alert("Please fill out all fields before saving.")
      return
    }

    const newPasswordData = {
      id: Date.now(), // Unique ID based on timestamp
      website: website,
      username: username,
      password: password,
    }

    chrome.runtime.sendMessage({ action: "save_password", data: newPasswordData }, (response) => {
      if (response && response.success) {
        alert("Password saved successfully!")
        // Cierra el popup
        chrome.runtime.sendMessage({ action: "close_popup" })
      } else {
        alert("Failed to save password.")
      }
    })
  })

  // Save settings
  function saveSettings() {
    const length = parseInt(lengthInput.value)
    const includeSymbols = symbolsCheckbox.checked
    chrome.storage.sync.set({ length, includeSymbols })
  }

  // Generate password
  function generatePassword(length, includeSymbols) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    const symbols = "!@#$%^&*()_+[]{}|;:',.<>?"
    const allChars = includeSymbols ? charset + symbols : charset
    let password = ""

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * allChars.length)
      password += allChars[randomIndex]
    }

    return password
  }
})
