
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
      
        const boxSize = 20;
        const numBoxes = this.maxPotatoes / boxSize;
        
        const boxesPerRow = 4; // Hvor mange kasser du vil have per række
        const spacingX = 220; // Afstand mellem kasser (vandret)
        const spacingY = 180; // Afstand mellem rækker (lodret)
        
        for (let i = 0; i < numBoxes; i++) {
          let potatoesInBox = this.storedPotatoes - (i * boxSize);
          potatoesInBox = constrain(potatoesInBox, 0, boxSize);
        
          const fullness = potatoesInBox / boxSize;
        
          let boxImage;
          if (fullness === 0) {
            boxImage = emptyImage;
          } else if (fullness <= 0.25) {
            boxImage = quarterFullImage;
          } else if (fullness <= 0.5) {
            boxImage = halfFullImage;
          } else if (fullness <= 0.75) {
            boxImage = threeQuarterFullImage;
          } else {
            boxImage = fullImage;
          }
        
          const row = Math.floor(i / boxesPerRow); // Hvilken række vi er i
          const col = i % boxesPerRow; // Hvilken kolonne
        
          const x = uiX + (col - (boxesPerRow - 1) / 2) * spacingX;
          const y = uiY - 50 + row * spacingY;
        
          imageMode(CENTER);
          image(boxImage, x, y, 200, 200);
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
