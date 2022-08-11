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


/* I tried many different ways to make the automation/verification happen on the first page, but have come to the conclusion it works better in EDIT mode
because some of the fields are not editable unless you are in there - This is an alert suggesting they make changes in there. there are other fields that still need to be added*/
var editButton = document.getElementById('edit-issue');
var primaryWarning = document.getElementById('rowForcustomfield_16102');
var nameWarning = document.getElementById('rowForcustomfield_16503');
var Name = document.getElementById('customfield_16503');

primaryWarning.addEventListener("click", alertTest);
nameWarning.addEventListener("click", alertTest);
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

    Name.onchange = totalUpdate;
    SKU.onchange = totalUpdate;

    function totalUpdate(e) {
        var Name = document.getElementById('customfield_16503');
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
        const ShortName = Name.value.replace(/[$]/gi, '')
        .replace(/[’]/g, "'")
        .replace(/[0-9]/g, '')
        .replace(/ Instant Win Play/gi, ' Instant Win')
        .replace(/Daily Deal/gi, '')
        .replace(/Extra Credit/gi, '')
        .replace(/\s+$/, '')
        .substring(1);
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

        if (GameUUID.value > "5") {
            GameUUID.value = 'TBD';
        }
    }




    //when UUID added or Rewards deploy path changed, Prizepool name updated - OAMOE URL updated - If one is missing it will indicate this in the OAMOE URL.

    let GameUUID = document.getElementById('customfield_16500');
    let RewardsDeploy = document.getElementById('customfield_17001');

    GameUUID.onchange = OamoeURLPrizePoolChange;
    RewardsDeploy.onchange = OamoeURLPrizePoolChange;

    function OamoeURLPrizePoolChange(e) {
        console.log('OAMOE');
        var TransactionName = document.getElementById('customfield_16503');
        const ShortName = TransactionName.value.replace(/[$]/gi, '')
        .replace(/[0-9]/g, '')
        .replace(/ Instant Win Play/gi, '')
        .replace(/ Instant Win/gi, '')
        .replace(/Daily Deal/gi, '')
        .replace(/Extra Credit/gi, '')
        .replace(/Sweepstakes/gi, '')
        .replace(/[-]|[’]|[.]|[“]|[”]|[®]|[™]/gi, '')
        .replace(/[é]/gi, 'e')
        .substring(1);
        const SKU = document.getElementById('customfield_16000');
        const SKUValue = SKU.value;
        const GameUUID = document.getElementById('customfield_16500');
        const OamoeURL = document.getElementById('customfield_16517');
        const RewardsDeploy = document.getElementById('customfield_17001');
        const PrizePoolName = document.getElementById('customfield_16800');
        const StartDate = document.getElementById('customfield_17202');
        const StartDateMonth = StartDate.value.replace(/[^a-zA-Z]/g, "");
        let StartDateYear = StartDate.value.match(/\d+$/);

        var NewDeploy = RewardsDeploy.value.replace(/aarp\//gi, '');
        var theUUID = GameUUID.value;

        if (RewardsDeploy.value.length > 0) {
            NewDeploy;
        }
        else {
            NewDeploy = 'Needs REWARDS DEPLOY PATH';
        }
        if (OamoeURL.value.length > 0) {
            theUUID;
        }
        else {
            theUUID = 'Needs GAME UUID';
        }

        const isSweeps = SKUValue.substring(0, 1);
        const isIW = SKUValue.substring(0, 1);

        if (isIW != '3') {
            OamoeURL.value = 'https://sweeps.aarp.org/' + NewDeploy + '/oamoe_entry?game=' + theUUID;
        }

        PrizePoolName.value = (SKU.value + " " + ShortName + StartDateMonth + " " + "20" + StartDateYear);
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
}
