chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "generatePassword",
    title: "Generate a secure, random password",
    contexts: ["editable"],
  })
})

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "generatePassword") {
    chrome.storage.sync.get(["length", "includeSymbols"], (settings) => {
      const length = settings.length || 12
      const includeSymbols = settings.includeSymbols || false
      const password = generatePassword(length, includeSymbols)
      chrome.tabs.executeScript(tab.id, {
        code: `document.activeElement.value = "${password}";`,
      })
    })
  }
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
