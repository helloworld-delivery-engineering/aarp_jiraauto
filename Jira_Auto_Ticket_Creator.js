// ==UserScript==
// @name         NEW Jira Auto - Ticket Creator
// @namespace    https://jiradc.helloworld.com/
// @version      3.5.7
// @description  Efficiently and accurately creating new Rewards Catalog Item Jira tickets
// @author       Colby Lostutter for the Blue Workstream
// @match        https://jiradc.helloworld.com/*
// @grant        none
// @run-at       document-end
// ==/UserScript==



// v3.0 - Breaking up Jira Auto into seperate Userscripts to make it less cumbersome and more focused on what part of Jira Auto you want to work with.
// v3.1 - Updating ShortName to not remove the first character in Contributions
// v3.2 - Added Detail Link
// v3.3 - Added Constrain date auto fill for Sweeps & Removed invisible characters
// v3.4 - Updated Summary to allow for IW's to put in correct month based on FROM date not TO date.
// v3.5 - Updated Primary ID to include the abbreviation of what it is where necessary. ALSO, Removed AARP FOUNDATION Points Contribution from Primary ID to reduce its length
// v3.5.3 - Corrections made to Remove "&" and ":" from Primary ID - Prizepool
// v3.5.4 - Removed "*" from Primary ID - included SKU "14***" in Daily Deals
// v3.5.5 - Updating OPP numbers for 2024
// v3.5.6 - Fix error
// v3.5.7 - Added DD Disclosure copy
// v3.5.8 - Updated IW OPP number for q2 (3/5/24)

// AVAILABLE MODULES
// WHAT'S RUNNNIG - hightlights which components of Jira Auto that are currently active. Should always be running
// Jira Auto - Ticket Creator
// Code Table - Creator
// Jira Auto - Verification
// Game UUID - URL Updater

window.addEventListener('load', function() {
    'use strict';


    console.log("Jira Auto is running-console");
    // Create user-visible indication the script is running

    let script_active_notification_div = document.createElement("div");
    let notification_containing_div = document.getElementById("notification_container_div");
    script_active_notification_div.id = "jira_auto_active_notification_div";
    script_active_notification_div.innerHTML = "Jira Auto - Ticket Creator";
    script_active_notification_div.style.backgroundColor = "#99ccff";
    script_active_notification_div.style.padding = "5px";
    script_active_notification_div.style.fontSize = "10px";
    script_active_notification_div.style.fontWeight = "bold";
    script_active_notification_div.style.display = "block";
    script_active_notification_div.style.width = "100%";
    notification_containing_div.append(script_active_notification_div);
    document.execCommand('createBtn');

})

/* I tried many different ways to make the automation/verification happen on the first page, but have come to the conclusion it works better in EDIT mode
because some of the fields are not editable unless you are in there - This is an alert suggesting they make changes in there. there are other fields that still need to be added*/
var editButton = document.getElementById('edit-issue');
editButton.addEventListener("click", hooooold);
var statusValue = document.getElementById('status-val').textContent;

console.log('Text;' + statusValue);


//Needs delay to allow fields to load.
function hooooold() {
    var timeout = setTimeout(changeStuff, 1000);
}


