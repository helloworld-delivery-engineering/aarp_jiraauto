// ==UserScript==
// @name         Jira Auto
// @namespace    https://jiradc.helloworld.com/
// @version      2.3.2
// @description  Efficiently and accurately creating new Rewards Catalog Item Jira tickets
// @author       Colby Lostutter and the Blue Workstream
// @match        https://jiradc.helloworld.com/*
// @grant        none
// @run-at       document-end
// ==/UserScript==


// update 1.8.2 date  11-28 - corrections
//update 1.8.3 Date 12-21 - Sweepstakes verification
// update 1.8.4 Date 01-03 - Continuation of sweepstakes
// update 1.8.5 - 01-03-23 Date Checker corrected to acoomodate for different amount of days.
// Disclosure text updated to capture end of month date
// Update 1.9 IW Finished and Errors in place.
// Updating DeployPath for Extra Credit
// Got AEM Filter Tags working
// Sweepstakes Automation completed 01-13-23 V 2.0
// Sweeps Auto corrections/updates and Verification V 2.1 01-17-23
// Summary added - Opp Number added
// Clean Up and Participation cost updates 01-20-23
// corrected mistake. V2.2
// Fixed Februarys month number, revamped how prizepool is created, made Brand - Merchant field auto fill
// created v2.3
// v2.3.2 Removed errant spaces in SKU

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
var statusValue = document.getElementById('status-val').textContent;

console.log('Text;' + statusValue);



function alertTest() {
    alert('any changes made here affect other fields. Please use the "edit" button to make sure all changes are made correctly');
}

//Needs delay to allow fields to load - could be less than 3000 haven't tested.

function hooooold() {
    var timeout = setTimeout(changeStuff, 1000);

}


// This is the Jira Auto portion that will autofill fields based on entries made to SKU - NAME - VALID DATES

