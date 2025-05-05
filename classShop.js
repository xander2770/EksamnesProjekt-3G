// Class to handle the shop functionality in the game
class Shop {
  constructor(x, y, dia) {
    // Initialize the shop's position and interaction radius
    this.x = x; // X-coordinate of the shop
    this.y = y; // Y-coordinate of the shop
    this.dia = dia; // Diameter of the shop's interaction radius

    // State variables
    this.isUIOpen = false; // Whether the shop UI is currently open
    this.sellButton = null; // Button for selling potatoes
    this.sellDropdown = null; // Dropdown for selecting the amount of potatoes to sell
    this.upgradeButton = null; // Button for upgrading storage
    this.upgradeGrowthButton = null; // Button for upgrading growth rate

    // Upgrade costs
    this.upgradeStorageCost = gameController.storageLevel; // Initial cost to upgrade storage
    this.upgradeGrowthCost = gameController.growthLevel; // Initial cost to upgrade growth rate
  }

  // Display the shop's interaction radius
  display() {
    if (!this.isUIOpen && !farm.isUIOpen && !shop.isUiOpen) {
      fill(0, 255, 0, 50); // Semi-transparent green for the interaction radius
      noStroke();
      rectMode(CENTER);
      rect(this.x, this.y, this.dia, this.dia); // Draw the interaction radius
    }
  }

  // Display the shop UI
  displayUI() {
    if (this.isUIOpen) {
      // Draw the background for the shop UI
      fill(50, 50, 50, 200); // Semi-transparent gray background
      rectMode(CENTER);
      rect(width / 2, height / 2, 800, 600); // UI box

      // Display shop UI text
      fill(255);
      textAlign(CENTER, CENTER);
      textSize(20);
      text("Shop UI", width / 2, height / 2 - 100);
      text("Select Bundle Size and Sell Potatoes", width / 2, height / 2 - 50);
      text("Upgrade Storage Cost: " + this.upgradeCost, width / 2, height / 2 + 100);
      text("Storage Level: " + gameController.storageLevel, width / 2, height / 2 + 150);
      text("Upgrade Growth Cost: " + this.upgradeGrowthCost, width / 2, height / 2 + 200);
      text("Growth Level: " + gameController.growthLevel, width / 2, height / 2 + 250);

      // Define the UI's top-left corner for positioning elements
      const uiLeftX = width / 2 - 400;
      const uiTopY = height / 2 - 300;

      // Create the "Sell" button if it doesn't exist
      if (!this.sellButton) {
        this.sellButton = createButton("Sell");
        this.sellButton.position(uiLeftX + 20, uiTopY + 20); // Position the button
        this.sellButton.size(150, 50); // Set button size
        this.sellButton.style("background-color", "red"); // Button color
        this.sellButton.style("color", "white");
        this.sellButton.style("border", "none");
        this.sellButton.style("border-radius", "5px");
        this.sellButton.style("font-size", "16px");
        this.sellButton.mousePressed(() => {
          const selectedAmount = parseInt(this.sellDropdown.value()); // Get selected amount
          this.sellPotatoes(selectedAmount); // Sell the selected amount
        });
      }

      // Create the dropdown for selecting bundle size if it doesn't exist
      if (!this.sellDropdown) {
        this.sellDropdown = createSelect();
        this.sellDropdown.position(uiLeftX + 20, uiTopY + 80); // Position the dropdown
        this.sellDropdown.size(150, 30); // Set dropdown size
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
        this.upgradeButton.position(uiLeftX + 20, uiTopY + 140); // Position the button
        this.upgradeButton.size(150, 50); // Set button size
        this.upgradeButton.style("background-color", "blue"); // Button color
        this.upgradeButton.style("color", "white");
        this.upgradeButton.style("border", "none");
        this.upgradeButton.style("border-radius", "5px");
        this.upgradeButton.style("font-size", "16px");
        this.upgradeButton.mousePressed(() => {
          this.upgradeStorage(); // Upgrade storage when pressed
        });
      }

      // Create the "Upgrade Growth Rate" button if it doesn't exist
      if (!this.upgradeGrowthButton) {
        this.upgradeGrowthButton = createButton("Upgrade Growth Rate");
        this.upgradeGrowthButton.position(uiLeftX + 20, uiTopY + 200); // Position the button
        this.upgradeGrowthButton.size(150, 50); // Set button size
        this.upgradeGrowthButton.style("background-color", "blue"); // Button color
        this.upgradeGrowthButton.style("color", "white");
        this.upgradeGrowthButton.style("border", "none");
        this.upgradeGrowthButton.style("border-radius", "5px");
        this.upgradeGrowthButton.style("font-size", "16px");
        this.upgradeGrowthButton.mousePressed(() => {
          this.upgradeGrowth(); // Upgrade growth rate when pressed
        });
      }
    } else {
      // Remove UI elements when the shop UI is closed
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

  // Sell potatoes based on the selected amount
  sellPotatoes(amount) {
    const potatoPrice = 5; // Price per potato

    if (storage.storedPotatoes >= amount) {
      storage.storedPotatoes -= amount; // Reduce potatoes in storage
      gameController.addCoins(amount * potatoPrice); // Add coins to the player's balance
      console.log(`Sold ${amount} potato(es) for ${amount * potatoPrice} coins.`);
    } else {
      console.log("Not enough potatoes in storage to sell.");
    }
  }

  // Dynamically set upgrade costs based on levels
  setUpgradeCostBasedOnLevel(storageLevel, growthLevel) {
    this.upgradeStorageCost = (storageLevel + 1) * 100; // Calculate storage upgrade cost
    this.upgradeGrowthCost = (growthLevel + 1) * 100; // Calculate growth upgrade cost
  }

  // Upgrade storage capacity
  upgradeStorage() {
    if (gameController.coins >= this.upgradeCost && gameController.storageLevel < 10) {
      gameController.storageLevel += 1; // Increase storage level
      gameController.coins -= this.upgradeCost; // Deduct coins from the player
      storage.setStorageCapacity(gameController.storageLevel); // Set the storage capacity based on the new level
      console.log(`Storage upgraded! New capacity: ${storage.maxPotatoes}`);
      console.log(`Coins deducted: ${this.upgradeCost}`);
      console.log(`Next upgrade cost: ${this.upgradeCost}`);
    } else {
      console.log("Not enough coins to upgrade storage.");
    }
  }

  // Upgrade growth rate
  upgradeGrowth() {
    if (gameController.coins >= this.upgradeGrowthCost && gameController.growthLevel < 10) {
      gameController.growthLevel += 1; // Increase growth rate
      gameController.coins -= this.upgradeGrowthCost; // Deduct coins from the player
      farm.setGrowthDuration(gameController.growthLevel); // Set the growth duration based on the new level
      console.log(`Growth upgraded! New growth level: ${gameController.growthLevel}`);
    } else {
      console.log("Not enough coins to upgrade growth rate.");
    }
  }

  // Toggle the shop UI
  toggleUI() {
    this.isUIOpen = !this.isUIOpen;
  }

  // Check if the player is within the shop's interaction radius
  isPlayerNearby(player) {
    const distance = dist(player.x, player.y, this.x, this.y);
    return distance <= 150; // Distance threshold for interaction
  }
}