// chrome.runtime.onMessage.addListener(function (msg, _sender, sendResponse) {
//     console.log("In foreground")
//     // if (msg === 'retreive_password_fields') {
        
//     //     
        
//     // }
//     sendResponse("muie");
// });

// chrome.runtime.onConnect.addListener(function(port) {
//     console.assert(port.name == "knockknock");
//     port.onMessage.addListener(function(msg) {
//         if (msg.status == "is-login-page") {
//             inputs = document.querySelectorAll("input[type='password']")
//             response = {}    
//             response.status = 'is-login-page-response'
//             response.result = inputs.length > 0
//             console.log(response)
//             port.postMessage(response)
//         }
//     });
// });

// port.onMessage.addListener(function(msg) {
//   if (msg.task == "is-login-page") {
//         inputs = document.querySelectorAll("input[type='password']")
//         response = {}
//         // if (inputs.length > 0) {
//         //     username_text_input = document.querySelectorAll("input[type='email']")
//         //     if (username_text_input.length == 0)
//         //         username_text_input = document.querySelectorAll("input[type='text']") 

//         //     if (username_text_input.length > 0)
//         //         response = {'password': inputs[0], 'username': username_text_input[0]}
//         //     else
//         //         response = {'password': inputs[0], 'username': null}

//         // } else {
//         //     response = {'password': null, 'username': null}
//         // }
        
//         response.status = 'is-login-page-response'
//         response.result = inputs.length > 0
//         console.log(response)
//         port.postMessage(response)
//   }
// });

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if( request.message === "is-login-page" ) {
        start();
      }
    }
  );

  function start(){
        chrome.runtime.sendMessage({"message": "is-login-page-response"})
  }