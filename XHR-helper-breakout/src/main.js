import {loadTextXHR} from "./utils.js";

// Window Runs main upon loading
window.onload = main;

// Main function
function main()
{
    // Set button 1
    document.querySelector("#button-1").onclick = function(){
        loadTextXHR("data/taffy-facts.txt", taffyCallBack);
    }

    // Set button 2
    document.querySelector("#button-2").onclick = function(){
        loadTextXHR("data/viking-facts.txt", vikingCallBack);
    }
}

// Taffy Callback
function taffyCallBack(e)
{
    const text = e.target.responseText;
    document.querySelector("#output-1").innerHTML = text;
}

// Viking Callback
function vikingCallBack(e)
{
    const text = e.target.responseText;
    document.querySelector("#output-2").innerHTML = text;
}