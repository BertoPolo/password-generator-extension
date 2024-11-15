chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "save_password") {
    const data = message.data
    const blob = new Blob([data], { type: "text/plain" })
    const url = URL.createObjectURL(blob)

    chrome.downloads.download(
      {
        url: url,
        filename: "passwords.txt",
      },
      () => {
        sendResponse({ success: true })
      }
    )

    // Keep the response channel open for async handling
    return true
  }
})
