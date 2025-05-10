// Klasse til at håndtere butikfunktionaliteten i spillet
class Shop {
  constructor(x, y, dia) {
    this.x = x; // X-koordinat for butikken
    this.y = y; // Y-koordinat for butikken
    this.dia = dia; // Diameter for butikkens interaktionsradius

    this.isUIOpen = false; // Om butiks-UI'et er åbent
    this.sellButton; // Knap til at sælge kartofler
    this.sellDropdown; // Dropdown til at vælge hvor mange kartofler der skal sælges
    this.upgradeButton; // Knap til at opgradere lager
    this.upgradeGrowthButton; // Knap til at opgradere væksthastighed

    this.upgradeStorageCost = gameController.storageLevel;
    this.upgradeGrowthCost = gameController.growthLevel;
  }

  // Vis butikkens interaktionsradius
  display() {
    if (!this.isUIOpen && !farm.isUIOpen && !shop.isUiOpen) {
      fill(0, 255, 0, 50); // Halvgennemsigtig grøn til interaktionsradius
      noStroke();
      rectMode(CENTER);
      rect(this.x, this.y, this.dia, this.dia); // Tegn interaktionsradius
    }
  }

  // Vis butiks-UI
  displayUI() {
    if (this.isUIOpen) {
      // Tegn baggrund for butiks-UI
      fill(50, 50, 50, 200); // Halvgennemsigtig grå baggrund
      rectMode(CENTER);
      rect(width / 2, height / 2, 800, 600); // UI-boks

      // Vis tekst i butiks-UI
      fill(255);
      textAlign(CENTER, CENTER);
      textSize(20);
      text("Shop UI", width / 2, height / 2 - 100);
      text("Vælg pakkestørrelse og sælg kartofler", width / 2, height / 2 - 50);
      text("Pris for opgradering af lager: " + this.upgradeStorageCost, width / 2, height / 2 + 100);
      text("Lager-niveau: " + gameController.storageLevel, width / 2, height / 2 + 150);
      text("Pris for opgradering af vækst: " + this.upgradeGrowthCost, width / 2, height / 2 + 200);
      text("Vækst-niveau: " + gameController.growthLevel, width / 2, height / 2 + 250);

      // Definér UI’ets øverste venstre hjørnea
      const uiLeftX = width / 2 - 400;
      const uiTopY = height / 2 - 300;

      // Opret "Sælg"-knap hvis den ikke allerede findes
      if (!this.sellButton) {
        this.sellButton = createButton("Sell");
        this.sellButton.position(uiLeftX + 20, uiTopY + 20); 
        this.sellButton.size(150, 50);
        this.sellButton.style("background-color", "red"); 
        this.sellButton.style("color", "white");
        this.sellButton.style("border", "none");
        this.sellButton.style("border-radius", "5px");
        this.sellButton.style("font-size", "16px");
        this.sellButton.mousePressed(() => {
          const selectedAmount = parseInt(this.sellDropdown.value()); // Hent valgt mængde
          this.sellPotatoes(selectedAmount); // Sælg den valgte mængde
        });
      }

      // Opret dropdown til valg af antal kartofler hvis den ikke allerede findes
      if (!this.sellDropdown) {
        this.sellDropdown = createSelect();
        this.sellDropdown.position(uiLeftX + 20, uiTopY + 80); 
        this.sellDropdown.size(150, 30); 
        this.sellDropdown.option("1");
        this.sellDropdown.option("5");
        this.sellDropdown.option("10");
        this.sellDropdown.option("50");
        this.sellDropdown.option("100");
        this.sellDropdown.style("font-size", "14px");
      }

      // Opret "Opgrader lager"-knap hvis den ikke allerede findes
      if (!this.upgradeButton) {
        this.upgradeButton = createButton("Upgrade Storage");
        this.upgradeButton.position(uiLeftX + 20, uiTopY + 140); 
        this.upgradeButton.size(150, 50); 
        this.upgradeButton.style("background-color", "blue"); 
        this.upgradeButton.style("color", "white");
        this.upgradeButton.style("border", "none");
        this.upgradeButton.style("border-radius", "5px");
        this.upgradeButton.style("font-size", "16px");
        this.upgradeButton.mousePressed(() => {
          this.upgradeStorage(); // Opgrader lager ved klik
        });
      }

      // Opret "Opgrader væksthastighed" knap hvis den ikke allerede findes
      if (!this.upgradeGrowthButton) {
        this.upgradeGrowthButton = createButton("Upgrade Growth Rate");
        this.upgradeGrowthButton.position(uiLeftX + 20, uiTopY + 200); 
        this.upgradeGrowthButton.size(150, 50); 
        this.upgradeGrowthButton.style("background-color", "blue"); 
        this.upgradeGrowthButton.style("color", "white");
        this.upgradeGrowthButton.style("border", "none");
        this.upgradeGrowthButton.style("border-radius", "5px");
        this.upgradeGrowthButton.style("font-size", "16px");
        this.upgradeGrowthButton.mousePressed(() => {
          this.upgradeGrowth(); // Opgrader vækst ved klik
        });
      }
    } else {
      // Fjern UI-elementer når butiks-UI lukkes
      if (this.sellDropdown) {
        this.sellDropdown.remove();
        this.sellDropdown = null;
      }
      if (this.sellButton) {
        this.sellButton.remove();
        this.sellButton = null;
      }
      if (this.upgradeButton) {
        this.upgradeButton.remove();
        this.upgradeButton = null;
      }
      if (this.upgradeGrowthButton) {
        this.upgradeGrowthButton.remove();
        this.upgradeGrowthButton = null;
      }
    }
  }

