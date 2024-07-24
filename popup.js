document.addEventListener("DOMContentLoaded", () => {
  const lengthInput = document.getElementById("length")
  const lengthValue = document.getElementById("lengthValue")
  const symbolsCheckbox = document.getElementById("symbols")
  const generateButton = document.getElementById("generate")
  const resultElement = document.getElementById("result")
  const errorElement = document.getElementById("error")

  // Load saved settings
  chrome.storage.sync.get(["length", "includeSymbols"], (settings) => {
    if (settings.length) {
      lengthInput.value = settings.length
      lengthValue.textContent = settings.length
    }
    if (settings.includeSymbols !== undefined) {
      symbolsCheckbox.checked = settings.includeSymbols
    }
  })

  lengthInput.addEventListener("input", () => {
    lengthValue.textContent = lengthInput.value
  })

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

    // Save settings
    chrome.storage.sync.set({ length, includeSymbols })
  })
})

function generatePassword(length, includeSymbols) {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  const symbols = "!@#$%^&*()_+[]{}|;:',.<>?"
  const allChars = includeSymbols ? charset + symbols : charset
  let password = ""
  const cryptoObj = window.crypto

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor((cryptoObj.getRandomValues(new Uint32Array(1))[0] / (0xffffffff + 1)) * allChars.length)
    password += allChars[randomIndex]
  }

  return password
}
