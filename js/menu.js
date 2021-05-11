// var port = chrome.runtime.connect({name: "knockknock"});
// port.postMessage({status: "is-login-page"})
// port.onMessage.addListener(function(msg) {
//   if (msg.status == "is-login-page-response") {
//         console.log(msg)
//   }
// });

const SECONDS = 1000
const MINUTES = 60 * SECONDS
const HOURS = 60 * MINUTES

let Api = class {
    static URL = "http://127.0.0.1:5193"
    
    static build_request(base_url, method, on_success, on_error) {
        const req = new XMLHttpRequest()
        req.onreadystatechange = () => {
            if (req.readyState === XMLHttpRequest.DONE && req.status == 200) {
                on_success(req)
            }
        }
        req.onerror = on_error
        
        req.open(method, base_url, true);
        req.setRequestHeader("Content-type", "application/json");

        return req
    }

    static check_online(on_success, on_error = () => {}) {
        const base_url = Api.URL
        const req = Api.build_request(base_url, "GET", on_success, on_error)

        req.send()
    }

    static hello(on_success, on_error = () => {}) {
        const base_url = Api.URL + '/hello'
        const req = Api.build_request(base_url, "GET", on_success, on_error)

        req.send()
    }

    static list_credentials(on_success, on_error = () => {}) {
        const base_url = Api.URL + '/list-credentials'
        const req = Api.build_request(base_url, "GET", on_success, on_error)

        req.send()
    }
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(request)
    }
  );

const get_page_domain = () => {
    return new Promise((resolve, reject) => {
        try {
            chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
                var activeTab = tabs[0];
                url = new URL(activeTab.url)
                domain = url.hostname.split('.').slice(-2).join('.')

                resolve(domain)
            })
        } catch (e) {
            reject(e)
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    domain = get_page_domain()
    status_text = document.querySelector("#loading-message")
    // chrome.tabs.sendMessage(activeTab.id, {"message": "is-login-page"})

    status_text.innerHTML = "<b> Connecting to the PiPass application.. </b>"
    
    // // const urlParams = `email=${email}&password=${pwd}`;
    // // req.send(urlParams);

    Api.check_online(
        (req) => {
            console.log(req.response)
            connect_to_device()
        },
        (err) => {
            status_text.innerHTML = "<b> Connect the PiPass application </b>"
        }
    )
});


function connect_to_device() {
    status_text.innerHTML = "<b> Connecting to the PiPass device... </b>"
    Api.hello(
        (req) => {
            console.log(req.response);
            if (JSON.parse(req.response).status == "1") {
                retreive_credentials()
            }
        },
        (err) => {
            status_text.innerHTML = "<b> Connect the PiPass device </b>"
        }
    )
}

function retreive_credentials() {
    chrome.storage.sync.get(["credentials_load_time"], (result) => {
        const ask_device_for_credentials = () => {
            status_text.innerHTML = "<b> Retrieving credentials... </b>"
            Api.list_credentials(
                (req) => {
                    console.log(req.response);
                    chrome.storage.sync.set({"credentials": JSON.parse(req.response)}, () => {console.log("Great success")})
                    chrome.storage.sync.set({"credentials_load_time": Date.now()}, () => {console.log("Very great success")})
                    

                    load_main_screen(JSON.parse(req.response))
                },
                (err) => {
                    status_text.innerHTML = "<b> Failed to retrieve credentials. Check the PiPass device and/or the application. </b>"
                }
            )
        }
    
        if (typeof result.credentials_load_time  == 'number') {
            time_spent_ms = Date.now() - result.credentials_load_time
            if (time_spent_ms > 60 * MINUTES || time_spent_ms < 0) {
                ask_device_for_credentials()
            } else {
                chrome.storage.sync.get(["credentials"], (result) => {load_main_screen(result.credentials)})
            }
        } else {
            ask_device_for_credentials()
        }
    })
}

async function load_main_screen(credentials) {
    console.log(credentials)
    document.querySelector("#loading-container").parentNode.removeChild(document.querySelector("#loading-container"))

    document.body.innerHTML = `   
<div class="container">
    <div class="row">
        <div class="col-1">
            <button class="btn btn-outline-success my-2" type="submit"> <i class="fas fa-plus"></i></button>
        </div>
        <div class="col-9">
            <input class="form-control my-2" type="search" placeholder="Search" aria-label="Search">
        </div>
        <div class="col-1">
            <button class="btn btn-outline-info my-2" type="submit"> <i class="fas fa-plus"></i></button>
        </div>
    </div>

</div>
<div class="card">
    <li class="list-group-item list-group-item-secondary" style="font-size: 13px; height: 40px;"> <b>LOGINS</b> </li>
    <ul id="login-items" class="list-group list-group-flush">
        <!-- Login items -->
    </ul>
</div>

<div class="navbar">
    <a class="active" href="#"><i class="fas fa-globe"></i> </a> 
    <a href="#"><i class="fas fa-lock"></i> </a> 
    <a href="#"><i class="fas fa-sync-alt"></i> </a> 
    <a href="#"><i class="fas fa-cogs"></i> </a>
</div>
    `
    item_container = document.querySelector("#login-items")

    let domain = await get_page_domain()

    logins = []
    for (let i = 0; i < credentials.length; i++) {
        console.log(credentials[i])

        if (credentials[i].url.includes(domain))
            logins.push(credentials[i])
    }

    console.log(logins)

    for (let i = 0; i < logins.length; i++) {
        item_container.innerHTML = item_container.innerHTML + `
        <li id="login-item-${i}" class="list-group-item flex-column" style="font-size: 15px;">
        <div class="d-flex w-100 flex-row" style="height: 40px;">
            <div class="d-flex w-20 flex-column justify-content-between mx-2">
                <img src="https://cdn.sstatic.net/Sites/stackoverflow/Img/favicon.ico?v=ec617d715196"  class="my-2 img-fluid img-rounded" />
            </div>
            <div class="d-flex w-50 flex-column justify-content-between mx-2">
                <p id="login-name" class="mb-0"> ${logins[i].name} </p>
                <small id="login-url" class="text-muted"> ${logins[i].url} </small>
            </div>
            <div class="d-flex w-30 flex-column ml-auto">
                <span class="pull-right right-icon my-2">
                    <i class="fas fa-list-alt"></i>
                    <i class="fas fa-user-circle"></i>
                    <i class="fas fa-key"></i>
                </span>
            </div>
        </div>
        </li>
    `
    }



}

