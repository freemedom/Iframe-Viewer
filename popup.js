var html_data = {}

//得延时一段时间，sendMessage刚返回来消息只代表第一个存储上了
function handle_new_time() {
    setTimeout(() => {
        handle_new()
    }, 1000);
}

function handle_new() {
    document.getElementById("loading").style.display = "none";
    const iframeTableBody = document.getElementById("iframe-table-body");

    var map1;
    chrome.storage.local.get(null).then((result) => {
        debugger
       
        
        // if (result.html_storage != undefined && result.html_storage != 0) {
        //     map1 = new Map(JSON.parse(result.html_storage));
        // } else {
        //     map1 = new Map();
        // }

        // let keys = Object.keys(map1);//不行
        // let keys = Array.from(map1.keys());
        let keys = Object.keys(result)
        console.log(keys);
        keys.forEach(iframeUrl => {
            const row = iframeTableBody.insertRow(-1);  // append to the last row
            const domain = row.insertCell(0);
            const open = row.insertCell(1);

            const button = document.createElement("button");
            button.className = "material-icons";
            button.innerHTML = "open_in_new";
            button.title = iframeUrl;
            button.onclick = () => {
                window.open(iframeUrl, "_blank").focus();
            }
    
            const button2 = document.createElement("button");
            button2.innerHTML = "dynamic content retention";
            button2.onclick = () => {
                chrome.storage.local.set({
                    "url": iframeUrl
                })
                var urlToOpen = chrome.runtime.getURL('temp_translate.html');
                chrome.tabs.create({
                    url: urlToOpen
                });
            }

            domain.innerHTML = iframeUrl;
            domain.className += "domain";
            open.appendChild(button);
            open.appendChild(button2);
        })

        if (keys.length > 0) {
            document.getElementById("iframe-table").style.display = "block";
        } else {
            document.getElementById("iframe-table").style.display = "none";
            document.getElementById("default").style.display = "block";
        }
    });

}

function handleIframes(iframeData) {
    document.getElementById("loading").style.display = "none";

    const iframeUrls = iframeData["iframeUrls"];
    const iframeTableBody = document.getElementById("iframe-table-body");

    iframeUrls.forEach((iframeUrl, i) => {
        const row = iframeTableBody.insertRow(-1);  // append to the last row
        const domain = row.insertCell(0);
        const open = row.insertCell(1);

        // const iframeHost = new URL(iframeUrl).hostname;
        const iframeHost = iframeUrl
        const button = document.createElement("button");
        button.className = "material-icons";
        button.innerHTML = "open_in_new";
        button.title = iframeUrl;
        button.onclick = () => {
            window.open(iframeUrl, "_blank").focus();
        }

        const button2 = document.createElement("button");
        button2.innerHTML = "dynamic content retention";
        button2.onclick = () => {
            chrome.storage.local.set({
                "url": iframeUrl
            })
            var urlToOpen = chrome.runtime.getURL('temp_translate.html');
            chrome.tabs.create({
                url: urlToOpen
            });
        }

        domain.innerHTML = iframeHost;
        domain.className += "domain";
        open.appendChild(button);
        open.appendChild(button2);
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
            chrome.tabs.sendMessage(tab.id, { from: "popup", }, handle_new_time);
        });
    });
    // chrome.storage.local.set({
    //     "html_storage": 0//undefined不行
    // })
    chrome.storage.local.clear();
});

//用消息传递必须得打开着popup才能接收
// chrome.runtime.onMessage.addListener(
//     function (request, sender, sendResponse) {
//         console.log(sender.tab ?
//             "from a content script:" + sender.tab.url :
//             "from the extension");
//         if (request.greeting == "hello")
//             sendResponse({
//                 farewell: "goodbye"
//             });
//     });
