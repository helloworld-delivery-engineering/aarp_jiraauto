// ==UserScript==
// @name         Jira Auto
// @namespace    https://jiradc.helloworld.com/
// @version      1.0
// @description  Efficiently and accurately creating new Rewards Catalog Item Jira tickets
// @author       Colby Lostutter and the Blue Workstream
// @match        https://jiradc.helloworld.com/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    console.log("Jira Auto is running");
    // Create user-visible indication the script is running
    const script_active_notification_div = document.createElement("div");
        script_active_notification_div.id = "script_active_notification_div";
        script_active_notification_div.innerHTML = "Jira Auto is running";
        script_active_notification_div.style.backgroundColor = "#99ccff";
        script_active_notification_div.style.padding = "5px";
        script_active_notification_div.style.fontSize = "10px";
        script_active_notification_div.style.fontWeight = "bold";
        script_active_notification_div.style.position = "fixed";
        script_active_notification_div.style.bottom = "0";
        script_active_notification_div.style.right = "0";
        document.body.appendChild(script_active_notification_div);
  
  <script src="https://bitbucket.helloworld.com/snippets/c558bdf80bef4deb9aab6557294013bd.js"></script>
  
})();
