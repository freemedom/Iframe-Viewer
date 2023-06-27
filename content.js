chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.from) {
        case "popup":
            const iframes = Array.prototype.slice.call(document.getElementsByTagName("iframe"));
            const iframeUrls = iframes.map(iframe => iframe?.src)
                .filter(url => url != null && url != "about:blank");
            sendResponse({ iframeUrls: iframeUrls });
            break;
        case "background":
            const numIframes = document.getElementsByTagName("iframe").length;
            sendResponse({ numIframes: numIframes, tabId: request["tabId"] });
    }
});
