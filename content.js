// console.log(1)
// debugger

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.from) {
        case "popup":
            var iframes = Array.prototype.slice.call(document.getElementsByTagName("iframe"));
            var frames = Array.prototype.slice.call(document.getElementsByTagName("frame"));
            iframes = iframes.concat(frames)

            const iframeUrls = iframes.map(iframe => iframe?.src)
                .filter(url => url != null && url != "about:blank");
            sendResponse({ iframeUrls: iframeUrls });
            if (self != top) {
                update_storage();
            }
            break;
        case "background":
            var numIframes = document.getElementsByTagName("iframe").length + document.getElementsByTagName("frame").length;
            sendResponse({ numIframes: numIframes, tabId: request["tabId"] });
    }
});

function update_storage() {
    var map1;
    // try {

    // } catch (error) {

    // }

    chrome.storage.local.get(["html_storage"]).then((result) => {
        debugger
        // console.log("Value currently is " + result.html_storage);
        if (result.html_storage != undefined) {
            map1 = new Map(JSON.parse(result.html_storage));
        } else {
            map1 = new Map();
        }
        map1.set(location.href, document.documentElement.outerHTML);
        chrome.storage.local.set({
            "html_storage": JSON.stringify(Array.from(map1.entries()))
        })
    });
    //then里面的函数是异步执行，慢
    console.log(1)

    // var map1 = new Map();
    // map1.set(location.href, 1);

    // chrome.runtime.sendMessage({
    //     url_send: location.href,
    //     html_send: document.documentElement.outerHTML
    // }, function (response) {
    //     // console.log(response.farewell);
    // });
}
