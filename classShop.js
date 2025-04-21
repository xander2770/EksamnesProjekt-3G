class Shop {
  constructor(x, y, dia) {
    this.x = x;
    this.y = y;
    this.dia = dia;
    this.isUIOpen = false;
    this.sellButton = null; // Central sell button
    this.sellDropdown = null; // Dropdown for selecting bundle size
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
      fill(50, 50, 50, 200); // Baggrund til UI
      rectMode(CENTER);
      rect(width / 2, height / 2, 800, 600); // Grå UI-box

      fill(255);
      textAlign(CENTER, CENTER);
      textSize(20);
      text("Shop UI", width / 2, height / 2 - 100);
      text("Select Bundle Size and Sell Potatoes", width / 2, height / 2 - 50);

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
    } else {
      // Remove the dropdown and button when the UI is closed
      if (this.sellDropdown) {
        this.sellDropdown.remove();
        this.sellDropdown = null;
      }
      if (this.sellButton) {
        this.sellButton.remove();
        this.sellButton = null;
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

  toggleUI() {
    this.isUIOpen = !this.isUIOpen;
  }

  isPlayerNearby(player) {
    const distance = dist(player.x, player.y, this.x, this.y);
    return distance <= 150; // Afstand spiller skal være indenfor
  }
}