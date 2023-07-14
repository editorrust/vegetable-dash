//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Market
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function initMarketStalls() {
   let marketItem = document.getElementsByClassName("market-item");
   marketItem[10].style.display = "block";
   marketItem[0].style.display = "inline-block";
   if (seedOwned("corn")) { marketItem[1].style.display = "inline-block"; marketItem[8].style.display = "block"; }
   if (seedOwned("strawberries")) { marketItem[2].style.display = "inline-block"; marketItem[9].style.display = "block"; }
   if (seedOwned("eggplants")) { marketItem[3].style.display = "inline-block"; }
   if (seedOwned("pumpkins")) { marketItem[4].style.display = "inline-block"; }
   if (seedOwned("cabbage")) { marketItem[5].style.display = "inline-block"; }
   if (seedOwned("dandelion")) { marketItem[6].style.display = "inline-block"; }
   if (seedOwned("rhubarb")) { marketItem[7].style.display = "inline-block"; }
}

function resetMarketValues() {
   if (gameData.marketResets > 0) {
      gameData.marketResets--;
      updateMarketResets();
      gameData.vegCost = initGameData.vegCost;
      updateMarketSalePrices();
      checkTasks("useMarketResets");
   }
}

// Buy & Sell Vegetables
function buyProduce(produce) {
   if (event.ctrlKey && gameData.coins >= calcInflation(10)) {
      for (i = 0; i < 10; i++) { buy(); } marketLuck();
   }
   else if (event.shiftKey && gameData.coins >= calcInflation(5)) {
      for (i = 0; i < 5; i++) { buy(); } marketLuck();
   }
   else if (gameData.coins >= gameData["vegCost"][produce]["buy"]) { buy(); marketLuck(); }
   else { fadeTextAppear(`Not enough coins - you need ${toWord(gameData["vegCost"][produce]["buy"] - gameData.coins)} more`, false, "#de0000"); }
   function buy() {
      gameData[produce] += 5;
      updateVeg(produce);
      gameData.coins -= Math.round(gameData["vegCost"][produce]["buy"]);
      updateCoins();
      gameData["vegCost"][produce]["buy"] *= 1.08;
      gameData["vegCost"][produce]["sell"] *= 1.02;
   }
   function calcInflation(times) {
      let fakeBuy = gameData["vegCost"][produce]["buy"];
      let totalPrice = 0;
      for (i = 1; i < times; i++) { totalPrice += fakeBuy; fakeBuy *= 1.08; }
      return totalPrice;
   }
   updateMarketSalePrices();
}
function sellProduce(produce) {
   if (event.ctrlKey && gameData[produce] >= 50) {
      for (i = 0; i < 10; i++) { sell(); } marketLuck();
   }
   else if (event.shiftKey && gameData[produce] >= 25) {
      for (i = 0; i < 5; i++) { sell(); } marketLuck();
   }
   else if (gameData[produce] >= 5) { sell(); marketLuck(); }
   else { fadeTextAppear(`Not enough produce - you need ${5 - gameData[produce]} more`, false, "#de0000"); }
   function sell() {
      gameData[produce] -= 5;
      updateVeg(produce);
      gameData.coins += Math.round(gameData["vegCost"][produce]["sell"]);
      updateCoins();
      gameData["vegCost"][produce]["buy"] *= 0.98;
      gameData["vegCost"][produce]["sell"] *= 0.92;
   }
   updateMarketSalePrices();
}

