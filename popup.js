function handleIframes(iframeData) {
    document.getElementById("loading").style.display = "none";

    const iframeUrls = iframeData["iframeUrls"];
    const iframeTableBody = document.getElementById("iframe-table-body");

    iframeUrls.forEach((iframeUrl, i) => {
        const row = iframeTableBody.insertRow(-1);  // append to the last row
        const domain = row.insertCell(0);
        const open = row.insertCell(1);

        const iframeHost = new URL(iframeUrl).hostname;
        const button = document.createElement("button");
        button.className = "material-icons";
        button.innerHTML = "open_in_new";
        button.title = iframeUrl;
        button.onclick = () => {
            window.open(iframeUrl, "_blank").focus();
        }

        domain.innerHTML = iframeHost;
        domain.className += "domain";
        open.appendChild(button);
    });
    if (iframeUrls.length > 0) {
        document.getElementById("iframe-table").style.display = "block";
    } else {
        document.getElementById("iframe-table").style.display = "none";
        document.getElementById("default").style.display = "block";
    }
}

function handleIframesSafe(iframeData) {
    if (chrome.runtime.lastError) {
        setTimeout(handleIframesSafe, 1000);
        return;
    }
    if (!iframeData) {
        return;
    }
    try {
        handleIframes(iframeData);
    } catch (e) {
        console.log(e);
        document.getElementById("error").style.display = "block";
    }
}

window.addEventListener("DOMContentLoaded", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        tabs.forEach((tab) => {
            chrome.tabs.sendMessage(tab.id, { from: "popup", }, handleIframesSafe);
        });
    });
});