  // Sælg kartofler baseret på valgt mængde
  sellPotatoes(amount) {
    const potatoPrice = 5; // Pris per kartoffel

    if (storage.storedPotatoes >= amount) {
      storage.storedPotatoes -= amount; // Træk kartofler fra storage
      gameController.addCoins(amount * potatoPrice);
      console.log(`Solgte ${amount} kartoffel(ler) for ${amount * potatoPrice} mønter.`);
    } else {
      console.log("Ikke nok kartofler på lager til at sælge.");
    }
  }

  // Sæt opgraderings pris dynamisk baseret på niveau
  setUpgradeCostBasedOnLevel(storageLevel, growthLevel) {
    this.upgradeStorageCost = (storageLevel + 1) * 100; // Beregn opgradering for lager
    this.upgradeGrowthCost = (growthLevel + 1) * 100; // Beregn opgradering for vækst
  }

  // Opgrader storage kapacitet
  upgradeStorage() {
    if (gameController.coins >= this.upgradeStorageCost && gameController.storageLevel < 10) {
      gameController.storageLevel += 1;
      gameController.coins -= this.upgradeStorageCost; // tag penge fra spiller
      storage.setStorageCapacity(gameController.storageLevel); // Sæt ny storage kapacitet
      console.log(`Lager opgraderet! Ny kapacitet: ${storage.maxPotatoes}`);
      console.log(`Mønter trukket: ${this.upgradeCost}`);
      console.log(`Næste opgradering koster: ${this.upgradeCost}`);
    } else {
      console.log("Ikke nok mønter til at opgradere lager.");
    }
  }

  // Opgrader væksthastighed
  upgradeGrowth() {
    if (gameController.coins >= this.upgradeGrowthCost && gameController.growthLevel < 10) {
      gameController.growthLevel += 1; // sætter væksthastigheds level op
      gameController.coins -= this.upgradeGrowthCost; // Træker penge fra spiller
      farm.setGrowthDuration(gameController.growthLevel); // Indstiler vækstvarighed baseret på nyt niveau
      console.log(`Vækst opgraderet! Nyt vækstniveau: ${gameController.growthLevel}`);
    } else {
      console.log("Ikke nok mønter til at opgradere væksthastighed.");
    }
  }

  // Skift butiks-UI til/fra
  toggleUI() {
    this.isUIOpen = !this.isUIOpen;
  }

  // Tjek om spilleren er inden for butikkens interaktionsradius
  isPlayerNearby(player) {
    const distance = dist(player.x, player.y, this.x, this.y);
    return(distance <= 150); // Returner sandt hvis spilleren er inden for radius
  }
}
