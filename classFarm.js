class Farm{
  constructor(x, y, dia, emptyPlot, plantedPlot, harvestablePlot) {
    this.x = x; // Farm's x position
    this.y = y; // Farm's y position
    this.dia = dia; // Interaction radius
    this.isUIOpen = false; // Flag to track if the UI is open

    // Images for the plots
    this.emptyPlot = emptyPlot; // Image for empty plot
    this.plantedPlot = plantedPlot; // Image for planted plot
    this.harvestablePlot = harvestablePlot; // Image for harvestable plot

    // Mini-game grid (5x5)
    this.plotsAmountRow = 5; // Number of plots in each row - Note: Row is horisontal and columns is vertical.
    this.plotsAmountCol = 5; // Number of plots in each column
    /* fill(), fills the array with maps that each holds 5 arrays, 
    that each holds a state, growth stage, and growth timer. This creates the 5x5 grid of plots*/
    this.grid = Array(this.plotsAmountRow).fill().map(() => 
      Array(this.plotsAmountCol).fill().map(() => ({ state: 'empty', growthStage: 0, growthTimer: 0 }))
    ); // Make grid with 'empty', growth stage 0, and growth timer 0
    this.plotSize = 100; // Size of each grid plot
    this.growthDuration = 5000; // Time (in ms) for a plant to grow to the next stage
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
    if(!this.isUIOpen && !storage.isUIOpen && !shop.isUIOpen){
    fill(0, 255, 0, 50); // Semi-transparent green for the farm radius
    noStroke();
    rectMode(CENTER);
    rect(this.x, this.y, this.dia, this.dia); // Draw the interaction radius
    }
  }

 // To display the UI when it is open
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

    // Text inside the UI
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(20);
    text("Farm UI", uiX, uiY - uiH / 2 + 50); // Place text near the top of the UI box
    textSize(16);
    text("Click on a grid plot to plant or harvest potatoes!", uiX, uiY - uiH / 2 + 100); // Place text below the title

    // Display the 3x3 grid
    this.displayGrid();
}
}

  // Display the 3x3 grid for the mini-game
  displayGrid() {
    
    const gridWidth = this.plotSize * 5; // This is the total width of the grid, so we can center it
    const gridHeight = this.plotSize * 5; // This is the total height of the grid, so we can center it
    const startX = (width - gridWidth) / 2; // Center the grid horizontally
    const startY = (height - gridHeight) / 2; // Center the grid vertically

    for (let row = 0; row < this.plotsAmountRow; row++) { // Loop through rows that each holds 5 plots
        for (let col = 0; col < this.plotsAmountCol; col++) {
          const x = startX + col * this.plotSize;
          const y = startY + row * this.plotSize;
  
          const plot = this.grid[row][col]; // Get the plot object

        imageMode(CORNER); // Set image mode to CORNER for positioning
        // Draw the appropriate image based on the state of the plot
        if (plot.state === 'empty') {
          image(this.emptyPlot, x, y, this.plotSize, this.plotSize); // Draw empty plot
        } else if (plot.state === 'planted') {
          image(this.plantedPlot[plot.growthStage], x, y, this.plotSize, this.plotSize); // Draw planted plot based on growth stage
        } else if (plot.state === 'harvestable') {
          image(this.harvestablePlot, x, y, this.plotSize, this.plotSize); // Draw harvestable plot
        }
        
        }
    }
}

// Update the growth of plants
updateGrowth() {
  const currentTime = Date.now();

  for (let row = 0; row < this.plotsAmountRow; row++) {
    for (let col = 0; col < this.plotsAmountCol; col++) {
      const plot = this.grid[row][col];

      if (plot.state === 'planted') {
        // Check if enough time has passed to grow to the next stage
        if (currentTime - plot.growthTimer >= this.growthDuration) {
          if (plot.growthStage < this.plantedPlot.length - 1) {
            plot.growthStage++; // Advance to the next growth stage
            plot.growthTimer = currentTime; // Reset the growth timer
          } else {
            plot.state = 'harvestable'; // Fully grown, change to harvestable
          }
        }
      }
    }
  }
}

// Handle mouse clicks to interact with the grid
handleMouseClick(mx, my) {
if (this.isUIOpen) {
  const gridWidth = this.plotSize * 5; // Same as above
  const gridHeight = this.plotSize * 5; // Same as above
  const startX = (width - gridWidth) / 2; // Center it horizontally
  const startY = (height - gridHeight) / 2; // Center it vertically

    for (let row = 0; row < this.plotsAmountRow; row++) {
        for (let col = 0; col < this.plotsAmountCol; col++) {
            const x = startX + col * this.plotSize;
            const y = startY + row * this.plotSize;

            // Check if the mouse is within the plot area
          if (mx > x && mx < x + this.plotSize && my > y && my < y + this.plotSize) {
            const plot = this.grid[row][col]; // Get the plot object

            // Interact with the plot based on its state
            if (plot.state === 'empty') {
              plot.state = 'planted'; // Change to planted
              plot.growthStage = 0; // Start at growth stage 0
              plot.growthTimer = Date.now(); // Start the growth timer
            } else if (plot.state === 'harvestable') {
              gameController.addPotatoes(1); // Add a potato to the player's inventory
              plot.state = 'empty'; // Reset to empty
              plot.growthStage = 0; // Reset growth stage
              plot.growthTimer = 0; // Reset growth timer
            }
            // Exit the loop once the clicked plot is found and updated
          return;
          }
        }
      }
    }
  }
}