// Market Exchanges
function generateExchange() {
   let merchantNames = ["Ramesh Devi", "Zhang Wei", "Emmanuel Abara", "Kim Nguyen", "John Smith", "Muhammad Khan", "David Smith", "Achariya Sok", "Aleksandr Ivanov", "Mary Smith", "José Silva", "Oliver Gruber", "James Wang", "Kenji Satō"];
   let merchantName = merchantNames[Math.floor(Math.random() * merchantNames.length)];
   let vegOwnedExchange = gameData.plantSeeds;
   let x = vegOwnedExchange[Math.floor(Math.random() * vegOwnedExchange.length)];
   vegOwnedExchange = vegOwnedExchange.filter(e => e !== `${x}`);
   let n = vegOwnedExchange[Math.floor(Math.random() * vegOwnedExchange.length)];
   offerVeg.vegetable = x;
   costVeg.vegetable = n;
   offerVeg.worth = gameData["exchangeMarket"][offerVeg.vegetable];
   costVeg.worth = gameData["exchangeMarket"][costVeg.vegetable];
   offerVeg.amount = random(2, 25);
   offerVeg.totalVal = offerVeg.amount * offerVeg.worth;
   costVeg.amount = Math.round(offerVeg.totalVal / costVeg.worth);
   document.querySelector(".market-exchange").style.backgroundColor = genColor();
   document.querySelector(".exchange-merchant").textContent = `${merchantName}`;
   document.querySelector(".exchange-offer").textContent = `${toWord(offerVeg.amount)} ${offerVeg.vegetable}`;
   document.querySelector(".exchange-demand").textContent = `${toWord(costVeg.amount)} ${costVeg.vegetable}`;
   if (offerVeg.amount === 0) { generateExchange(); }
   if (costVeg.amount === 0) { generateExchange(); }
}
function acceptExchange() {
   if (gameData[costVeg.vegetable] >= costVeg.amount) {
      gameData[offerVeg.vegetable] += Math.round(offerVeg.amount);
      gameData[costVeg.vegetable] -= Math.round(costVeg.amount);
      updateVeg(offerVeg.vegetable);
      updateVeg(costVeg.vegetable);
      generateExchange();
   }
   else { fadeTextAppear(`Not enough produce -  you need ${costVeg.amount - gameData[costVeg.vegetable]} more`, false, "#de0000"); }
}

// Black Market
function generateBlackMarketDeal() {
   gameData.black.name = ["Clearly Badd", "Hereto Steale", "Heinous Krime", "Elig L. Felonie", "Sheeft E. Karacter", "Abad Deel", "Stolin Goods"][Math.floor(Math.random() * 7)];
   gameData.black.item = ["Market Resets", "Fertilizer", "Doughnuts"][Math.floor(Math.random() * 3)];
   gameData.black.quantity = random(1, 5);
   if (gameData.black.item === "Market Resets") { gameData.black.worth = gameData.black.resets; }
   if (gameData.black.item === "Fertilizer") { gameData.black.worth = gameData.black.fertilizer; }
   if (gameData.black.item === "Doughnuts") { gameData.black.worth = gameData.black.doughnuts; }
   gameData.black.cost = gameData.black.worth * gameData.black.quantity;
}
function displayBlackMarketValues() {
   document.querySelector(".bmo-seller").textContent = gameData.black.name;
   document.querySelector(".bmo-offer").textContent = gameData.black.quantity + " " + gameData.black.item;
   document.querySelector(".bmo-price").textContent = toWord(gameData.black.cost);
}
function accept() {
   if (gameData.coins >= gameData.black.cost) {
      gameData.coins -= gameData.black.cost;
      updateCoins();
      generateBlackMarketDeal();
      blackMarketLuck();
      displayBlackMarketValues();
      gameData.black.catchChance += .01;
      updatePoliceChance();
      if (gameData.black.item === "Market Resets") {
         gameData.marketResets += gameData.black.quantity;
         updateMarketResets();
      }
      if (gameData.black.item === "Fertilizer") {
         gameData.fertilizers += gameData.black.quantity;
         updateFertilizer();
      }
      if (gameData.black.item === "Doughnuts") {
         gameData.doughnuts += gameData.black.quantity;
         updateDoughnuts();
      }
      checkTasks("seeBlackMarket");
   }
   else { fadeTextAppear(`Not enough coins - you need ${toWord(gameData.black.cost - gameData.coins)} more`, false, "#de0000"); }
}
function deny() {
   generateBlackMarketDeal();
   blackMarketLuck();
   displayBlackMarketValues();
   gameData.black.catchChance += .01;
   updatePoliceChance();
}
function feedPolice() {
   if (gameData.doughnuts >= 1) {
      gameData.doughnuts -= 1;
      updateDoughnuts();
      gameData.black.catchChance = .02;
      updatePoliceChance();
      fadeTextAppear(`-1 Doughnut`, false, "#de0000");
      checkTasks("tryPoliceDoughnuts");
   }
   else { fadeTextAppear(`Not enough doughnuts -  you have none`, false, "#de0000"); }
}
