class Farm{
    constructor(x, y, dia) {
      this.x = x; // Farm's x position
      this.y = y; // Farm's y position
      this.dia = dia; // Interaction radius
      this.isUIOpen = false; // Flag to track if the UI is open
    }
  
    // To check if the player is within the interaction radius by using dist function
    // Note: dist() is a p5.js function that calculates the distance between two points
    isPlayerNearby(player) {
      const distance = dist(player.x, player.y, this.x, this.y);
      return distance <= this.dia;
    }
  
    // Toggle the UI when the player presses "E"
    toggleUI() {
      this.isUIOpen = !this.isUIOpen;
    }
  
    // Display the farm area on the map
    display() {
      if(!this.isUIOpen){
      fill(0, 255, 0, 50); // Semi-transparent green for the farm radius
      noStroke();
      rectMode(CENTER);
      rect(this.x, this.y, this.dia, this.dia); // Draw the interaction radius
      }
    }
  
    // To display the UI when it is open
    displayUI() {
      if (this.isUIOpen) {
        fill(50, 50, 50, 200); // Semi-transparent dark background
        rectMode(CENTER);
        rect(width / 2, height / 2, 800, 600); // UI background
  
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(20);
        text("Farm UI", width / 2, height / 2 - 100);
        textSize(16);
        text("Here you can manage your farm!", width / 2, height / 2 - 60);
  
        // Add more UI elements here (e.g., buttons, options)
      }
    }
  
  }