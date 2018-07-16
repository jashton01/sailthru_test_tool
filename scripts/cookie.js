//This is used on the cart and browse abandon redirect pages to autodrop the sailthru_hid cookie; not used in the app itself

//Grab the cookie value from query params
let cookie;
const query = window.location.search;
if (query.includes("cookie")) {
    cookie = query.substr(query.indexOf('cookie')+7);
    if (cookie.includes("&")) {
        cookie = cookie.substr(0,cookie.indexOf("&"));
    }
}

//Generate UNIX timestamp to set expire date for a year from now
const current_timestamp = Math.floor(Date.now() / 1000);
const year_in_seconds = 31536000;
const expire_date = current_timestamp + year_in_seconds;

//Drop sailthru_hid cookie upon pageload
function run_horizon() {
    document.cookie = "sailthru_hid=" + cookie +"; domain=stevedoesitall.com; expires=" + expire_date + "; path=/";
        
Sailthru.init({ 
    customerId: "a6e23c6013bfa2439d5827cc989f9b7b"
    });
}

window.onload = run_horizon();

setTimeout(function() {
    window.close()
}, 30000);