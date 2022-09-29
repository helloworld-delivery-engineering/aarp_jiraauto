// ==UserScript==
// @name         Jira Auto
// @namespace    https://jiradc.helloworld.com/
// @version      1.5
// @description  Efficiently and accurately creating new Rewards Catalog Item Jira tickets
// @author       Colby Lostutter and the Blue Workstream
// @match        https://jiradc.helloworld.com/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

window.addEventListener('load', function() {
    'use strict';


    console.log("Jira Auto is running-console");
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
    document.execCommand('createBtn');

})

/* I tried many different ways to make the automation/verification happen on the first page, but have come to the conclusion it works better in EDIT mode
because some of the fields are not editable unless you are in there - This is an alert suggesting they make changes in there. there are other fields that still need to be added*/
var editButton = document.getElementById('edit-issue');
var primaryWarning = document.getElementById('rowForcustomfield_16102');
var nameWarning = document.getElementById('rowForcustomfield_16503');
//primaryWarning.addEventListener("click", alertTest);
//nameWarning.addEventListener("click", alertTest);
editButton.addEventListener("click", hooooold);


function alertTest() {
    alert('any changes made here affect other fields. Please use the "edit" button to make sure all changes are made correctly');
}

//Needs delay to allow fields to load - could be less than 3000 haven't tested.

function hooooold() {
    var timeout = setTimeout(changeStuff, 3000);
}


/* When Name or SKU is changed, this updates the Primary ID - AEM Title - AEM Tile Title - */

