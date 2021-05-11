// chrome.runtime.onConnect.addListener(function(port) {
//     console.assert(port.name == "knockknock");
//     port.onMessage.addListener(function(msg) {
//       if (msg.status == "connected")
//         port.postMessage({task: "is-login-page"});
//       else if (msg.status == "is-login-page-response") {
//           console.log(msg)
//       }
//     });
// });

chrome.tabs.onActivated.addListener(tab => {
    chrome.tabs.get(tab.tabId, tab_info => {
        if (/^https:\/\//.test(tab_info.url)) {
            chrome.tabs.executeScript(null, {file: './js/foreground.js'}, () => {console.log("ran")})
        }
    })
});

