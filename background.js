chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "save_password") {
    const data = message.data
    const jsonBlob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(jsonBlob)

    chrome.downloads.download(
      {
        url: url,
        filename: "passwords.json",
      },
      () => {
        sendResponse({ success: true })
      }
    )

    // Keep the response channel open for async handling
    return true
  }
})
