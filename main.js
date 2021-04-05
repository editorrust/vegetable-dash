/* Copyright Janurary 1st 2021 by Squirrel
~~~~~~~~~~~~~~~~~
TABLE OF CONTENTS
~~~~~~~~~~~~~~~~~
Game Data          | Game information
Vegetables         | Harvest and plant functions, as well as modals
Tasks              | Small chores given by main charecters
Incidents          | Luck run when harvesting or using the Market
Unlock Plots       | Functions that unlock plots
Tour               | Welcome new players, should redo for market
Market             | Sell items for seeds
Main Loop & Setup  | Main loop and setup
Helpful Functions  | Some helpful functions
Commands           | Commands to open panels, right click menu
Settings & Produce | Update Sidebar
Save               | Save the game data, restart

// To do
v0.0.9
~ fix tasks
~ redo tour
~ market prices in veg info
~ show fertilizer

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Game Data | 57 LINES
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

let initalPlotStatus = {
   peas: "empty",
   corn: "empty",
   strawberries: "empty",
   eggplants: "empty",
   pumpkins: "empty",
   cabbages: "empty",
   // Grow Times
   peasGrowing: Infinity,
   peasReady: Infinity,
   cornGrowing: Infinity,
   cornReady: Infinity,
   strawberriesGrowing: Infinity,
   strawberriesFlowering: Infinity,
   strawberriesReady: Infinity,
   eggplantsGrowing: Infinity,
   eggplantsReady: Infinity,
   pumpkinsGrowing: Infinity,
   pumpkinsReady: Infinity,
}
let initalProduce = {
   peas: 0,
   corn: 0,
   strawberries: 0,
   eggplants: 0,
   pumpkins: 0,
   cabbage: 0,
}
let initalPlots = {
   price2: 150,
   price3: 750,
   price4: 3750,
   price5: "your soul (or $$$ - we don't accept credit)",
   price6: 50000,
   price7: 5,
   price8: "undeterimed",
   price9: "undeterimed",
   // Unlocked/locked
   peaplot: "unlocked",
   cornplot: "locked",
   strawberryplot: "locked",
   eggplantplot: "locked",
   pumpkinplot: "locked",
}
let initalMarketData = {
   seeds: 0,
   marketResets: 0,
   fertilizers: 0,
   // Vegetable prices
   buyPeas: 25,
   sellPeas: 25,
   buyCorn: 75,
   sellCorn: 75,
   buyStrawberries: 250,
   sellStrawberries: 250,
   buyEggplants: 750,
   sellEggplants: 750,
   buyPumpkins: 5000,
   sellPumpkins: 5000,
   sellerName: ["Clearly Badd", "Hereto Steale", "Stolin Joye", "Heinous Krime", "Elig L. Felonie"][Math.floor(Math.random() * 5)],
   sellItem: ["Market Resets"][Math.floor(Math.random() * 1)],
   sellItemQuantity: Math.floor(Math.random() * (5 - 1)) + 1,
   seedCost: Math.floor(Math.random() * (10000 - 2000)) + 2000,
}
let initalSettings = {
   theme: "dark",
   intro: "unfinished",
}
let initalTaskList = {
   isInSave: true,
   taskBox1: "unoccupied",
   taskBox2: "unoccupied",
   taskBox3: "unoccupied",
   taskBox4: "unoccupied",
   jebsPeaSalad: "active",
   jebsPeaSaladNum: 0,
   useMarketResets: "unreached",
   useMarketResetsNum: 0,
   tryFertilizer: "unreached",
   tryFertilizerNum: 0,
}

let settings = initalSettings;
let plotStatus = initalPlotStatus;
let produce = initalProduce;
let plots = initalPlots;
let marketData = initalMarketData;
let taskList = initalTaskList;

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Vegetables | 61 LINES
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

// Vegetable Modals
function infoModal(veg) {
   let modalID = "#info" + veg;
   if (document.querySelector(modalID).style.opacity === "1") { hideObj(modalID); }
   else { showObj(modalID); }
}

// Harvest and plant
function harvest(veg) {
   plotStatus[veg.toLowerCase() + "Ready"] = Infinity;
   let plntID = "grow" + veg;
   let hrvstID = "harvest" + veg;
   plotStatus[veg.toLowerCase()] = "empty";
   produce[veg.toLowerCase()]++;
   hideObj(`#${hrvstID}`);
   showObj(`#${plntID}`);
   marketData.seeds++;
   harvestLuck(veg);
}
function plant(veg, timeOne, timeTwo) {
   currentTime = Date.now();
   plotStatus[veg + "Growing"] = currentTime + timeOne;
   plotStatus[veg + "Ready"] = currentTime + timeTwo;
   plotStatus[veg] = "working";
   hideObj("#grow" + capitalize(veg));
}
function fertilize(veg) {
   if (marketData.fertilizers >= 1) {
      marketData.fertilizers -= 1;
      plotStatus[veg + "Ready"] = 0;
      if (veg === "strawberries") { plotStatus[veg + "Ready"] = 0; }
      produce[veg]++;
      checkTasks('fertilize', taskList.tryFertilizerNum, "tryFertilizer");
   }
}
function plantLoop(veg, pltNumber, url) {
   let vegPlot = document.querySelector("#plot" + pltNumber);
   let imgUrl = "url(Images/Vegetables/" + url + ")";
   setInterval(vegStatus, 1000);
   function vegStatus() {
      if (plotStatus[veg] === "working") { hideObj("#harvest" + capitalize(veg)); hideObj("#grow" + capitalize(veg)); }
      if (Date.now() >= plotStatus[veg + "Ready"]) {
         vegPlot.style.backgroundImage = String(imgUrl);
         showObj("#harvest" + capitalize(veg));
         plotStatus[veg + "Growing"] = Infinity;
      }
      else if (Date.now() >= plotStatus[veg + "Growing"]) { vegPlot.style.backgroundImage = "url(Images/Plots/growing.png)"; }
      else { vegPlot.style.backgroundImage = "url(Images/Plots/plot.png)"; }
   }
}

plantLoop("peas", 1, 'Peas/grown-pea.png');
plantLoop("corn", 2, 'Corn/grown-corn.png');
plantLoop("eggplants", 4, 'Eggplant/grown-eggplant.png');
plantLoop("pumpkins", 6, 'Pumpkins/grown-pumpkin.png');

function plantStrawberries() {
   currentTime = Date.now();
   plotStatus.strawberriesGrowing = currentTime + 20000;
   plotStatus.strawberriesFlowering = currentTime + 60000;
   plotStatus.strawberriesReady = currentTime + 120000;
   plotStatus.strawberries = "working";
   hideObj("#growStrawberries");
}
function strawberriesStatus() {
   let plotId = document.getElementById("plot3");
   if (plotStatus.strawberries === "working") { hideObj("#harvestStrawberries"); hideObj("#growStrawberries"); }
   if (Date.now() >= plotStatus.strawberriesReady) {
      plotId.style.backgroundImage = "url(Images/Fruits/Strawberries/grown-strawberries.png)";
      showObj("#harvestStrawberries");
      plotStatus.strawberriesFlowering = Infinity;
   }
   else if (Date.now() >= plotStatus.strawberriesFlowering) { plotId.style.backgroundImage = "url(Images/Fruits/Strawberries/flowering-strawberries.png)"; plotStatus.strawberriesGrowing = Infinity; }
   else if (Date.now() >= plotStatus.strawberriesGrowing) { plotId.style.backgroundImage = "url(Images/Fruits/Strawberries/growing-strawberries.png)"; }
   else { plotId.style.backgroundImage = "url(Images/Plots/plot.png)"; }
}
strawberriesStatus();

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Tasks | 100 LINES
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

hideObj(`.task-info-button-${1}`);
hideObj(`.task-info-button-${2}`);
hideObj(`.task-info-button-${3}`);
hideObj(`.task-info-button-${4}`);

// Task Insensitive
function startTask(num, buttonTxt, buttonOnClick, infoTxt, taskGiver, taskGiverImg, task) {
   taskList[task + "Num"] = num;
   if (num === "Full") { task = "waiting"; return; }
   showObj(`.task-info-button-${num}`);
   document.querySelector(`.task-info-button-${num}`).style.zIndex = "0";
   document.querySelector(`.task-info-button-${num}`).textContent = buttonTxt;
   document.querySelector(`.task-info-button-${num}`).setAttribute( "onClick", `javascript: ${buttonOnClick}` );
   document.querySelector(`.task-info-${num}`).textContent = infoTxt;
   document.querySelector(`.task-info-giver-${num}`).textContent = taskGiver;
   $(`.task-info-img-${num}`).attr("src", taskGiverImg);
   taskList["taskBox" + num] = "occupied " + task;
}
function clearTask(num) {
   hideObj(`.task-info-button-${num}`);
   document.querySelector(`.task-info-button-${num}`).textContent = "";
   document.querySelector(`.task-info-button-${num}`).setAttribute( "onClick", "javascript: " );
   document.querySelector(`.task-info-${num}`).textContent = "";
   document.querySelector(`.task-info-giver-${num}`).textContent = "";
   $(`.task-info-img-${num}`).attr("src", "Images/Global Assets/nothing.png");
   taskList["taskBox" + num] = "unoccupied";
}
function emptyTaskCheck(task) {
   if (taskList.taskBox1 === "unoccupied") { taskList[task] = 1; }
   else if (taskList.taskBox2 === "unoccupied") { taskList[task] = 2; }
   else if (taskList.taskBox3 === "unoccupied") { taskList[task] = 3; }
   else if (taskList.taskBox4 === "unoccupied") { taskList[task] = 4; }
   else { taskList[task] = "Full"; }
   return taskList[task];
}
function oldTaskCheck(task) {
   if (taskList.taskBox1 === `occupied ${task}`) { return 1; }
   else if (taskList.taskBox2 === `occupied ${task}`) { return 2; }
   else if (taskList.taskBox3 === `occupied ${task}`) { return 3; }
   else if (taskList.taskBox4 === `occupied ${task}`) { return 4; }
   else { return false; }
}
function taskAlreadyUp(task) {
   let value = {};
   for (i = 1; i < 5; i++) {
      if (taskList["taskBox" + i] === task) { value[i] = true; }
      else { value[i] = false; }
   }
   if (value[1] === false && value[2] === false && value[3] === false && value[4] === false) { return false }
   else { return true }
}

// Task Sensitive
function giveTasks() {
   if (taskList.jebsPeaSalad != "complete" || taskList.jebsPeaSalad != "ready") { taskList.jebsPeaSalad = "active" }
   if (taskList.jebsPeaSalad === "complete" && marketData.marketResets >= 1 && taskList.useMarketResets != "complete") { taskList.useMarketResets = "active" }
   if (taskList.jebsPeaSalad === "complete" && taskList.tryFertilizer != "complete") { taskList.tryFertilizer = "active" }
}
function showTasks() {
   if (taskAlreadyUp("occupied jebsPeaSalad") === false && taskList.jebsPeaSalad === "active" || taskList.jebsPeaSalad === "waiting") { startTask(emptyTaskCheck("jebsPeaSaladNum"), "Submit 25 Peas", "if (produce.peas >= 25) { produce.peas -= 25; checkTasks('producePaid', taskList.jebsPeaSaladNum, 'jebsPeaSalad'); }", "I plan on making a nice, big salad, and I'll need some fresh produce for it. Could you do me a favor and get some peas for me?", "Farmer Jebediah", "Images/Tasks/farmer.png", "jebsPeaSalad"); }
   if (taskAlreadyUp("occupied useMarketResets") === false && taskList.useMarketResets === "active" || taskList.useMarketResets === "waiting") { startTask(emptyTaskCheck("useMarketResetsNum"), "Use 1 Market Reset", " ", "Have I told you about market resets yet? They can reset all of the prices in the market! Why don't you use one now?", "Grandma Josephine", "Images/Tasks/granny.png", "useMarketResets"); }
   if (taskAlreadyUp("occupied tryFertilizer") === false && taskList.tryFertilizer === "active" || taskList.tryFertilizer === "waiting") { startTask(emptyTaskCheck("tryFertilizerNum"), "Use 1 Fertilizer", " ", "Your plants look like they could do with some help. Why don't you use some fertilizer? It'll double the crop yeild and finish the growing instantly!", "Grandpa Jenkins", "Images/Tasks/jenkins.png", "tryFertilizer"); }
   // Old open tasks
   if (oldTaskCheck("jebsPeaSalad") != false) {
      startTask(`${oldTaskCheck("jebsPeaSalad")}`, "Submit 25 Peas", "if (produce.peas >= 25) { produce.peas -= 25; checkTasks('producePaid', taskList.jebsPeaSaladNum, 'jebsPeaSalad'); }", "I plan on making a nice, big salad, and I'll need some fresh produce for it. Could you do me a favor and get some peas for me?", "Farmer Jebediah", "Images/Tasks/farmer.png", "jebsPeaSalad");
   }
   if (oldTaskCheck("useMarketResets") != false) {
      startTask(`${oldTaskCheck("useMarketResets")}`, "Use 1 Market Reset", " ", "Have I told you about market resets yet? They can reset all of the prices in the market! Why don't you use one now?", "Grandma Josephine", "Images/Tasks/granny.png", "useMarketResets");
   }
   if (oldTaskCheck("tryFertilizer") != false) {
      startTask(`${oldTaskCheck("tryFertilizer")}`, "Use 1 Fertilizer", " ", "Your plants look like they could do with some help. Why don't you use some fertilizer? It'll double the crop yeild and finish the growing instantly!", "Grandpa Jenkins", "Images/Tasks/jenkins.png", "tryFertilizer");
   }

}
function checkTasks(origin, num, task) {
   if (taskList.jebsPeaSalad === "active" && origin === "producePaid") {
      document.querySelector(`.task-info-button-${num}`).textContent = "Collect 5 Fertilizer";
      document.querySelector(`.task-info-button-${num}`).setAttribute( "onClick", "javascript: collectTaskReward('jebsPeaSalad', taskList.jebsPeaSaladNum)" );
      document.querySelector(`.task-info-${num}`).textContent = "That salad sure was delicious! To pay back the favor, I'll give you some fertilizer! Use it wisely!";
   }
   if (taskList.useMarketResets === "active" && origin === "resetMarketValues") {
      document.querySelector(`.task-info-button-${num}`).textContent = "Collect 500 Seeds";
      document.querySelector(`.task-info-button-${num}`).setAttribute( "onClick", "javascript: collectTaskReward('useMarketResets', taskList.useMarketResetsNum)" );
      document.querySelector(`.task-info-${num}`).textContent = "Thank you for completing that small task for me! Here, take 500 seeds!";
   }
   if (taskList.tryFertilizer === "active" && origin === "fertilize") {
      document.querySelector(`.task-info-button-${num}`).textContent = "Collect 2 Market Resets";
      document.querySelector(`.task-info-button-${num}`).setAttribute( "onClick", "javascript: collectTaskReward('tryFertilizer', taskList.tryFertilizerNum)" );
      document.querySelector(`.task-info-${num}`).textContent = "Wow, just look at those plants grow! Here, take these, I've had them lying about for years.";
   }
}
function collectTaskReward(task, num) {
   if (task === "jebsPeaSalad") { marketData.fertilizers += 5; }
   if (task === "useMarketResets") { marketData.seeds += 500; }
   if (task === "tryFertilizer") { marketData.marketResets += 2; }
   taskList[task] = "complete";
   clearTask(num);
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Incidents | 0 LINES
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

let rand = Math.random();
function harvestLuck(veg) {
   rand = Math.random();
   if (rand < 0.20) {
      fadeTextAppear(event, `You collected 5 \n extra seeds!`, "vegLuck");
      marketData.seeds += 5;
   }
   if (rand < 0.10) {
      fadeTextAppear(event, `It rained! You collected \n 2 extra ${veg}!`, "vegLuck");
      produce[veg.toLowerCase()] += 2;
   }
   if (rand < 0.05) {
      fadeTextAppear(event, `You collected a market \n reset! You now have ${marketData.marketResets}`, "vegLuck");
      marketData.marketResets++;
   }
}
function marketLuck() {
   rand = Math.random();
   if (rand < 0.01) {
      marketData.marketResets++;
      callAlert(`You collected a market reset! You now have ${marketData.marketResets}`);
   }
}
function blackMarketLuck() {
   rand = Math.random();
   if (rand < 0.02) {
      callAlert("The police caught you! They fined you 6000 Seeds");
      marketData.seeds -= 6000;
   }
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

let vegetablesOwned = [];
vegetablesOwned.push("peas")
function vegetablesOwnedLoop() {
   if (produce.peas >= "3" && !vegetablesOwned.includes("peas")) { vegetablesOwned.push("peas") }
   if (produce.corn >= "3" && !vegetablesOwned.includes("corn")) { vegetablesOwned.push("corn") }
   if (produce.strawberries >= "3" && !vegetablesOwned.includes("strawberries")) { vegetablesOwned.push("strawberries") }
   if (produce.eggplants >= "3" && !vegetablesOwned.includes("eggplants")) { vegetablesOwned.push("eggplants") }
   if (produce.pumpkins >= "3" && !vegetablesOwned.includes("pumpkins")) { vegetablesOwned.push("pumpkins") }
}

let luckyRoll = window.setInterval(function() {
   rand = Math.random();
   let vegLost = vegetablesOwned[Math.floor(Math.random() * vegetablesOwned.length)];
   let amountLost = Math.floor(produce[vegLost] / 3);
   if (rand < .08) {
      produce[vegLost] -= amountLost;
      callAlert(`It snowed! You lost ${amountLost} of your ${vegLost}!`);
    }
}, 300000)

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Unlock Plots | 52 LINES
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

function checkLocks() {
   if (plots.cornplot === "unlocked") { openLock("corn", 2) }
   if (plots.strawberryplot === "unlocked") { openLock("strawberry", 3) }
   if (plots.eggplantplot === "unlocked") { openLock("eggplant", 4) }
   if (plots.pumpkinplot === "unlocked") { openLock("pumpkin", 6) }
}
function unlockPlot(plotNum) {
   let number = plotNum;
   if (marketData.seeds >= plots["price" + plotNum]) {
      marketData.seeds -= plots["price" + plotNum];
      marketData.marketResets++;
      if (number == "2") { setTimeout(() => openLock("corn", 2), 2500); document.getElementById("lock2").classList.add("removing-lock"); }
      if (number == "3") { setTimeout(() => openLock("strawberry", 3), 2500); document.getElementById("lock3").classList.add("removing-lock"); }
      if (number == "4") { setTimeout(() => openLock("eggplant", 4), 2500); document.getElementById("lock4").classList.add("removing-lock"); }
      if (number == "6") { setTimeout(() => openLock("pumpkin", 6), 2500); document.getElementById("lock6").classList.add("removing-lock"); }
   }
   else { fadeTextAppear(event, `Not enough seeds`, false); }
}
function openLock(vegetable, num) {
   if (vegetable === "corn") {
      document.getElementById("lockedDiv2").remove();
      document.getElementById("openPlot2").style.display = "block";
      document.getElementById("lock3Text").innerHTML = `This plot is locked <br> Pay 750 Seeds to unlock <br> <button class="purchase-plot" onclick="unlockPlot(3)">Purchase Plot</button>`;
      plots.cornplot = "unlocked";
   }
   if (vegetable === "strawberry") {
      document.getElementById("lockedDiv3").remove();
      document.getElementById("openPlot3").style.display = "block";
      document.getElementById("lock4Text").innerHTML = `This plot is locked <br> Pay 3750 Seeds to unlock <br> <button class="purchase-plot" onclick="unlockPlot(4)">Purchase Plot</button>`;
      plots.strawberryplot = "unlocked";
   }
   if (vegetable === "eggplant") {
      document.getElementById("lockedDiv4").remove();
      document.getElementById("openPlot4").style.display = "block";
      document.getElementById("lock6Text").innerHTML = `This plot is locked <br> Pay ${plots.price6} Seeds to unlock <br> <button class="purchase-plot" onclick="unlockPlot(6)">Purchase Plot</button>`;
      plots.eggplantplot = "unlocked";
   }
   if (vegetable === "pumpkin") {
      document.getElementById("lockedDiv6").remove();
      document.getElementById("openPlot6").style.display = "block";
      document.getElementById("lock7Text").innerHTML = `This plot is locked <br> Pay your soul to unlock <br> <button class="purchase-plot" onclick="callAlert('Error: Not signed into SoulPay+')">Requires SoulPay+</button>`;
      plots.pumpkinplot = "unlocked";
   }
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Tour | 98 LINES
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

let introPartsDone = {
   hello: "no",
   meetGramps: "no",
   planting: "no",
   produceBar: "no",
   meetGran: "no",
   // Need fixing from here
   bushels: "no",
   settings: "no",
   thatsIt: "no",
}
function runIntro() {
   plotStatus = initalPlotStatus;
   produce = initalProduce;
   plots = initalPlots;
   marketData = initalMarketData;
   settings = initalSettings;
   // Save
   localStorage.setItem("plotStatus", JSON.stringify(plotStatus));
   localStorage.setItem("produce", JSON.stringify(produce));
   localStorage.setItem("plots", JSON.stringify(plots));
   localStorage.setItem("marketData", JSON.stringify(marketData));
   localStorage.setItem("settingData", JSON.stringify(settings));

   settings.intro = "finished";
   showObj(".welcome");
}
function goIntro() { hideObj(".welcome"); showObj(".introDarkShadow"); intro(); }
function intro() {
   let introShadow = document.querySelector(".introDarkShadow");
   let qstRibbon = document.getElementById("questRibbon");
   let introBlock = document.querySelector(".intro-container");
   let introImg = document.querySelector(".intro-img");
   let introText = document.querySelector(".intro-text");
   if (introPartsDone.hello === "no") { introPartsDone.hello = "yes"; }
   else { meetGrapms(); }
   function meetGrapms() {
      if (introPartsDone.meetGramps === "no") {
         $(".intro-img").attr("src", "Images/Intro/gramps.png");
         introText.textContent = "Hi! I'm gramps. That's Grandpa Jenkins to you. I'm here ta teach you farmin', the good ol' way!";
         introPartsDone.meetGramps = "yes";
      }
      else { planting(); }
   }
   function planting() {
      if (introPartsDone.planting === "no") {
         introText.textContent = "Farmin' is as easy as anything nowadays, with all this modern technology. Just press Grow Peas, and when it's done, press Harvest Peas!";
         document.querySelector(".plant-quest-arrow").style.display = "block";
         document.getElementById("plot1").style.zIndex = "100";
         introPartsDone.planting = "yes";
      }
      else {
         document.querySelector(".plant-quest-arrow").style.display = "none";
         document.getElementById("plot1").style.zIndex = "0";
         sidebar();
      }
   }
   function sidebar() {
      if (introPartsDone.produceBar === "no") {
         $(".intro-img").attr("src", "Images/Intro/farmer.png");
         introText.textContent = "This bar shows the amount of seeds and produce you have, so you can keep track of how your farm is going.";
         document.querySelector(".produce").style.zIndex = "1";
         introBlock.style.width = "90%";
         introPartsDone.produceBar = "yes";
      }
      else { meetGran(); }
   }
   function meetGran() {
      if (introPartsDone.meetGran === "no") {
         $(".intro-img").attr("src", "Images/Intro/granny.png");
         introText.textContent = "Nice to meet you. I'm Grandma Josephine, and I'm here to teach you economics.";
         document.querySelector(".produce").style.zIndex = "0";
         introBlock.style.width = "100%";
         introPartsDone.meetGran = "yes";
      }
      else { bushels(); }
   }
   // Need fixing from here
   function bushels() {
      if (introPartsDone.bushels === "no") {
         introText.textContent = "Here you find the amount of resouces you have. Spend it well!";
         introPartsDone.bushels = "yes";
      }
      else { settings(); }
   }
   function settings() {
      if (introPartsDone.settings === "no") {
         introText.textContent = "These are the settings, where you can restart, change the theme, and play classical music!";
         document.querySelector(".settings").style.boxShadow = "0 0 50px #f5f5f5";
         introPartsDone.settings = "yes";
      }
      else {
         document.querySelector(".settings").style.boxShadow = "none";
         document.querySelector(".sidebar").style.zIndex = "0";
         introBlock.style.height = "30vh";
         introBlock.style.width = "auto";
         thatsIt();
      }
   }
   function thatsIt() {
      if (introPartsDone.thatsIt === "no") {
         $(".intro-img").attr("src", "Images/Intro/farmer.png");
         introText.textContent = "That's it! Now you can start working.";
         introPartsDone.thatsIt = "yes";
      }
      else { location.reload(); }
   }
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Market | 62 LINES
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

document.addEventListener("keyup", function(event) { if (event.shiftKey && event.keyCode === 77) {
   if (document.querySelector(".marketShadow").style.opacity === "0") { showObj(".marketShadow"); }
   else { hideObj(".marketShadow"); }
}})
function checkMarket() {
   let marketItem = document.getElementsByClassName("market-item");
   marketItem[0].style.display = "block";
   marketItem[6].style.display = "block";
   marketItem[7].style.display = "block";
   if (plots.peaplot != "locked") { marketItem[1].style.display = "block"; }
   if (plots.cornplot != "locked") { marketItem[2].style.display = "block"; }
   if (plots.strawberryplot != "locked") { marketItem[3].style.display = "block"; }
   if (plots.eggplantplot != "locked") { marketItem[4].style.display = "block"; }
   if (plots.pumpkinplot != "locked") { marketItem[5].style.display = "block"; }
}
function buyProduce(produceRequested, produceCase) {
   if (marketData.seeds >= marketData["buy" + produceCase]) {
      produce[produceRequested] += 5;
      marketData.seeds -= marketData["buy" + produceCase];
      marketData["buy" + produceCase] *= 1.08;
      marketData["sell" + produceCase] *= 1.02;
      updateMarket();
      checkMarket();
      marketLuck();
   }
   else { fadeTextAppear(event, `Not enough seeds`, false); }
}
function sellProduce(produceRequested, produceCase) {
   if (produce[produceRequested] >= 5) {
      produce[produceRequested] -= 5;
      marketData.seeds += marketData["sell" + produceCase];
      marketData["buy" + produceCase] *= 0.98;
      marketData["sell" + produceCase] *= 0.92;
      updateMarket();
      checkMarket();
      marketLuck();
   }
   else { fadeTextAppear(event, `Not enough seeds`, false); }
}

function updateMarket() {
   document.querySelector(".special-market-item").textContent = `Seeds: ${Math.floor(marketData.seeds)}`;
   document.querySelector(".pea-market-item").textContent = `Peas: ${produce.peas}
   Buy for ${Math.floor(marketData.buyPeas)} Seeds
   Sell for ${Math.floor(marketData.sellPeas)} Seeds \r\n \r\n`;
   document.querySelector(".corn-market-item").textContent = `Corn: ${produce.corn}
   Buy for ${Math.floor(marketData.buyCorn)} Seeds
   Sell for ${Math.floor(marketData.sellCorn)} Seeds \r\n \r\n`;
   document.querySelector(".strawberry-market-item").textContent = `Strawberries: ${produce.strawberries}
   Buy for ${Math.floor(marketData.buyStrawberries)}
   Sell for ${Math.floor(marketData.sellStrawberries)} \r\n \r\n`;
   document.querySelector(".eggplant-market-item").textContent = `Eggplants: ${produce.eggplants}
   Buy for ${Math.floor(marketData.buyEggplants)}
   Sell for ${Math.floor(marketData.sellEggplants)} \r\n \r\n`;
   document.querySelector(".pumpkin-market-item").textContent = `Pumpkins: ${produce.pumpkins}
   Buy for ${Math.floor(marketData.buyPumpkins)}
   Sell for ${Math.floor(marketData.sellPumpkins)} \r\n \r\n`;
   document.querySelector(".reset-market-item").textContent = `You have ${marketData.marketResets} Market Resets`;
}
function resetMarketValues() {
   if (marketData.marketResets > 0) {
      marketData.marketResets--
      marketData.buyPeas = 25;
      marketData.sellPeas = 25;
      marketData.buyCorn = 75;
      marketData.sellCorn = 75;
      marketData.buyStrawberries = 250;
      marketData.sellStrawberries = 250;
      marketData.buyEggplants = 750;
      marketData.sellEggplants = 750;
      marketData.buyPumpkins = 5000;
      marketData.sellPumpkins = 5000;
      checkTasks("resetMarketValues", taskList.useMarketResetsNum, "useMarketResets");
   }
}

// newBlackOffer();
// function blackMarketValues() {
//    marketData.sellerName = ["Clearly Badd", "Hereto Steale", "Heinous Krime", "Elig L. Felonie", "Sheeft E. Karacter", "Abad Deel"][Math.floor(Math.random() * 6)];
//    marketData.sellItem = ["Market Resets"][Math.floor(Math.random() * 1)];
//    // sellItem = ["Watering Cans", "Compost", "Fertilizer"] compost = extra, watering can = instant
//    marketData.sellItemQuantity = Math.floor(Math.random() * (5 - 1)) + 1;
//    marketData.seedCost = Math.floor(Math.random() * (10000 - 2000)) + 2000;
// }
// function newBlackOffer() { document.querySelector(".blackMarketOffer").textContent = `Offer by ${marketData.sellerName} \n Selling ${marketData.sellItemQuantity} ${marketData.sellItem} \n for ${marketData.seedCost} Seeds`; }
// function accept() {
//    if (marketData.seeds >= marketData.seedCost) {
//       marketData.seeds -= marketData.seedCost;
//       blackMarketLuck();
//       blackMarketValues();
//       newBlackOffer();
//       if (marketData.sellItem === "Market Resets") { marketData.marketResets += marketData.sellItemQuantity; }
//    }
//    else { fadeTextAppear(event, `Not enough seeds`, false); }
// }
// function deny() {
//    blackMarketLuck();
//    blackMarketValues();
//    newBlackOffer();
//    document.querySelector(".blackMarketOffer").style.backgroundColor = genColor();
// }
updateModalMarketPrices();
function updateModalMarketPrices() {
   for (i = 0; i < 6; i++)
   document.querySelector(".special-market-item").textContent = `Seeds: ${Math.floor(marketData.seeds)}`;
   document.querySelector(".pea-market-item").textContent = `Peas: ${produce.peas}
   Buy for ${Math.floor(marketData.buyPeas)} Seeds
   Sell for ${Math.floor(marketData.sellPeas)} Seeds \r\n \r\n`;
   document.querySelector(".corn-market-item").textContent = `Corn: ${produce.corn}
   Buy for ${Math.floor(marketData.buyCorn)} Seeds
   Sell for ${Math.floor(marketData.sellCorn)} Seeds \r\n \r\n`;
   document.querySelector(".strawberry-market-item").textContent = `Strawberries: ${produce.strawberries}
   Buy for ${Math.floor(marketData.buyStrawberries)}
   Sell for ${Math.floor(marketData.sellStrawberries)} \r\n \r\n`;
   document.querySelector(".eggplant-market-item").textContent = `Eggplants: ${produce.eggplants}
   Buy for ${Math.floor(marketData.buyEggplants)}
   Sell for ${Math.floor(marketData.sellEggplants)} \r\n \r\n`;
   document.querySelector(".pumpkin-market-item").textContent = `Pumpkins: ${produce.pumpkins}
   Buy for ${Math.floor(marketData.buyPumpkins)}
   Sell for ${Math.floor(marketData.sellPumpkins)} \r\n \r\n`;
   document.querySelector(".reset-market-item").textContent = `You have ${marketData.marketResets} Market Resets`;
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Main Loop & Setup | 27 LINES
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

var mainLoop = window.setInterval(function() {
   strawberriesStatus();
   updateMarket();
   vegetablesOwnedLoop();
   giveTasks();
   showTasks();
   checkMarket();
   // Update produce display
   document.querySelector("#seeds").textContent = `${Math.round(marketData.seeds)} Seeds`;
   document.querySelector("#fertilizer").textContent = `${Math.round(marketData.fertilizers)} Fertilizers`;
   if (plots.peaplot === "unlocked") { revealProduce("#peaBushels", "peas"); }
   if (plots.cornplot === "unlocked") { revealProduce("#cornBushels", "corn"); }
   if (plots.strawberryplot === "unlocked") { revealProduce("#strawberryBushels", "strawberries"); }
   if (plots.eggplantplot === "unlocked") { revealProduce("#eggplantBushels", "eggplants"); }
   if (plots.pumpkinplot === "unlocked") { revealProduce("#pumpkinBushels", "pumpkins"); }
   function revealProduce(id, veg) {
      document.querySelector(".produce-tooltip-" + veg).style.display = "inline-block";
      document.querySelector(id).textContent = `${produce[veg]} Bushels of ${capitalize(veg)}`;
   }
}, 200)
function setup() {
   if (!taskList) { taskList = initalTaskList; }
   whatTheme();
   checkLocks();
   checkMarket();
}
window.addEventListener('load', (event) => { setup(); });

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Helpful Functions | 22 LINES
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

function capitalize(string) { return string.charAt(0).toUpperCase() + string.slice(1); }
function hideObj(objId) {
   document.querySelector(objId).style.opacity = "0";
   document.querySelector(objId).style.pointerEvents = "none";
   document.querySelector(objId).style.zIndex = "0";
}
function showObj(objId) {
   document.querySelector(objId).style.opacity = "1";
   document.querySelector(objId).style.pointerEvents = "auto";
   document.querySelector(objId).style.zIndex = "1";
}
function genColor() {
   function rand(min, max) { let randomNum = Math.random() * (max - min) + min; return Math.round(randomNum); }
   let hex = ['a', 'b', 'c', 'd', 'e', 'f', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
   let color = '#';
   for (let i = 0; i < 6; i++) { let index = rand(0, 15); color += hex[index]; }
   return color;
}
function callAlert(text) {
   // Isn't it just great copying the code from other projects?
   let alert = document.querySelector(".alert");
   alert.style.opacity = "1";
   alert.style.pointerEvents = "auto";
   alert.textContent = text;
   setTimeout(alertAnimation => { document.querySelector('.alert').classList.add('alertAnimation'); }, 6000);
   setTimeout(removeAnimation => { document.querySelector('.alert').classList.remove('alertAnimation'); }, 9000);
   setTimeout(hideAlerts => { alert.style.opacity = "0"; alert.style.pointerEvents = "none"; }, 9000);
}
function scrollToSection(id) { document.getElementById(id).scrollIntoView(); }

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Commands | 73 LINES
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

// Command Panel
document.addEventListener("keyup", function(event) { if (event.shiftKey && event.keyCode === 69) { openCommands(); } });
document.addEventListener("keyup", function(event) { if (event.shiftKey && event.keyCode === 81) { questbar(); } });
document.addEventListener("keyup", function(event) { if (event.shiftKey && event.keyCode === 87) {
   if (document.querySelector(".settingShadow").style.opacity === "0") { showObj(".settingShadow"); }
   else { hideObj(".settingShadow"); }
} });

questbarIsOpen = false;
function questbar() {
   if (questbarIsOpen === true) {
      document.querySelector(".quests").style.left = "0";
      document.querySelector(".questShadow").style.display = "block";
      questbarIsOpen = false;
   }
   else {
      document.querySelector(".quests").style.left = "-80vh";
      document.querySelector(".questShadow").style.display = "none";
      questbarIsOpen = true;
   }
}
function openCommands() {
   if (document.querySelector(".commandsShadow").style.opacity === "0") { showObj(".commandsShadow"); }
   else { hideObj(".commandsShadow"); }
}
function commandBar() {
   if (document.querySelectorAll(".commandBarImg")[0].style.display === "inline-block") {
      document.querySelectorAll(".commandBarImg")[0].style.display = "none";
      document.querySelectorAll(".commandBarImg")[1].style.display = "none";
      document.querySelectorAll(".commandBarImg")[2].style.display = "none";
      document.querySelector(".slider").style.backgroundColor = "#cb9e00";
      document.querySelector(".slider").style.transform = "rotate(0)";
   }
   else {
      document.querySelectorAll(".commandBarImg")[0].style.display = "inline-block";
      document.querySelectorAll(".commandBarImg")[1].style.display = "inline-block";
      document.querySelectorAll(".commandBarImg")[2].style.display = "inline-block";
      document.querySelector(".slider").style.backgroundColor = "#ffca18";
      document.querySelector(".slider").style.transform = "rotate(180deg)";
   }
}

// Right Click Menu
let rightClickMenu = document.querySelector("#menu").style;
if (document.addEventListener) {
   document.addEventListener('contextmenu', function(e) {
      let posX = e.clientX;
      let posY = e.clientY;
      menu(posX, posY);
      e.preventDefault();
   }, false);
   document.addEventListener('click', function(e) {
      rightClickMenu.display = "none";
   }, false);
}
else {
   document.attachEvent('oncontextmenu', function(e) {
      var posX = e.clientX;
      var posY = e.clientY;
      menu(posX, posY);
      e.preventDefault();
   });
   document.attachEvent('onclick', function(e) {
      setTimeout(function() {
         rightClickMenu.display = "none";
      }, 501);
   });
}
function menu(x, y) {
   rightClickMenu.top = y + "px";
   rightClickMenu.left = x + "px";
   rightClickMenu.display = "block";
}

function fadeTextAppear(e, txt, extraClass) {
   let fadeText = document.querySelector(".fade-text").cloneNode();
   fadeText.id = "fadeTextNew";
   fadeText.textContent = txt;
   document.querySelector("body").appendChild(fadeText);
   if (extraClass != false) { fadeText.classList.add(extraClass); }
   fadeText.style.left = `${(window.Event) ? e.pageX : event.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft)}px`;
   fadeText.style.top = `${(window.Event) ? e.pageY : event.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop)}px`;
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Settings & Produce | 23 LINES=
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

// Music
let myAudio = document.querySelector(".mozart");
function togglePlay() { return myAudio.paused ? myAudio.play() : myAudio.pause(); }

// Theme
function whatTheme() {
   if (settings.theme === "dark") { darkTheme(); }
   if (settings.theme === "light") { light(); }
   if (settings.theme === "random") { randTheme(); }
   else { darkTheme(); }
}
function darkTheme() {
   document.querySelector('.produce').style.backgroundColor = '#111';
   settings.theme = "dark";
}
function randTheme() {
   document.querySelector('.produce').style.backgroundColor = genColor();
   settings.theme = "random";
}
function light() {
   document.querySelector('.produce').style.backgroundColor = '#f5f5f5';
   settings.theme = "light";
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Save | 62 LINES
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

var saveLoop = window.setInterval(function() {
   localStorage.setItem("plotStatus", JSON.stringify(plotStatus, replacer));
   localStorage.setItem("produce", JSON.stringify(produce, replacer));
   localStorage.setItem("plots", JSON.stringify(plots, replacer));
   localStorage.setItem("marketData", JSON.stringify(marketData, replacer));
   localStorage.setItem("settingData", JSON.stringify(settings, replacer));
   localStorage.setItem("taskList", JSON.stringify(taskList, replacer));
}, 1000)

plotStatus = JSON.parse(localStorage.getItem("plotStatus"));
produce = JSON.parse(localStorage.getItem("produce"));
plots = JSON.parse(localStorage.getItem("plots"));
marketData = JSON.parse(localStorage.getItem("marketData"));
settings = JSON.parse(localStorage.getItem("settingData"));
taskList = JSON.parse(localStorage.getItem("taskList"));

if (settings) { } else { runIntro() }
if (settings.intro != "finished") { runIntro() }

function restart() {
   let areYouSure = confirm("Are you SURE you want to restart? This will wipe all your progress!");
   if (areYouSure === true) {
      let areYouReallySure = confirm("Are you REALLY SURE you want to restart? There is no going back!");
      if (areYouReallySure === true) {
         // Save
         localStorage.setItem("plotStatus", JSON.stringify(initalPlotStatus, replacer));
         localStorage.setItem("produce", JSON.stringify(initalProduce, replacer));
         localStorage.setItem("plots", JSON.stringify(initalPlots, replacer));
         localStorage.setItem("marketData", JSON.stringify(initalMarketData, replacer));
         localStorage.setItem("settingData", JSON.stringify(initalSettings, replacer));
         localStorage.setItem("taskList", JSON.stringify(initalTaskList, replacer));
         plotStatus = JSON.parse(localStorage.getItem("plotStatus"));
         produce = JSON.parse(localStorage.getItem("produce"));
         plots = JSON.parse(localStorage.getItem("plots"));
         marketData = JSON.parse(localStorage.getItem("marketData"));
         settings = JSON.parse(localStorage.getItem("settingData"));
         taskList = JSON.parse(localStorage.getItem("taskList"));
         // Reload
         location.reload();
      }
   }
}

// For keeping Infinity the same after saving
const replacer = (key, value) => {
   if (value instanceof Function) { return value.toString(); }
   else if (value === NaN) { return 'NaN'; }
   else if (value === Infinity) { return 'Infinity'; }
   else if (typeof value === 'undefined') { return 'undefined'; }
   else { return value; }
}


// For export
// let save = [];
// save.push(plotStatus);
// save.push(produce);
// save.push(plots);
// save.push(marketData);
// save.push(settings);
