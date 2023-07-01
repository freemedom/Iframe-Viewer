var map1;
chrome.storage.local.get(["url"]).then((result1) => {
	chrome.storage.local.get(["html_storage"]).then((result2) => {
		map1 = new Map(JSON.parse(result2.html_storage));
		document.documentElement.innerHTML = map1.get(result1.url)
	});
});
