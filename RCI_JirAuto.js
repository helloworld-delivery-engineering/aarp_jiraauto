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

})();

// SKU and Name Update

var name = document.getElementById('customfield_16503');

name.onfocus = totalUpdate;

function totalUpdate(e) {
  const sku = document.getElementById('customfield_16000');
  const primaryId = document.getElementById('customfield_16102');
  console.log(sku.value);
  primaryId.value = sku.value + e.target.value;
}
