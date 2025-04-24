
// classStorage.js
class Storage {
    constructor(x, y, maxPotatoes, dia) {
       this.x = x;
       this.y = y;
       this.maxPotatoes = maxPotatoes;
       this.storedPotatoes = 0;
       this.isUIOpen = false;
       this.dia = dia
       this.delayAmount = 5 // Delay for the deliver and collect buttons
       this.delayCurrent = 0
       this.imageToDisplay;
    }

    display() {
      if(!this.isUIOpen && !farm.isUIOpen && !shop.isUIOpen){
      fill(0, 255, 0, 50); // Semi-transparent green for the farm radius
      noStroke();
      rectMode(CENTER);
      rect(this.x, this.y, this.dia, this.dia); // Draw the interaction radius
      }
    }

    displayUI() {
      if (this.isUIOpen) {
        // UI background
      fill(50, 50, 50, 200); // Semi-transparent dark background
      rectMode(CENTER);
      const uiW = width * 0.8; // Width of the UI box 
      const uiH = height * 0.8;// Height of the UI box 
      const uiX = width / 2; //Position - Ignore Same as above
      const uiY = height / 2; //Position - Ignore Same as above
      rect(uiX, uiY, uiW, uiH);
    
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(20);
        text("Storage UI", uiX, uiY - uiH / 2 + 50);

        text("Storage: " + this.storedPotatoes + "/" + this.maxPotatoes + " potatoes", uiX, uiY - uiH / 2 + 100); // Update the text with the current potato count
      
      const fullness = (this.storedPotatoes / this.maxPotatoes) * 100; // Calculate fullness percentage

      
      if (fullness === 0) {
          this.imageToDisplay = emptyImage; // Replace with your empty storage image
      } else if (fullness > 0 && fullness <= 25) {
          this.imageToDisplay = quarterFullImage; // Replace with your 25% full storage image
      } else if (fullness > 25 && fullness <= 50) {
          this.imageToDisplay = halfFullImage; // Replace with your 50% full storage image
      } else if (fullness > 50 && fullness <= 75) {
          this.imageToDisplay = threeQuarterFullImage; // Replace with your 75% full storage image
      } else {
          this.imageToDisplay = fullImage; // Replace with your full storage image
      }

      if(this.imageToDisplay != null){
      imageMode(CENTER);
      image(this.imageToDisplay, uiX, uiY, 200, 200); // Display the image in the center of the UI
      }

      // Draw the "Deliver" button rectangle
      fill(0, 200, 0); // Green color for the button
      rectMode(CORNER);
      rect(330, 450, 100, 40); // Rectangle for the "Deliver" button

      // Draw the "Collect" button rectangle
      fill(0, 0, 200); // Blue color for the button
      rect(330, 520, 100, 40); // Rectangle for the "Collect" button

      // Add text to the Deliver and Collect button
      fill(255);
      textSize(16);
      textAlign(CENTER, CENTER);
      text("Deliver", 380, 470); // Center the text inside the button
      text("Collect", 380, 540); // Center the text inside the button


      // Add an delay to how fast you deliver and collect potatoes, that works by frames
      this.delayCurrent++ 
      if(this.delayCurrent >= this.delayAmount){
          // Check if the mouse is pressed and over the deliver button
          if (mouseIsPressed && mouseX > 330 && mouseX < 430 && mouseY > 450 && mouseY < 490) {
            this.deliverPotatoes(); // Continuously deliver potatoes
          }

            // Check if the mouse is pressed and over the collect button
          if (mouseIsPressed && mouseX > 330 && mouseX < 430 && mouseY > 520 && mouseY < 560) {
            this.collectPotatoes(); // Continuously collect potatoes
          }
          this.delayCurrent = 0 // Reset the delay counter
          }
      }
   }
    
    toggleUI() {
        this.isUIOpen = !this.isUIOpen;
    }
      
    isPlayerNearby(player) {
       const distance = dist(player.x, player.y, this.x, this.y);
       return distance <= 150; // Afstand spiller skal være indenfor
    }    

    deliverPotatoes() {
      let amount = int(deliverInput.value());
    
      if (gameController.potato >= amount ) {
        if (this.storedPotatoes + amount <= this.maxPotatoes) {
          gameController.potato -= amount;
          this.storedPotatoes += amount;
        } 
      } 
    }
    
    collectPotatoes() {
      let amount = int(collectInput.value());
      
      if (amount > 0 && this.storedPotatoes >= amount) {
        gameController.potato += amount;
        this.storedPotatoes -= amount;
      }
    }
}
