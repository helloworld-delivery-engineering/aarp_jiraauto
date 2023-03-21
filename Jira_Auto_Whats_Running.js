// ==UserScript==
// @name         WHATS RUNNING
// @namespace    https://jiradc.helloworld.com/
// @version      1.0
// @description  Creates a DIV that will house the other divs notifying what scripts are running.
// @author       Colby Lostutter
// @match        https://jiradc.helloworld.com/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';
    let notification_containing_div = document.createElement("div");
    notification_containing_div.id = "notification_container_div";
    notification_containing_div.innerHTML = "What's running";
    notification_containing_div.style.borderStyle = "dotted";
    notification_containing_div.style.backgroundColor = "#FFFFFF";
    notification_containing_div.style.padding = "5px";
    notification_containing_div.style.fontSize = "12px";
    notification_containing_div.style.width = "150px";
    notification_containing_div.style.fontWeight = "bold";
    notification_containing_div.style.color = "black";
    notification_containing_div.style.position = "fixed";
    notification_containing_div.style.bottom = "0";
    notification_containing_div.style.right = "0";
    document.body.appendChild(notification_containing_div);
    document.execCommand('createBtn');
})();
