function extractPageContent() {
  // Get main content, excluding navigation, headers, footers, etc.
  const mainContent = document.querySelector('main') || document.body;
  
  // Extract text content
  let text = mainContent.innerText;
  
  // Basic cleanup
  text = text.replace(/\s+/g, ' ').trim();
  
  return text.substring(0, 5000); // Limit content length for API
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getPageContent") {
    sendResponse({ content: extractPageContent() });
  }
}); 