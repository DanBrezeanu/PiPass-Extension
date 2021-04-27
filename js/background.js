
function init() {
    
}

chrome.tabs.onActivated.addListener(tab => {
    chrome.tabs.get(tab.tabId, tab_info => {
        if (/^https:\/\//.test(tab_info.url)) {
            chrome.tabs.executeScript(null, {file: './js/foreground.js'}, () => console.log("Yay"))
        }
    })
});




init()