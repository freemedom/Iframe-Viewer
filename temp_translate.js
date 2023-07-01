var map1;
chrome.storage.local.get(["url"]).then((result1) => {
	chrome.storage.local.get(null).then((result2) => {
		document.documentElement.innerHTML = result2[result2.url]//outterhtml不行
		// map1 = new Map(JSON.parse(result2.html_storage));
		// document.documentElement.innerHTML = map1.get(result1.url)
	});
});