// This is the Jira Auto portion that will autofill fields based on entries made to SKU - NAME - VALID DATES
function changeStuff() {

    console.log('totalUpdate about to happen');
    alert("Jira Auto - Ticket Creator is running");

    var Name = document.getElementById('customfield_16503');
    var SKU = document.getElementById('customfield_16000');
    var fromDate = document.getElementById('customfield_17202');
    var toDate = document.getElementById('customfield_17203');

    SKU.focus();
    SKU.select();

    Name.onchange = totalUpdate;
    SKU.onchange = totalUpdate;
    fromDate.onchange = totalUpdate;
    toDate.onchange = totalUpdate;


    function totalUpdate(e) {
        var PointsField = document.getElementById('customfield_16515');
        var Name = document.getElementById('customfield_16503');

        var NameValue = Name.value
        .replace(/[​]/g, '') //Removes invisible characters;
        Name.value = NameValue.trim();
        var NameTrim = NameValue.trim();
        var SKU = document.getElementById('customfield_16000');
        var SKUValue = SKU.value;
        var SKUTrim = SKU.value.trim();
        let ItemValue = document.getElementById('customfield_16511');
        const PrimaryId = document.getElementById('customfield_16102');
        let GameUUID = document.getElementById('customfield_16500');
        const goodsId = document.getElementById('customfield_16400');
        const DetailLink = document.getElementById('customfield_18400');
        const DirectURL = document.getElementById('customfield_16516');
        const TileTitle = document.getElementById('customfield_16504');
        const ImageURL = document.getElementById('customfield_17302');
        const NameDrawer = document.getElementById('customfield_16506');
        const PrizePoolName = document.getElementById('customfield_16800');
        const AEMTitle = document.getElementById('customfield_16506');
        const AEMTileTitle = document.getElementById('customfield_16504');
        let DisplayedSavings = document.getElementById('customfield_16513');
        let DisplayedSavingsValue = DisplayedSavings.value;
        var RewardsDeploy = document.getElementById('customfield_17001');
        var rewardClient = document.getElementById('customfield_17300');
        var rewardClientValue = rewardClient.options[rewardClient.selectedIndex].value;
        //FROM DATE
        const fromDate = document.getElementById('customfield_17202');
        let fromDateValue = fromDate.value;
        const fromDateDay = fromDateValue.match(/\d{2}(?=\/)|\d{1}(?=\/)/g);
        const fromDateMonth = fromDate.value.replace(/(\s|[^a-zA-Z])/g, "");
        let fromDateYear = fromDate.value.match(/\d+$/);
        //TO DATE
        const toDate = document.getElementById('customfield_17203');
        let toDateValue = toDate.value;
        const toDateDay = toDateValue.match(/\d{2}(?=\/)|\d{1}(?=\/)/g);
        const toDateMonth = toDate.value.replace(/(\s|[^a-zA-Z])/g, "");
        let toDateYear = toDate.value.match(/\d+$/);
        const summary = document.getElementById('summary');
        const nameForSummary = NameValue
        .replace(/[’]/g, "'")
        .replace(/[']/g, "")
        .replace(/[:]/g, "")
        .replace(/ Instant Win Play/gi, '')
        .replace(/ Instant Win/gi, '')
        .replace(/Daily Deal/gi, '')
        .replace(/Extra Credit/gi, '')
        .replace(/Sweepstakes/gi, '')
        .replace(/ eGiftCard/gi, '')
        .replace(/ eGift Card/gi, '')
        .replace(/ E-Gift card/gi, '')
        .replace(/ Gift Card/gi, '')
        .trim();
        const Walmart = /.* Walmart eGift Card/gi;
        const Gap = /Gap eGift Card/g;
        const EGiftSubstring = / eGift Card/gi;
        const EGiftSubstring2 = / E-Gift Card/gi;
        const ItemValueValue = (NameValue.replace(/([a-zA-Z]|\s|\&|[®]|[™]|[’]|[']|[-]|[.]|[:])/g, ''))
        .replace(/1800/g, '')
        .trim();
        const ShortName = NameValue
        .trim()
        .replace(/[$]/gi, '')
        .replace(/[’]/g, "'")
        .replace(/[0-9]/g, '')
        .replace(/ Instant Win Play/gi, ' Instant Win')
        .replace(/Daily Deal/gi, '')
        .replace(/Extra Credit/gi, '')
        .replace(/\s+$/, '')
        .trim();
        let TransNameValue = NameValue
        .replace(EGiftSubstring, ' Gift Card')
        .replace(EGiftSubstring2, ' Gift Card')
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

        var prizePoolItemName = NameValue
        .replace(/[0-9]/g, '')
        .replace(/[-]|[’]|[.]|[,]|[“]|[”]|[‘]|[®]|[$]|[™]|[:]|[*]/gi, '')
        .replace(/ &/, "")
        .replace(/[é]/g, "e")
        .replace(/[’]/g, "'")
        .replace(/[']/g, "")
        .replace(/ Instant Win Play/gi, '')
        .replace(/ Instant Win/gi, '')
        .replace(/Daily Deal/gi, '')
        .replace(/Extra Credit/gi, '')
        .replace(/Sweepstakes/gi, '')
        .trim();


        if (NameValue == "") {
            Name.focus();
        }

        //SKU CHECKER
        let skuChecker = SKUValue.substring(0, 2);

        if (skuChecker == 10 || skuChecker == 13) {
            var isPO = 1;
        }
        else if (skuChecker >= 11 && skuChecker < 12) {
            var isContribution = 1;
        }
        else if (skuChecker == 12 || skuChecker == 14) {
            var isDD = 1;
        }
        else if ((skuChecker >= 30 && skuChecker <= 39)) {
            var isIW = 1;
        }
        else if ((skuChecker >= 40 && skuChecker <= 49)) {
            var isSweeps = 1;
        }
        else if (skuChecker == 60) {
            var isEGreeting = 1;
        }
        else if ((skuChecker >= 90 && skuChecker <= 93)) {
            var isEC = 1;
        }

        //TYPE OF ITEM
        var typeOfItem = "";
        var endOfPrimaryID = "";

        if (isIW) {
            typeOfItem = "IW";
            endOfPrimaryID = "iw";
        }
        else if (isSweeps) {
            typeOfItem = "Sweeps";
            endOfPrimaryID = "sweeps";
        }
        else if (isEC) {
            typeOfItem = "EC";
            endOfPrimaryID = "ec";
        }
        else if (isDD) {
            typeOfItem = "DD";
            endOfPrimaryID = "dd";
        }
        else if (isPO) {
            typeOfItem = "PO"
        }
        else if (isEGreeting) {
            typeOfItem = "Greeting Card";
            endOfPrimaryID = "egreetingcard";
        }
        else if (isContribution) {
            typeOfItem = "Contribution"
        }



        // START AND END DATES CLEAR //
        var startDate = document.getElementById('customfield_11113');
        var endDate = document.getElementById('customfield_11112');

        startDate.value = "";
        endDate.value = "";

        // AEM TITLES
        if (isIW) {
            AEMTileTitle.value = ShortName + "*";
            AEMTitle.value = ShortName + "*";
        }

        else if (isSweeps) {
            AEMTileTitle.value = NameValue.trim() + "*";
            AEMTitle.value = NameValue.trim() + "*";
        }
        else {
            AEMTileTitle.value = ShortName;
            AEMTitle.value = ShortName;
        }

        const NewTransNameLower = NewTransNameCamel.toLowerCase();
        var primaryIDName = prizePoolItemName
        .toLowerCase()
        .replace(/\s/g, "")
        .replace(/aarpfoundationpointscontribution/g, '');
        console.log(prizePoolItemName + endOfPrimaryID);
        const PrimaryIDValue = SKUValue + primaryIDName + endOfPrimaryID
        .trim();
        const NewURL = PrimaryIDValue;
        const SweepsFinder = NewURL.substring(0, 1);
        const rewardType = document.getElementById('customfield_15702');
        var rewardTypeValue = rewardType.options[rewardType.selectedIndex].value;
        var rewardTypeSelected = rewardType.options[rewardType.selectedIndex].text;
        var availability = document.getElementById('customfield_16002');
        let ParticipantCost = document.getElementById('customfield_16512');
        var goodsType = document.getElementById('customfield_17204');
        var lowWatermark = document.getElementById('customfield_17206');
        var supplier = document.getElementById('customfield_17301');
        var fulfillment = document.getElementById('customfield_17002-1');
        var codeFormatURL = document.getElementById('customfield_17007');
        var filterTags = document.getElementById('customfield_16401');
        var filterTagsValue = filterTags.value;
        var digitalCodeSiteURL = document.getElementById('customfield_17802');
        var oppNumber = document.getElementById('customfield_17006');
        var brandName = document.getElementById('customfield_16001');
        var brandNameValue = nameForSummary
        .replace(/[0-9]/g, '')
        .replace(/[’]|[.]|[“]|[”]|[$]|[®]|[™]/gi, '')
        .replace(/[é]/gi, 'e');



        NameValue = NameTrim;

        goodsId.value = "";

        DetailLink.value = "https://aarp-rewards.promo.eprize.com/api/v3/goods/" + PrimaryIDValue + "/detail/";

        //Primary ID Creator
        PrimaryId.value = PrimaryIDValue;

        if (Name.value.length > 160) {
            alert("Current Name is too long for LMP - Please reduce it's  to less than 60 characters");
            Name.focus();
        }

        //ADDS content to field if it isn't already filled because of a clone
        if (ImageURL.value.length < 61) {
            ImageURL.value = "https://cdn.aarp.net/content/dam/aarp/rewards/redeem/catalog/";
        }

        //Direct URL creator
        if (isSweeps) {
            DirectURL.value = 'https://www.aarp.org/rewards/redeem/sweeps/' + NewURL + '/';
        }
        else if (isEC) {
            DirectURL.value = 'https://www.aarp.org/rewards/redeem/' + NewURL + 'ec/';
        }
        else {
            DirectURL.value = 'https://www.aarp.org/rewards/redeem/' + PrimaryIDValue + '/';
        }


        ItemValue.value = ItemValueValue;

        if (isIW || isSweeps) {
            let GameUUID = document.getElementById('customfield_16500');

            if (GameUUID.value == "") {
                GameUUID.value = "TBD";
            }
            if (GameUUID.value == "TBD") {
                var UUIDTBD = 1;
            }


            var UUIDTrim = GameUUID.value.trim();

            GameUUID.value = UUIDTrim;
            NameValue = NameTrim;
            SKU.value = SKUTrim;
        }

        //brandName.value = brandNameValue;

        var constrainDate = document.getElementById('customfield_18600');
        constrainDate.value = "";

        if (isSweeps) {
            constrainDate.value = ("5/" + fromDateMonth + "/" + fromDateYear);
        }

        if (isIW || isSweeps) {
            PrizePoolName.value = (SKUValue + " " + prizePoolItemName + " " + fromDateMonth + " 20" + fromDateYear);
        }
        else {
            PrizePoolName.value = '';
        }

        //REWARDS DEPLOY PATH CREATOR
        var SN = fromDateMonth;
        var Q = "";
        var sQ = "";

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

        if (isIW) {
            RewardsDeploy.value = ("aarp/" + fromDateYear + Q + "instantwin");
            if (RewardsDeploy.value == "aarp/23q1instantwin") {
                oppNumber.value = '256963';
            }
            if (RewardsDeploy.value == "aarp/23q2instantwin") {
                oppNumber.value = '257464';
            }
            if (RewardsDeploy.value == "aarp/23q4instantwin") {
                oppNumber.value = '258736';
            }
            if (RewardsDeploy.value == "aarp/24q1instantwin") {
                oppNumber.value = '259097';
            }
            if (RewardsDeploy.value == "aarp/24q2instantwin") {
                oppNumber.value = '259643';
            }
        }
        else if (isSweeps) {
            if ((Q == "q1" || Q == "q2")) {
                sQ = 'q1q2';
            }
            else {
                sQ = 'q3q4'
            }
            RewardsDeploy.value = ("aarp/" + fromDateYear + sQ + "sweepstakes");
            if (RewardsDeploy.value == "aarp/23q1q2sweepstakes") {
                oppNumber.value = '256965';
            }
            if (RewardsDeploy.value == "aarp/24q1q2sweepstakes") {
                oppNumber.value = '259098';
            }

        }
        else {
            RewardsDeploy.value = "";
        }



        //This sets the OAMOE URL
        var RewardsDeployValue = RewardsDeploy.value;
        const OamoeURL = document.getElementById('customfield_16517');
        var oamoeRewardDeploy = (fromDateYear + Q + "instantwin");
        var theUUID = GameUUID.value.trim();

        if (isIW && UUIDTBD) {
            OamoeURL.value = 'https://sweeps.aarp.org/' + oamoeRewardDeploy + '/oamoe_entry?game=' + theUUID;
        }
        else {
            OamoeURL.value = "";
        }



        //DISCLOSURE UPDATE

        var disclosureCopy = document.getElementById('customfield_16508');
        var monthNumber = '';
        var pertinentMonth = "";
        var pertinentDay = "";
        var pertinentYear = "";

        //DATE CHECKER
        if (isIW) {
            pertinentMonth = toDateMonth;
            pertinentDay = toDateDay;
            pertinentYear = toDateYear;
        }
        else if (isSweeps) {
            pertinentMonth = fromDateMonth;
            pertinentDay = fromDateDay;
            pertinentYear = fromDateYear;
        }

        var lastDayOfMonth = "";
        if (pertinentMonth == "Feb") {
            lastDayOfMonth = "28";
        }
        else if (pertinentMonth == "Apr" | pertinentMonth == "Jun" | pertinentMonth == "Sep" | pertinentMonth == "Nov") {
            lastDayOfMonth = "30";
        }
        else {
            lastDayOfMonth = "31"
        }

        var fullMonth = '';
        var fromMonth = '';
        var toMonth = '';


        if (pertinentMonth === "Jan") {
            fullMonth += "January";
            monthNumber += "1";
        }
        if (pertinentMonth === "Feb") {
            fullMonth += "February";
            monthNumber += "2";
        }
        if (pertinentMonth === "Mar") {
            fullMonth += "March";
            monthNumber += "3";
        }
        if (pertinentMonth === "Apr") {
            fullMonth += "April";
            monthNumber += "4";
        }
        if (pertinentMonth === "May") {
            fullMonth += "May";
            monthNumber += "5";
        }
        if (pertinentMonth === "Jun") {
            fullMonth += "June";
            monthNumber += "6";
        }
        if (pertinentMonth === "Jul") {
            fullMonth += "July";
            monthNumber += "7";
        }
        if (pertinentMonth === "Aug") {
            fullMonth += "August";
            monthNumber += "8";
        }
        if (pertinentMonth === "Sep") {
            fullMonth += "September";
            monthNumber += "9";
        }
        if (pertinentMonth === "Oct") {
            fullMonth += "October";
            monthNumber += "10";
        }
        if (pertinentMonth === "Nov" || summaryMonth === "Nov") {
            fullMonth += "November";
            monthNumber += "11";
        }
        if (pertinentMonth === "Dec") {
            fullMonth += "December";
            monthNumber += "12";
        }

//SUMMARY MONTH SET

        var summaryMonth = fromDateMonth;
        var summaryMonthNumber = '';

        if (summaryMonth === "Jan") {
            summaryMonthNumber += "1";
        }
        if (summaryMonth === "Feb") {
            summaryMonthNumber += "2";
        }
        if (summaryMonth === "Mar") {
            summaryMonthNumber += "3";
        }
        if (summaryMonth === "Apr") {
            summaryMonthNumber += "4";
        }
        if (summaryMonth === "May") {
            summaryMonthNumber += "5";
        }
        if (summaryMonth === "Jun") {
            summaryMonthNumber += "6";
        }
        if (summaryMonth === "Jul") {
            summaryMonthNumber += "7";
        }
        if (summaryMonth === "Aug") {
            summaryMonthNumber += "8";
        }
        if (summaryMonth === "Sep") {
            summaryMonthNumber += "9";
        }
        if (summaryMonth === "Oct") {
            summaryMonthNumber += "10";
        }
        if (summaryMonth === "Nov") {
            summaryMonthNumber += "11";
        }
        if (summaryMonth === "Dec") {
            summaryMonthNumber += "12";
        }



        //Disclosure Date Setter
        var thisMonth = "";

        if (thisMonth == "Feb") {
            lastDayOfMonth = "28";
        }
        else if (thisMonth == "Apr" | thisMonth == "Jun" | thisMonth == "Sep" | thisMonth == "Nov") {
            lastDayOfMonth = "30";
        }
        else {
            lastDayOfMonth = "31"
        }

        var readableDate = "";

        readableDate = (fullMonth + ' ' + toDateDay +', 20'+toDateYear);






        /// THIS IS THE SUMMARY SECTION WHICH NEEDS TO BE DISCUSSED/////


        /*
*/
        var inventory = document.getElementById('customfield_16101');
        var inventoryValue = inventory.value;
        var summaryValue = summaryMonthNumber + "/" + fromDateDay + " | " + typeOfItem + " | " + nameForSummary + ", " + SKUValue;

        //NEEDS TO ACCOMODATE FOR SUPER PLAY

        if ((isIW && inventoryValue >= 126)) {
            summary.value = summaryValue + " *SUPER PLAY*";
        }
        else {
            summary.value = summaryValue;
        }


        inventory.addEventListener("change", IWsummaryUpdate);
        function IWsummaryUpdate() {
            var inventory = document.getElementById('customfield_16101');
            var inventoryValue = inventory.value;
            var summary = document.getElementById('summary');
            var summaryValue = summaryMonthNumber + "/" + fromDateDay + " | " + typeOfItem + " | " + nameForSummary + ", " + SKUValue;

            if ((isIW && inventoryValue >= 126)) {
                summary.value = summaryValue + " *SUPER PLAY*";
            }
            else {
                summary.value = summaryValue;
            }
        }

        console.log(typeOfItem, SKUValue); //CONSOLE LOG


        let RetailValue = document.getElementById('customfield_16511');
        let RetailValueNum = RetailValue.value

        if (isDD) {
            if (RetailValue.length == 1 ) {
                disclosureCopy.value = '<p>*New offer available to the first 150 AARP Rewards members (50 U.S. (D.C.)) each weekday (Monday through Friday) while supplies last. You may only purchase this gift card one time. You may purchase up to 5 gift cards per month. Fulfilled as a digital gift code. This digital gift card is non-refundable. In some instances delivery may take longer than 24 hours. </p>'
            }
            else {
                disclosureCopy.value = '<p>*New offer available to the first 150 AARP Rewards members (50 U.S. (D.C.)) each weekday (Monday through Friday) while supplies last. You may only purchase this gift card one time. You may purchase up to 5 gift cards per month. Fulfilled as a digital gift code. This digital gift card is non-refundable. In some instances delivery may take longer than 24 hours. </p>';
            }
        }

        // IW - SWEEPS ABSOLUTES

        // REWARDS TYPE SELECTOR
        // DISPLAYED SAVINGS
        // IW CLIENT
        // Availability
        // PARTICIPANT COST
        // Low Watermark
        // GOODS TYPE
        // FULFILLMENT
        // AEM FILTER TAGS
        // codeformat is URL


        if (isSweeps) {
            var sweepsfilterTagsSelected = '';
            sweepsfilterTagsSelected = filterTags.options[filterTags.selectedIndex];
            rewardType.selectedIndex = 10;
            DisplayedSavings.value = "0";
            rewardClient.selectedIndex = 1;
            supplier.selectedIndex = 1;
            ParticipantCost.value = "";
            goodsType.selectedIndex = 4;
            lowWatermark.value = "0";
            codeFormatURL.selectedIndex = 1;
            document.getElementById('customfield_16401').setAttribute("multiple", "multiple");


            //DESELECTING FILTERS
            filterTags.options[0].selected = false;
            filterTags.options[1].selected = false;
            filterTags.options[2].selected = false;
            filterTags.options[3].selected = false;
            filterTags.options[4].selected = false;
            filterTags.options[5].selected = false;
            filterTags.options[6].selected = false;
            filterTags.options[7].selected = false;
            filterTags.options[8].selected = false;
            filterTags.options[9].selected = false;
            filterTags.options[10].selected = false;
            filterTags.options[12].selected = false;
            filterTags.options[13].selected = false;
            filterTags.options[14].selected = false;
            filterTags.options[15].selected = false;
            filterTags.options[17].selected = false;

            filterTags.options[16].setAttribute("selected", "selected");
            filterTags.options[11].setAttribute("selected", "selected");
            disclosureCopy.value = '<p>*No Points Necessary. See <a title="Hyperlink to the Official Rules" href="https://www.aarp.org/about-aarp/rewards-terms-and-conditions/sweeps-rules/" target="_blank">*Official Rules</a> for alternate method of entry, odds and all details. Void where prohibited. Must enter by ' + readableDate + ' at 11:59 p.m. ET. Limit 10 entries per day per person. Open only to AARP Rewards participants who reside in the 50 U.S. (D.C.). Void in PR, Guam and the USVI. </p>';
        }
        if (isIW) {
            var iwfilterTagsSelected = '';
            iwfilterTagsSelected = filterTags.options[filterTags.selectedIndex].text;
            rewardType.selectedIndex = 3;
            DisplayedSavings.value = "0";
            rewardClient.selectedIndex = 1;
            availability.selectedIndex = 1;
            ParticipantCost.value = "";
            lowWatermark.value = "0";
            goodsType.selectedIndex = 3;
            supplier.selectedIndex = 1;
            fulfillment.checked = true;
            codeFormatURL.selectedIndex = 1;
            digitalCodeSiteURL.value = "";
            document.getElementById('customfield_16401').setAttribute("multiple", "multiple");

            //DESELECTING FILTERS
            filterTags.options[0].selected = false;
            filterTags.options[1].selected = false;
            filterTags.options[2].selected = false;
            filterTags.options[3].selected = false;
            filterTags.options[4].selected = false;
            filterTags.options[6].selected = false;
            filterTags.options[7].selected = false;
            filterTags.options[8].selected = false;
            filterTags.options[9].selected = false;
            filterTags.options[12].selected = false;
            filterTags.options[13].selected = false;
            filterTags.options[14].selected = false;
            filterTags.options[15].selected = false;
            filterTags.options[17].selected = false;

            filterTags.options[10].setAttribute("selected", "selected");
            filterTags.options[5].setAttribute("selected", "selected");
            filterTags.options[16].setAttribute("selected", "selected");
            filterTags.options[11].setAttribute("selected", "selected");
            disclosureCopy.value = '<p>*No Points Necessary. See <a title="Hyperlink to the Official Rules" href="https://www.aarp.org/about-aarp/rewards-terms-and-conditions/instant-win-rules/" target="_blank">Official Rules</a> for alternate method of entry, odds and all details. Must enter by ' + readableDate + ' at 11:59 p.m. ET. Void where prohibited. Limit 1 play each &ldquo;Day&rdquo; (defined as 12:00 a.m. ET through 11:59 p.m. ET) per person. Open only to AARP Rewards participants who reside in the 50 U.S. (D.C.). Void in PR, Guam and the USVI.</p>';
        }

    }

    //*************************END OF TOTAL UPDATE******************************



    //Primary ID Change Updates the Direct URL

    var existingPrimaryId = document.getElementById('customfield_16102');
    existingPrimaryId.onchange = updateURL;
    function updateURL(e) {
        var updatedDirectURL = document.getElementById('customfield_16516');
        updatedDirectURL.value = "https://www.aarp.org/rewards/redeem/" + SKU.value + existingPrimaryId.value;
    }

    //Code Format is URL Setter  BASED ON DIGITAL OR PHYSICAL

    var sweepstakesPrizeType = document.getElementById('customfield_17610');
    sweepstakesPrizeType.onchange = codeFormatCheck;

    function codeFormatCheck() {
        var sweepstakesPrizeTypeValue = sweepstakesPrizeType.selectedIndex;
        var codeFormat = document.getElementById('customfield_17007');

        if (sweepstakesPrizeTypeValue == "1") {
            var codeFormatYes = codeFormat.selectedIndex = 1;
        }
        else {
            var codeFormatNo = codeFormat.selectedIndex = 2;
            alert('Please make sure to fill out "Digital Code Site URL" field');
        }
    }

    //RETAIL VALUE AUTO UPDATER

    let RetailValue = document.getElementById('customfield_16511');
    let RetailValueNum = RetailValue.value
    .replace(/[$]|[‘]/g, '');
    let ParticipantCost = document.getElementById('customfield_16512');
    let ParticipantCostValue = ParticipantCost.value;
    let DisplayedSavings = document.getElementById('customfield_16513');
    let DisplayedSavingsNum = (RetailValueNum - ParticipantCostValue);
    let DisplayedSavingsValue = ('$' + DisplayedSavingsNum);
    let DisplayedDiscount = document.getElementById('customfield_16514');
    let DisplayedDiscountValue = (DisplayedSavingsNum / RetailValueNum);
    let DiscountPercent = Number(DisplayedDiscountValue).toLocaleString(undefined, {
        style: 'percent'
    });
    let PointsField = document.getElementById('customfield_16515');
    let PointsFieldValue = PointsField.value;



    PointsField.addEventListener("change", pointModifier);
    function pointModifier() {
        let ParticipantCost = document.getElementById('customfield_16512');
        let DisplayedSavings = document.getElementById('customfield_16513');
        let DisplayedDiscount = document.getElementById('customfield_16514');
        let RetailValue = document.getElementById('customfield_16511');
        //SKU CHECKER
        let SKUValue = SKU.value;
        let skuChecker = SKUValue.substring(0, 2);
        if ((skuChecker >= 40 && skuChecker <= 49)) {
            var isSweeps = 1;
        }
        else if ((skuChecker >= 30 && skuChecker <= 39)) {
            var isIW = 1;
        }
        ParticipantCost.value = '';
        DisplayedSavings.value = "";
        DisplayedDiscount.value = "";
        if (isIW || isSweeps) {
            DisplayedSavings.value = '0';
        }
        else {
            DisplayedSavings.value = DisplayedSavingsValue;
        }
    }

    ParticipantCost.addEventListener("change", costModifier);
    function costModifier() {
        let RetailValue = document.getElementById('customfield_16511');
        let ParticipantCost = document.getElementById('customfield_16512');
        let DisplayedSavings = document.getElementById('customfield_16513');
        let DisplayedDiscount = document.getElementById('customfield_16514');
        let PointsField = document.getElementById('customfield_16515');
        let RetailValueNum = RetailValue.value
        .replace(/[$]|[‘]/g, '');
        let ParticipantCostValue = ParticipantCost.value;
        let DisplayedSavingsNum = (RetailValueNum - ParticipantCostValue);
        let DisplayedDiscountValue = (DisplayedSavingsNum / RetailValueNum);
        let DiscountPercent = Number(DisplayedDiscountValue).toLocaleString(undefined, {
            style: 'percent'
        });
        let SKUValue = SKU.value;
        let skuChecker = SKUValue.substring(0, 2);
        if ((skuChecker >= 40 && skuChecker <= 49)) {
            var isSweeps = 1;
        }
        else if ((skuChecker >= 30 && skuChecker <= 39)) {
            var isIW = 1;
        }
        PointsField.value = "";
        DisplayedSavings.value = "";
        if (isIW || isSweeps) {
            DisplayedSavings.value = "0"
        }
        else {
            DisplayedSavings.value = DisplayedSavingsValue;
            DisplayedDiscount.value = DiscountPercent;
        }
    }



    //Auto LOW WATERMARK

    var inventory = document.getElementById('customfield_16101');

    inventory.addEventListener("change", autoLow);
    function autoLow() {
        var inventory = document.getElementById('customfield_16101');
        var lowWatermark = document.getElementById('customfield_17206');
        var SKU = document.getElementById('customfield_16000');
        var SKUValue = SKU.value;
        let skuChecker = SKUValue.substring(0, 2);
        if ((skuChecker >= 30 && skuChecker <= 39)) {
            var isIW = 1;
        };
        if (isIW = 0) {
            lowWatermark.value = (inventory.value / 5);
        }

    }

}
