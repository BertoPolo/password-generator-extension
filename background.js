chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "save_password") {
    const newPassword = message.data

    encryptPassword(newPassword.password).then((encryptedData) => {
      newPassword.password = encryptedData

      chrome.storage.local.get(["passwords"], (result) => {
        const passwords = result.passwords || []
        passwords.push(newPassword)

        chrome.storage.local.set({ passwords }, () => {
          const blob = new Blob([JSON.stringify(passwords, null, 2)], { type: "application/json" })
          const url = URL.createObjectURL(blob)

          chrome.downloads.download(
            {
              url: url,
              filename: "BrowserPasswords/passwords.json",
              conflictAction: "overwrite",
            },
            () => {
              console.log("Archivo guardado automáticamente.")
              sendResponse({ success: true })
            }
          )
        })
      })
    })

    return true
  } else if (message.action === "close_popup" && sender.tab === undefined) {
    chrome.runtime.getViews({ type: "popup" })[0]?.close()
  }
})