function changeStuff() {

    console.log('totalUpdate about to happen');

    var Name = document.getElementById('customfield_16503');
    var SKU = document.getElementById('customfield_16000');
    var StartDate = document.getElementById('customfield_17202');

    Name.onchange = totalUpdate;
    SKU.onchange = totalUpdate;
    StartDate.onchange = totalUpdate;

    function totalUpdate(e) {
        var Name = document.getElementById('customfield_16503');
        var NameTrim = Name.value.trim();
        var SKU = document.getElementById('customfield_16000');
        var SKUValue = SKU.value;
        let ItemValue = document.getElementById('customfield_16511');
        const PrimaryId = document.getElementById('customfield_16102');
        const GoodsId = document.getElementById('customfield_16400');
        const DirectURL = document.getElementById('customfield_16516');
        const TileTitle = document.getElementById('customfield_16504');
        const ImageURL = document.getElementById('customfield_17302');
        const NameDrawer = document.getElementById('customfield_16506');
        const PrizePoolName = document.getElementById('customfield_16800');
        const AEMTitle = document.getElementById('customfield_16506');
        const AEMTileTitle = document.getElementById('customfield_16504');
        var RewardsDeploy = document.getElementById('customfield_17001');
        const StartDate = document.getElementById('customfield_17202');
        const StartDateMonth = StartDate.value.replace(/(\s|[^a-zA-Z])/g, "");
        let StartDateYear = StartDate.value.match(/\d+$/);
        const summary = document.getElementById('summary');
        const nameForSummary = e.target.value
        .replace(/[’]/g, "'")
        .replace(/ Instant Win Play/gi, '')
        .replace(/ Instant Win/gi, '')
        .replace(/Daily Deal/gi, '')
        .replace(/Extra Credit/gi, '')
        .replace(/Sweepstakes/gi, '')
        .replace(/ eGift Card/gi, '')
        .replace(/ Gift Card/gi, '');

        const Walmart = /.* Walmart eGift Card/gi;
        const Gap = /Gap eGift Card/g;
        const EGiftSubstring = / eGift Card/gi;
        const ItemValueValue = (Name.value.replace(/([a-zA-Z]|\s|\&|[®]|[™]|[’]|['])/g, ''));
        const ShortName = Name.value
        .trim()
        .replace(/[$]/gi, '')
        .replace(/[’]/g, "'")
        .replace(/[0-9]/g, '')
        .replace(/ Instant Win Play/gi, ' Instant Win')
        .replace(/Daily Deal/gi, '')
        .replace(/Extra Credit/gi, '')
        .replace(/\s+$/, '')
        .substring(1)
        .trim();
        let TransNameValue = Name.value
        .replace(EGiftSubstring, ' Gift Card')
        .replace(/[^\w\s]/gi, '')
        .replace(/[0-9]/g, '')
        .replace(/[-]|[’]|[.]|[“]|[”]|[®]|[™]/gi, '')
        .replace(/[é]/gi, 'e')
        .toLowerCase()
        .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
            if (+match === 0) return "";
            return index === 0 ? match.toLowerCase() : match.toUpperCase();
        })
        .replace(/\s/g, "");
        const TransNameCamel = TransNameValue[0] + TransNameValue.substring(1);
        const TransactionNameValue = TransNameCamel.value;
        const TransNameLower = TransNameCamel.toLowerCase();
        const NewTransNameCamel = TransNameLower
        .replace(/InstantWinPlay/gi, 'IW')
        .replace(/InstantWin/gi, 'IW')
        .replace(/DailyDeal/gi, 'DD')
        .replace(/ExtraCredit/gi, 'EC')
        .replace(/Sweepstakes/gi, 'Sweeps')
        .replace(/GiftCardSweeps/gi, 'Sweeps')
        .replace(/DigitalReward/gi, '');

        const isSweeps = SKUValue.substring(0, 1);
        const isIW = SKUValue.substring(0, 1);
        if (isSweeps == '4' || isIW == '3') {
            AEMTileTitle.value = ShortName + "*";
            AEMTitle.value = ShortName + "*";
        }
        else {
            AEMTileTitle.value = ShortName;
            AEMTitle.value = ShortName;
        }


        const NewTransNameLower = NewTransNameCamel.toLowerCase();
        const PrimaryIDValue = SKUValue + NewTransNameLower;
        const NewURL = SKUValue + NewTransNameLower;
        const SweepsFinder = NewURL.substring(0, 1);
        const rewardType = document.getElementById('customfield_15702');
        var rewardTypeValue = rewardType.options[rewardType.selectedIndex].value;
        var rewardTypeSelected = rewardType.options[rewardType.selectedIndex].text;

        PrimaryId.value = PrimaryIDValue;
        if (rewardTypeSelected == 'Daily Instant Win') {
            DirectURL.value = 'https://www.aarp.org/rewards/redeem/' + NewURL + '/';
        }
        if (ImageURL.value.length < 61) {
            ImageURL.value = "https://cdn.aarp.net/content/dam/aarp/rewards/redeem/catalog/";
        }


        GoodsId.value = "TBD";

        ItemValue.value = ItemValueValue;

        let GameUUID = document.getElementById('customfield_16500');

        Name.value = NameTrim;


        if (isIW || isSweeps) {

            PrizePoolName.value = (SKUValue + " " + ShortName + " " + StartDateMonth + " 20" + StartDateYear);

        }



        //REWARD DEPLOY CREATOR

        var SN = StartDateMonth;
        var Q = "";
        if (SN == "Jan" || SN == "Feb" || SN == "Mar") {
            Q = "q1";
        }
        else if (SN == "Apr" || SN == "May" || SN == "Jun") {
            Q = "q2";
        }
        else if (SN == "Jul" || SN == "Aug" || SN == "Sep") {
            Q = "q3";
        }
        else if (SN == "Oct" || SN == "Nov" || SN == "Dec") {
            Q = "q4";
        }

        RewardsDeploy = document.getElementById('customfield_17001');
        RewardsDeploy.value = ("aarp/" + StartDateYear + Q + "instantwin");

        //This sets the OAMOE URL

        var RewardsDeployValue = RewardsDeploy.value;
        const OamoeURL = document.getElementById('customfield_16517');
        var theUUID = GameUUID.value;


        if (isIW) {
            OamoeURL.value = 'https://sweeps.aarp.org/' + RewardsDeployValue + '/oamoe_entry?game=' + theUUID;
        }


        if (GameUUID.value < "5") {
            GameUUID.value = 'TBD';
        }


        //this is just for me to make the code_table name. It fills in the extra credit lesson input

        var codeTable = document.getElementById('customfield_16502');
        var shortNameConversion = ShortName
        .replace(/(\s|\.|[®]|[™]|[’]|[']|[-])/g, '_')
        .replace(/(\&|\‘)/g, '')
        .replace(/é/gi, 'e')
        .toLowerCase()
        .replace(/sweepstakes/g, '')
        .replace(/giftcard/gi, 'gift_card')
        .replace(/instant_win/gi, '')
        .replace(/egift/gi, 'gift')
        .replace(/__/g, '_');

        codeTable.value = (shortNameConversion + SKU.value.replace(/([-])/g, '_'));


    }

    //RETAIL VALUE AUTO UPDATER
    let RetailValue = document.getElementById('customfield_16511');

    RetailValue.onchange = ValueUpdater;

    let ParticipantCost = document.getElementById('customfield_16512');

    ParticipantCost.onchange = ValueUpdater;

    function ValueUpdater(e) {
        let ItemValue = document.getElementById('customfield_16511');
        let ItemValueNum = ItemValue.value
        .replace(/[$]/g, '');
        let ParticipantCostValue = ParticipantCost.value;
        let DisplayedSavings = document.getElementById('customfield_16513');
        let DisplayedSavingsNum = (ItemValueNum - ParticipantCostValue);
        let DisplayedSavingsValue = ('$' + DisplayedSavingsNum);
        let DisplayedDiscount = document.getElementById('customfield_16514');
        let DisplayedDiscountValue = (DisplayedSavingsNum / ItemValueNum);
        let DiscountPercent = Number(DisplayedDiscountValue).toLocaleString(undefined, {
            style: 'percent'
        });
        let NewParticipantCostValue = ('$' + ParticipantCostValue);
        let PointsField = document.getElementById('customfield_16515');

        DisplayedSavings.value = DisplayedSavingsValue;
        DisplayedDiscount.value = DiscountPercent;
        if (ParticipantCostValue.length > 0) {
            ParticipantCost.value.replace(/[$]/g, '');
            ParticipantCost.value = NewParticipantCostValue;
        }
        if (PointsField.value.length > 0) {
            alert('You currently have a Points associated to this.');
            ParticipantCost.value.replace(/[$]|[0-9]/g, '');
        }
    }



    //ERROR HANDLING ON UPDATE BUTTON Will only happen if in Verification

    let updateButton = document.getElementById('edit-issue-submit');
    updateButton.onclick = checkForErrors;

    function checkForErrors(e) {
        var statusValue = document.getElementById('status-val').textContent;
        if(statusValue = "Verification") {

            const rewardType = document.getElementById('customfield_15702');
            var rewardTypeValue = rewardType.options[rewardType.selectedIndex].value;
            var rewardTypeSelected = rewardType.options[rewardType.selectedIndex].text;
            var SKUValue = SKU.value;
            const skuChecker = SKUValue.substring(0, 1);

            var correct = "#000000";
            var incorrect = "#990000";

            var availability = document.getElementById('customfield_16002');
            var availabilityValue = availability.options[availability.selectedIndex].value;
            var codeFormat = document.getElementById('customfield_17007');
            var codeFormatValue = codeFormat.options[codeFormat.selectedIndex].value;
            var fromDate = document.getElementById('customfield_17202');
            var fromDateValue = fromDate.value;
            var fromDateNum = fromDateValue.substring(0, fromDateValue.indexOf("/"));
            var fulfillment = document.getElementById('customfield_17002-1');
            var fulfillmentValue = fulfillment.value;
            var GameUUID = document.getElementById('customfield_16500');
            var GoodsId = document.getElementById('customfield_16400');
            var inventory = document.getElementById('customfield_16101');
            var inventoryValue = inventory.value;
            var lowWatermark = document.getElementById('customfield_17206');
            var lowWatermarkValue = lowWatermark.value;
            var points = document.getElementById('customfield_16515');
            var rewardClient = document.getElementById('customfield_17300');
            var rewardClientValue = rewardClient.options[rewardClient.selectedIndex].value;
            var supplier = document.getElementById('customfield_17301');
            var supplierValue = supplier.options[supplier.selectedIndex].value;
            var toDate = document.getElementById('customfield_17203');
            var toDateValue = toDate.value;
            var toDateNum = toDateValue.substring(0, toDateValue.indexOf("/"));
            var noError = ("");
            var PrizePoolName = document.getElementById('customfield_16800');
            var sevenDayCheck = toDateNum - fromDateNum;
            var startDate = document.getElementById('customfield_11113');
            var endDate = document.getElementById('customfield_11112');
            var startDateValue = startDate.value;
            var endDateValue = endDate.value;

            //IW CHECK
            if (skuChecker === '3') {

                var iw1 = "- Reward Type must be Daily IW\n";
                var iw2 = "- Reward Client must be AARP\n";
                var iw3 = "- Low Watermark needs to be 0\n";
                var iw4 = "- Inventory needs to be 125\n";
                var iw5 = "- Availability Needs to Be ALL\n";
                var iw6 = "- Supplier Needs to be AARP\n";
                var iw7 = "- Fulfillment needs to be Electronically Fulfilled\n";
                var iw8 = "- To / From Date not one week apart\n";
                var iw9 = "- Start and End Dates must be blank\n";
                var iw10 = "- Game UUID should be TBD currently\n";
                //var iw11 = "- Prize Pool Name should be TBD currently\n";
                var iw12 = "- Goods ID should be TBD currently\n";
                var iw13 = "- Points should always be 50\n";
                var iw14 = "- Code Format should always be Yes\n";

                var iwText = "";

                if (rewardTypeValue != '16445') {
                    rewardType.style.color = incorrect;
                    iwText += iw1;
                    e.preventDefault();
                }
                else {
                    rewardType.style.color = correct;
                }
                if (rewardClientValue != '18200') {
                    rewardClient.style.color = incorrect;
                    iwText += iw2;
                    e.preventDefault();
                    console.log(rewardClientValue);
                }
                else {
                    rewardClient.style.color = correct;
                }
                if (lowWatermarkValue != '0') {
                    lowWatermark.style.color = incorrect;
                    iwText += iw3;
                    e.preventDefault();
                }
                else {
                    lowWatermark.style.color = correct;
                }
                if (inventoryValue != '125') {
                    inventory.style.color = incorrect;
                    iwText += iw4;
                    e.preventDefault();
                }
                else {
                    inventory.style.color = correct;
                }

                if (availabilityValue != '16601') {
                    availability.style.color = incorrect;
                    iwText += iw5;
                    e.preventDefault();
                }
                else {
                    availability.style.color = correct;
                }
                if (supplierValue != '18202') {
                    supplier.style.color = incorrect;
                    iwText += iw6;
                    e.preventDefault();
                }
                else {
                    supplier.style.color = correct;
                }
                if (fulfillmentValue == '17400') {
                    fulfillment.style.color = correct;
                }
                else {
                    fulfillment.style.color = incorrect;
                    iwText += iw7;
                    e.preventDefault();
                }
                if ((sevenDayCheck == "7") || (sevenDayCheck == "-23")) {
                    toDate.style.color = correct;
                    fromDate.style.color = correct;

                }
                else {
                    toDate.style.color = incorrect;
                    fromDate.style.color = incorrect;
                    iwText += iw8;
                    e.preventDefault();
                }

                if (endDateValue.length > 0) {
                    endDate.style.color = incorrect;
                    iwText += iw9;
                    e.preventDefault();
                }
                else {
                    endDate.style.color = correct;
                }
                if (startDateValue.length > 0) {
                    startDate.style.color = correct;
                    iwText += iw9;
                    e.preventDefault();
                }
                else {
                    endDate.style.color = correct;
                }
                /*if (GameUUID.value != "TBD") {
                    GameUUID.style.color = incorrect;
                    iwText += iw10;
                    e.preventDefault();
                }
                else {
                    GameUUID.style.color = correct;
                }*/
                if (PrizePoolName.value == "TBD") {
                    PrizePoolName.style.color = incorrect;
                    iwText += iw11;
                    e.preventDefault();
                }
                else {
                    PrizePoolName.style.color = correct;
                }
                if (GoodsId.value != "TBD") {
                    GoodsId.style.color = incorrect;
                    iwText += iw12;
                    e.preventDefault();
                }
                else {
                    GoodsId.style.color = correct;
                }
                if (points.value != "50") {
                    points.style.color = incorrect;
                    iwText += iw13;
                    e.preventDefault();
                }
                else {
                    points.style.color = correct;
                }
                if (codeFormatValue != "17413") {
                    codeFormat.style.color = incorrect;
                    iwText += iw14;
                    e.preventDefault();
                }
                else {
                    codeFormat.style.color = correct;
                }

                if (iwText.length == 0) {
                    var noErrors = confirm("OUTSTANDING! There appear to be no errors")
                    }
                else {
                    var errorText = ("Please check the following issues if in Verification\n\n" + iwText);
                    var rewardsTypeUpdate = confirm(errorText);
                }

            }

            else {
                return true;
            }

            // END IW Verification



        }
    }


}
