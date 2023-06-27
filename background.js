function updateBadge(response) {
    if (chrome.runtime.lastError) {
        setTimeout(updateBadge, 1000);
        return;
    }
    if (!response) {
        return;
    }
    chrome.action.setBadgeText({
        "text": response["numIframes"].toString(),
        "tabId": response["tabId"]
    });

    const color = response["numIframes"] > 0 ? "lightskyblue" : "navy";
    chrome.action.setBadgeBackgroundColor({
        "color": color,
        "tabId": response["tabId"]
    });
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tab.active) {
        switch (changeInfo.status) {
            case "loading":
                chrome.action.setTitle({ "title": "Loading", "tabId": tabId });
                chrome.action.setBadgeText({ "text": "?", "tabId": tabId });
                chrome.action.setBadgeBackgroundColor({ "color": "gray", "tabId": tabId });
                break;
            case "complete":
                chrome.tabs.sendMessage(tabId, { from: "background", "tabId": tabId },
                    updateBadge);
                break;
        }
    }
});