function changeStuff() {

    console.log('totalUpdate about to happen');

    alert("Jira Auto is loaded and ready to work");

    var Name = document.getElementById('customfield_16503');
    var SKU = document.getElementById('customfield_16000');
    var fromDate = document.getElementById('customfield_17202');
    let GameUUID = document.getElementById('customfield_16500');



    Name.onchange = totalUpdate;
    SKU.onchange = totalUpdate;
    fromDate.onchange = totalUpdate;
    GameUUID.onchange = totalUpdate;


    /* When Name, SKU or Valid date is added or updated, the following changes occur. Primary ID - AEM Title - AEM Tile Title - */

    function totalUpdate(e) {
        var PointsField = document.getElementById('customfield_16515');
        var Name = document.getElementById('customfield_16503');
        var NameTrim = Name.value.trim();
        var SKU = document.getElementById('customfield_16000');
        var SKUValue = SKU.value;
        var SKUTrim = SKU.value.trim();
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
        const nameForSummary = Name.value
        .replace(/[’]/g, "'")
        .replace(/[']/g, "")
        .replace(/ Instant Win Play/gi, '')
        .replace(/ Instant Win/gi, '')
        .replace(/Daily Deal/gi, '')
        .replace(/Extra Credit/gi, '')
        .replace(/Sweepstakes/gi, '')
        .replace(/ eGift Card/gi, '')
        .replace(/ E-Gift card/gi, '')
        .replace(/ Gift Card/gi, '')
        .trim();
        const Walmart = /.* Walmart eGift Card/gi;
        const Gap = /Gap eGift Card/g;
        const EGiftSubstring = / eGift Card/gi;
        const EGiftSubstring2 = / E-Gift Card/gi;
        const ItemValueValue = (Name.value.replace(/([a-zA-Z]|\s|\&|[®]|[™]|[’]|[']|[-])/g, ''))
        .trim();
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
        .replace(/[^\w\s]/gi, '')
        .replace(/InstantWinPlay/gi, 'IW')
        .replace(/InstantWin/gi, 'IW')
        .replace(/DailyDeal/gi, 'DD')
        .replace(/ExtraCredit/gi, 'EC')
        .replace(/Sweepstakes/gi, 'Sweeps')
        .replace(/GiftCardSweeps/gi, 'Sweeps')
        .replace(/DigitalReward/gi, '');

        var prizePoolItemName = Name.value
        .replace(/[0-9]/g, '')
        .replace(/[-]|[’]|[.]|[“]|[”]|[®]|[$]|[™]/gi, '')
        .replace(/[’]/g, "'")
        .replace(/[']/g, "")
        .replace(/ Instant Win Play/gi, '')
        .replace(/ Instant Win/gi, '')
        .replace(/Daily Deal/gi, '')
        .replace(/Extra Credit/gi, '')
        .replace(/Sweepstakes/gi, '')
        .trim();

        //SKU CHECKER
        let skuChecker = SKUValue.substring(0, 2);

        if ((skuChecker >= 40 && skuChecker <= 49)) {
            var isSweeps = 1;
        }
        else if ((skuChecker >= 30 && skuChecker <= 39)) {
            var isIW = 1;
        }
        else if ((skuChecker == 90 || skuChecker == 93)) {
            var isEC = 1;
        }
        else if ((skuChecker == 10 || skuChecker >= 12)) {
            var isPO = 1;
        }
        else if ((skuChecker == 60 || skuChecker >= 69)) {
            var isEGreeting = 1;
        }
        else if ((skuChecker == 11)) {
            var isContribution = 1;
        }
        else if ((skuChecker == 12)) {
            var isDD = 1;
        }




        // AEM TITLES
        if (isIW) {
            AEMTileTitle.value = ShortName + "*";
            AEMTitle.value = ShortName + "*";
        }

        else if (isSweeps) {
            AEMTileTitle.value = Name.value + "*";
            AEMTitle.value = Name.value + "*";
        }
        else {
            AEMTileTitle.value = ShortName;
            AEMTitle.value = ShortName;
        }


        const NewTransNameLower = NewTransNameCamel.toLowerCase();
        const PrimaryIDValue = SKUValue + NewTransNameLower;
        const NewURL = SKUValue + NewTransNameLower.trim();
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


        console.log(PrimaryIDValue);

        //Primary ID Creator
        if (isEC) {
            PrimaryId.value = PrimaryIDValue + "ec"
        }
        else {
            PrimaryId.value = PrimaryIDValue;
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

        let GameUUID = document.getElementById('customfield_16500');

        Name.value = NameTrim;
        SKU.value = SKUTrim;

        //brandName.value = brandNameValue;

        console.log(ShortName, prizePoolItemName, NameTrim, nameForSummary, brandNameValue);


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

        }
        else {
            RewardsDeploy.value = "";
        }


        //This sets the OAMOE URL
        var RewardsDeployValue = RewardsDeploy.value;
        const OamoeURL = document.getElementById('customfield_16517');
        var theUUID = GameUUID.value;

        if (isIW) {
            OamoeURL.value = 'https://sweeps.aarp.org/' + RewardsDeployValue + '/oamoe_entry?game=' + theUUID;
        }
        else {
            OamoeURL.value = "";
        }


        //DISCLOSURE UPDATE

        var disclosureCopy = document.getElementById('customfield_16508');
        var actualMonth = '';
        var monthNumber = '';

        if (fromDateMonth === "Jan") {
            actualMonth += "January";
            monthNumber += "1";
        }
        if (fromDateMonth === "Feb") {
            actualMonth += "February";
            monthNumber += "2";
        }
        if (fromDateMonth === "Mar") {
            actualMonth += "March";
            monthNumber += "3";
        }
        if (fromDateMonth === "Apr") {
            actualMonth += "April";
            monthNumber += "4";
        }
        if (fromDateMonth === "May") {
            actualMonth += "May";
            monthNumber += "5";
        }
        if (fromDateMonth === "Jun") {
            actualMonth += "June";
            monthNumber += "6";
        }
        if (fromDateMonth === "Jul") {
            actualMonth += "July";
            monthNumber += "7";
        }
        if (fromDateMonth === "Aug") {
            actualMonth += "August";
            monthNumber += "8";
        }
        if (fromDateMonth === "Sep") {
            actualMonth += "September";
            monthNumber += "9";
        }
        if (fromDateMonth === "Oct") {
            actualMonth += "October";
            monthNumber += "10";
        }
        if (fromDateMonth === "Nov") {
            actualMonth += "November";
            monthNumber += "11";
        }
        if (fromDateMonth === "Dec") {
            actualMonth += "December";
            monthNumber += "12";
        }

        //Disclosure Date Setter
        var thisMonth = fromDateMonth;
        var lastDayOfMonth = "";

        if (thisMonth == "Feb") {
            lastDayOfMonth = "28";
        }
        else if (thisMonth == "Apr" | thisMonth == "Jun" | thisMonth == "Sep" | thisMonth == "Nov") {
            lastDayOfMonth = "30";
        }
        else {
            lastDayOfMonth = "31"
        }

        var readableDate = (actualMonth + ' ' + lastDayOfMonth +', 20'+fromDateYear);

        //TYPE OF ITEM
        var typeOfItem = "";

        if (isIW) {
            typeOfItem = "IW"
        }
        else if (isSweeps) {
            typeOfItem = "Sweeps"
        }
        else if (isEC) {
            typeOfItem = "EC"
        }
        else if (isDD) {
            typeOfItem = "DD"
        }


        summary.value = monthNumber + "/" + fromDateDay + " | " + typeOfItem + " | " + nameForSummary + ", " + SKUValue;
        ;
        console.log(typeOfItem);

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
            var sweepsfilterTagsSelected = filterTags.options[filterTags.selectedIndex];
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
            var iwfilterTagsSelected = filterTags.options[filterTags.selectedIndex].text;
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






        //this is to auto-create the code_table name. It fills in the extra credit lesson input
        /*
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
        */

    }

    //END OF TOTAL UPDATE

    //SKU CHECKER

    let SKUValue = SKU.value;
    let skuChecker = SKUValue.substring(0, 2);

    if ((skuChecker >= 40 && skuChecker <= 49)) {
        var isSweeps = 1;
    }
    else if ((skuChecker >= 30 && skuChecker <= 39)) {
        var isIW = 1;
    }


    console.log(skuChecker + "test2", isIW, isSweeps);


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
    .replace(/[$]/g, '');
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
        console.log('point');
        ParticipantCost.value = '';
        DisplayedSavings.value = "";
        DisplayedDiscount.value = "";
        if ((isIW) || (isSweeps)) {
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
        .replace(/[$]/g, '');
        let ParticipantCostValue = ParticipantCost.value;
        let DisplayedSavingsNum = (RetailValueNum - ParticipantCostValue);
        let DisplayedDiscountValue = (DisplayedSavingsNum / RetailValueNum);
        let DiscountPercent = Number(DisplayedDiscountValue).toLocaleString(undefined, {
            style: 'percent'
        });
        PointsField.value = "";
        DisplayedSavings.value = "";
        DisplayedSavings.value = DisplayedSavingsValue;
        DisplayedDiscount.value = DiscountPercent;
    }



    //Auto LOW WATERMARK

    var inventory = document.getElementById('customfield_16101');

    inventory.addEventListener("change", autoLow);
    function autoLow() {
        var inventory = document.getElementById('customfield_16101');
        var lowWatermark = document.getElementById('customfield_17206');

        lowWatermark.value = (inventory.value / 5);
        console.log(inventory.value);

    }

    //ERROR HANDLING ON UPDATE BUTTON

    let updateButton = document.getElementById('edit-issue-submit');
    updateButton.onclick = checkForErrors;

    function checkForErrors(e) {
        var SKU = document.getElementById('customfield_16000');
        const rewardType = document.getElementById('customfield_15702');
        var rewardTypeValue = rewardType.options[rewardType.selectedIndex].value;
        var rewardTypeSelected = rewardType.options[rewardType.selectedIndex].text;
        var SKUValue = SKU.value;
        const skuChecker = SKUValue.substring(0, 1);

        if ((skuChecker >= 40 && skuChecker <= 49)) {
            isSweeps = 1;
        }
        else if ((skuChecker >= 30 && skuChecker <= 39)) {
            isIW = 1;
        }
        else if ((skuChecker == 90 || skuChecker == 93)) {
            //isEC = 1;
        }

        var correct = "#dfe1e6";
        var incorrect = "#990000";

        var DisplayedSavings = document.getElementById('customfield_16513');
        var DisplayedSavingsValue = DisplayedSavings.value;

        var availability = document.getElementById('customfield_16002');
        var availabilityValue = availability.options[availability.selectedIndex].value;
        var codeFormat = document.getElementById('customfield_17007');
        var codeFormatValue = codeFormat.options[codeFormat.selectedIndex].value;
        var codeFormatText = codeFormat.options[codeFormat.selectedIndex].text;
        var digitalCodeSiteURL = document.getElementById('customfield_17802');
        var digitalCodeSiteURLValue = digitalCodeSiteURL.value;
        var fromDate = document.getElementById('customfield_17202');
        var fromDateValue = fromDate.value;
        var fromDateNum = fromDateValue.substring(0, fromDateValue.indexOf("/"));
        var fromDateMonth = fromDate.value.replace(/(\s|[^a-zA-Z])/g, "");
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
        var vendorCertificate = document.getElementById('customfield_16518');
        var noError = ("");
        var PrizePoolName = document.getElementById('customfield_16800');
        var sevenDayCheck = toDateNum - fromDateNum;
        var startDate = document.getElementById('customfield_11113');
        var endDate = document.getElementById('customfield_11112');
        var startDateValue = startDate.value;
        var endDateValue = endDate.value;
        var globalErrorConfirm = '';
        //FROM DATE
        var fromDateDay = fromDateValue.match(/\d{2}(?=\/)|\d{1}(?=\/)/g);
        let fromDateYear = fromDate.value.match(/\d+$/);
        //TO DATE
        var toDateDay = toDateValue.match(/\d{2}(?=\/)|\d{1}(?=\/)/g);
        var toDateMonth = toDate.value.replace(/(\s|[^a-zA-Z])/g, "");
        var longDescription = document.getElementById('customfield_16507');
        var longDescriptionValue = longDescription.value;



        //VENDOR CHECKER
        /*if (supplierValue != '18203') {
            vendorCertificate.value == 0;
        }
        else (supplierValue == '18203') {
            vendorCertificate.value = 'Blackhawk';
        }*/

        startDateValue = "";
        endDateValue = "";

        var erText = "";

        //DATE CHECKER

        var thisMonth = fromDateMonth;
        var lastDayOfMonth = "";

        if (thisMonth == "Feb") {
            lastDayOfMonth = "28";
        }
        else if (thisMonth == "Apr" | thisMonth == "Jun" | thisMonth == "Sep" | thisMonth == "Nov") {
            lastDayOfMonth = "30";
        }
        else {
            lastDayOfMonth = "31"
        }

        //CODE FORMAT CHECKER
        if (codeFormatText == 'No') {
            if (digitalCodeSiteURLValue.length < 1) {
                digitalCodeSiteURL.style.borderColor = incorrect;
                confirm('Code Format is "NO" Site URL should have URL');
                e.preventDefault();
            }
            else {
                digitalCodeSiteURL.style.borderColor = correct;
            }
        }
        if (codeFormatText == 'Yes') {
            if (digitalCodeSiteURLValue.length > 1) {
                digitalCodeSiteURL.style.borderColor = incorrect;
                confirm('Code Format is "Yes" Site URL should be Empty');
                e.preventDefault();
            }
            else {
                digitalCodeSiteURL.style.borderColor = correct;
            }
        }

        //REWARD TYPE PURCHASE CHECK
        if((rewardTypeValue == '17005') || (rewardTypeValue == '16444') || (rewardTypeValue == '17017')) {
            if(points.value.length > 0) {
                points.style.borderColor = incorrect;
                erText = ('Purchase Item, Points should be empty or 0');
                e.preventDefault();
            }
            else {
                points.style.borderColor = correct;
            }
        }

        //REWARD TYPE POINT CHECK

        if((rewardTypeValue == '16443') || (rewardTypeValue == '17702') || (rewardTypeValue == '17006')) {
            if(points.value.length > 0) {
                points.style.borderColor = incorrect;
                confirm('Points Item, Participant cost should be empty or 0');
                e.preventDefault();
            }
            else {
                console.log('reward check');
                points.style.borderColor = correct;
            }
        }

        // ERROR TEXT
        var er1 = "- Check reward type\n";
        var er2 = "- Reward Client must be AARP\n";
        var er3 = "- Low Watermark needs to be 0\n";
        var er4 = "- To / From Date should be 1st and last day of the same month\n";
        var er5 = "- Availability Needs to Be ALL\n";
        var er6 = "- Supplier Needs to be AARP\n";
        var er7 = "- Fulfillment needs to be Electronically Fulfilled\n";
        var er8 = "- To / From Date not 6 days apart\n";
        var er9 = "- Start and End Dates must be blank\n";
        var er10 = "- Game UUID should be TBD currently\n";
        var er11 = "- Savings should always be 0\n";
        var er12 = "- Goods ID should be TBD currently\n";
        var er13 = "- Points should have a value in it\n";
        var er14 = "- Code Format should always be Yes\n";
        var er15 = "- Long Description should have content\n";
        var er16 = "- Please check your inventory\n";




        //ALL CHECK

        if (longDescriptionValue.length >= 15) {
            longDescription.style.borderColor = correct;
        }
        else {
            longDescription.style.borderColor = incorrect;
            erText += er15;
            e.preventDefault();
        }
        if (endDateValue.length > 0) {
            endDate.style.borderColor = incorrect;
            erText += er9;
            e.preventDefault();
        }
        else {
            endDate.style.borderColor = correct;
        }
        if (startDateValue.length > 0) {
            startDate.style.borderColor = correct;
            erText += er9;
            e.preventDefault();
        }
        else {
            endDate.style.borderColor = correct;
        }

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

        //SWEEP & IW CHECK

        if ((isSweeps) || (isIW)) {

            if (rewardClientValue != '18200') {
                rewardClient.style.borderColor = incorrect;
                erText += er2;
                e.preventDefault();
            }
            else {
                rewardClient.style.borderColor = correct;
            }

            if (lowWatermarkValue != '0') {
                lowWatermark.style.borderColor = incorrect;
                erText += er3;
                e.preventDefault();
            }
            else {
                lowWatermark.style.borderColor = correct;
            }

            if (availabilityValue != '16601') {
                availability.style.borderColor = incorrect;
                erText += er5;
                e.preventDefault();
            }
            else {
                availability.style.borderColor = correct;
            }
            if (supplierValue != '18202') {
                supplier.style.borderColor = incorrect;
                erText += er6;
                e.preventDefault();
            }
            else {
                supplier.style.borderColor = correct;
            }

            if (fulfillmentValue == '17400') {
                fulfillment.style.borderColor = correct;
            }
            else {
                fulfillment.style.borderColor = incorrect;
                erText += er7;
                e.preventDefault();
            }
            if (GameUUID.value.length < 3) {
                GameUUID.style.borderColor = incorrect;
                erText += er10;
                e.preventDefault();
            }
            else {
                GameUUID.style.borderColor = correct;
            }
            if (DisplayedSavings.value != "0") {
                DisplayedSavings.style.borderColor = incorrect;
                erText += er11;
                e.preventDefault();
            }
            else {
                DisplayedSavings.style.borderColor = correct;
            }
            if (points.value == "") {
                points.style.borderColor = incorrect;
                erText += er13;
                e.preventDefault();
            }
            else {
                points.style.borderColor = correct;
            }
            if (codeFormatValue != "17413") {
                codeFormat.style.borderColor = incorrect;
                erText += er14;
                e.preventDefault();
            }
            else {
                codeFormat.style.borderColor = correct;
            }

        }

        //Sweeps only CHECK
        if (isSweeps) {

            // VALID DATE CHECKER

            console.log(lastDayOfMonth);

            if (lastDayOfMonth === "28") {
                if ((fromDateDay == "1") && (toDateNum == "28")) {
                    toDate.style.borderColor = correct;
                    fromDate.style.borderColor = correct;
                }
                else {
                    toDate.style.borderColor = incorrect;
                    fromDate.style.borderColor = incorrect;
                    erText += er4;
                    e.preventDefault();
                }
            }
            if (lastDayOfMonth === "30") {
                if ((fromDateDay == "1") && (toDateNum == "30")) {
                    toDate.style.borderColor = correct;
                    fromDate.style.borderColor = correct;
                }
                else {
                    toDate.style.borderColor = incorrect;
                    fromDate.style.borderColor = incorrect;
                    erText += er4;
                    e.preventDefault();
                }
            }
            if (lastDayOfMonth === "31") {
                if ((fromDateDay == "1") && (toDateNum == "31")) {
                    toDate.style.borderColor = correct;
                    fromDate.style.borderColor = correct;
                }
                else {
                    toDate.style.borderColor = incorrect;
                    fromDate.style.borderColor = incorrect;
                    erText += er4;
                    e.preventDefault();
                }
            }

            else {
                toDate.style.borderColor = incorrect;
                fromDate.style.borderColor = incorrect;
                erText += er4;
                e.preventDefault();
            }

            //Rewards Type

            if (rewardTypeValue != '16447') {
                rewardType.style.borderColor = incorrect;
                erText += er1;
                e.preventDefault();
            }
            else {
                rewardType.style.borderColor = correct;
            }


        }

        //IW only CHECK
        if (isIW) {

            if (rewardTypeValue != '16445') {
                rewardType.style.borderColor = incorrect;
                erText += er1;
                e.preventDefault();
            }
            else {
                rewardType.style.borderColor = correct;
            }

            /*if ((inventoryValue != '125') || (inventoryValue != '450')) {
                inventory.style.borderColor = incorrect;
                erText += er16;
                e.preventDefault();
            }
            else {
                inventory.style.borderColor = correct;
            }*/



            // USING DATE CHECKER


            console.log(sevenDayCheck, er8, lastDayOfMonth);

            if (lastDayOfMonth === "28") {
                if ((sevenDayCheck == "6") || (sevenDayCheck == "-22")) {
                    toDate.style.borderColor = correct;
                    fromDate.style.borderColor = correct;
                }
                else {
                    toDate.style.borderColor = incorrect;
                    fromDate.style.borderColor = incorrect;
                    erText += er8;
                    e.preventDefault();
                }
            }

            if (lastDayOfMonth === "30") {
                if ((sevenDayCheck == "6") || (sevenDayCheck == "-23")) {
                    toDate.style.borderColor = correct;
                    fromDate.style.borderColor = correct;
                }
                else {
                    toDate.style.borderColor = incorrect;
                    fromDate.style.borderColor = incorrect;
                    erText += er8;
                    e.preventDefault();
                }
            }

            if (lastDayOfMonth === "31") {
                if ((sevenDayCheck == "6") || (sevenDayCheck == "-25")) {
                    toDate.style.borderColor = correct;
                    fromDate.style.borderColor = correct;
                }
                else {
                    toDate.style.borderColor = incorrect;
                    fromDate.style.borderColor = incorrect;
                    erText += er8;
                    e.preventDefault();
                }
            }

            if (GoodsId.value < 2) {
                GoodsId.style.borderColor = incorrect;
                erText += er12;
                e.preventDefault();
            }
            else {
                GoodsId.style.borderColor = correct;
            }
            console.log(inventoryValue);

        }

        if (erText.length == 0) {
            var noErrors = confirm("OUTSTANDING! There appear to be no errors\n\n If you want to continue to use JiraAuto, you must refresh page after clicking OK.")
            }
        else {
            var errorText = ("Please check the following issues if in Verification\n\n" + erText);
            var rewardsTypeUpdate = confirm(errorText);
        }

        // END IW Verification
    }

}

