class Shop {
  constructor(x, y, dia) {
    this.x = x;
    this.y = y;
    this.dia = dia;
    this.isUIOpen = false;
    this.sellButton = null; // Central sell button
    this.sellDropdown = null; // Dropdown for selecting bundle size
    this.upgradeButton = null;
    this.upgradeGrowthButton = null; // Button for upgrading storage
    this.upgradeCost = 100;
    this.upgradeGrowthCost = 100; // Initial cost to upgrade storage
  }

  display() {
    if (!this.isUIOpen && !farm.isUIOpen && !shop.isUiOpen) {
      fill(0, 255, 0, 50); // Semi-transparent green for the farm radius
      noStroke();
      rectMode(CENTER);
      rect(this.x, this.y, this.dia, this.dia); // Draw the interaction radius
    }
  }

  displayUI() {
    if (this.isUIOpen) {
      fill(50, 50, 50, 200); // Background for UI
      rectMode(CENTER);
      rect(width / 2, height / 2, 800, 600); // Gray UI box

      fill(255);
      textAlign(CENTER, CENTER);
      textSize(20);
      text("Shop UI", width / 2, height / 2 - 100);
      text("Select Bundle Size and Sell Potatoes", width / 2, height / 2 - 50);
      text("Upgrade Storage Cost: "+this.upgradeCost, width / 2, height / 2 + 100);
      text("Storage Level: " + gameController.storageLevel, width / 2, height / 2 + 150);
      text("Upgrade Growth Cost: " + this.upgradeGrowthCost, width / 2, height / 2 + 200);
      text("Growth Level: " + gameController.growthLevel, width / 2, height / 2 + 250);

      const uiLeftX = width / 2 - 400; // Left edge of the gray UI box
      const uiTopY = height / 2 - 300; // Top edge of the gray UI box

      // Create the "Sell" button if it doesn't exist
      if (!this.sellButton) {
        this.sellButton = createButton("Sell");
        this.sellButton.position(uiLeftX + 20, uiTopY + 20); // Top-left corner of the UI
        this.sellButton.size(150, 50);
        this.sellButton.style("background-color", "red");
        this.sellButton.style("color", "white");
        this.sellButton.style("border", "none");
        this.sellButton.style("border-radius", "5px");
        this.sellButton.style("font-size", "16px");
        this.sellButton.mousePressed(() => {
          const selectedAmount = parseInt(this.sellDropdown.value());
          this.sellPotatoes(selectedAmount);
        });
      }

      // Create the dropdown for selecting bundle size if it doesn't exist
      if (!this.sellDropdown) {
        this.sellDropdown = createSelect();
        this.sellDropdown.position(uiLeftX + 20, uiTopY + 80); // Below the "Sell" button
        this.sellDropdown.size(150, 30);
        this.sellDropdown.option("1");
        this.sellDropdown.option("5");
        this.sellDropdown.option("10");
        this.sellDropdown.option("50");
        this.sellDropdown.option("100");
        this.sellDropdown.style("font-size", "14px");
      }

      // Create the "Upgrade Storage" button if it doesn't exist
      if (!this.upgradeButton) {
        this.upgradeButton = createButton("Upgrade Storage");
        this.upgradeButton.position(uiLeftX + 20, uiTopY + 140); // Below the dropdown
        this.upgradeButton.size(150, 50);
        this.upgradeButton.style("background-color", "blue");
        this.upgradeButton.style("color", "white");
        this.upgradeButton.style("border", "none");
        this.upgradeButton.style("border-radius", "5px");
        this.upgradeButton.style("font-size", "16px");
        this.upgradeButton.mousePressed(() => {
          this.upgradeStorage();
        });
      }

      if(!this.upgradeGrowthButton){
        this.upgradeGrowthButton = createButton("Upgrade Growth Rate");
        this.upgradeGrowthButton.position(uiLeftX + 20, uiTopY + 200); // Below the dropdown
        this.upgradeGrowthButton.size(150, 50);
        this.upgradeGrowthButton.style("background-color", "blue");
        this.upgradeGrowthButton.style("color", "white");
        this.upgradeGrowthButton.style("border", "none");
        this.upgradeGrowthButton.style("border-radius", "5px");
        this.upgradeGrowthButton.style("font-size", "16px");
        this.upgradeGrowthButton.mousePressed(() => {
          this.upgradeGrowth();
        });
      }
    } else {
      // Remove the dropdown, sell button, and upgrade button when the UI is closed
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

  sellPotatoes(amount) {
    const potatoPrice = 5; // Price per potato

    if (storage.storedPotatoes >= amount) {
      storage.storedPotatoes -= amount; // Reduce potatoes in storage
      gameController.addCoins(amount * potatoPrice); // Add coins to the player
      console.log(`Sold ${amount} potato(es) for ${amount * potatoPrice} coins.`);
    } else {
      console.log("Not enough potatoes in storage to sell.");
    }
  }

  upgradeStorage() {
    if (gameController.coins >= this.upgradeCost && gameController.storageLevel < 10) {
      gameController.storageLevel += 1; // Increase storage level
      gameController.coins -= this.upgradeCost; // Deduct coins from the player
      storage.setStorageCapacity(gameController.storageLevel); // Set the storage capacity based on the new level
      console.log(`Storage upgraded! New capacity: ${storage.maxPotatoes}`);
      console.log(`Coins deducted: ${this.upgradeCost}`);
      this.upgradeCost *= 2; // Double the cost for the next upgrade
      console.log(`Next upgrade cost: ${this.upgradeCost}`);
    } else {
      console.log("Not enough coins to upgrade storage.");
    }
  }

  upgradeGrowth() {
    if (gameController.coins >= this.upgradeGrowthCost && gameController.growthLevel < 10) {
      gameController.growthLevel += 1; // Increase growth rate by 50%
      gameController.coins -= this.upgradeGrowthCost; // Deduct coins from the player
      farm.setGrowthDuration(gameController.growthLevel) // Set the growth duration based on the new growth level
      console.log(`Growth upgraded! New growth level: ${gameController.growthLevel}`);
      this.upgradeGrowthCost *= 2; // Double the cost for the next upgrade
    } else {
      console.log("Not enough coins to upgrade growth rate.");
    }
  }
  

  toggleUI() {
    this.isUIOpen = !this.isUIOpen;
  }

  isPlayerNearby(player) {
    const distance = dist(player.x, player.y, this.x, this.y);
    return distance <= 150; // Distance player must be within
  }
}