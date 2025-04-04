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
    this.grid = Array(5).fill().map(() =>
      Array(5).fill().map(() => ({ state: 'empty', growthStage: 0, growthTimer: 0 }))
    ); // Make grid with 'empty', growth stage 0, and growth timer 0
    this.cellSize = 100; // Size of each grid cell
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
    if(!this.isUIOpen && !storage.isUIOpen){
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
    text("Click on a grid cell to plant or harvest potatoes!", uiX, uiY - uiH / 2 + 100); // Place text below the title

    // Display the 3x3 grid
    this.displayGrid();
}
}

  // Display the 3x3 grid for the mini-game
  displayGrid() {
    
    const gridWidth = this.cellSize * 5; // This is the total width of the grid, so we can center it
    const gridHeight = this.cellSize * 5; // This is the total height of the grid, so we can center it
    const startX = (width - gridWidth) / 2; // Center the grid horizontally
    const startY = (height - gridHeight) / 2; // Center the grid vertically

    for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 5; col++) {
          const x = startX + col * this.cellSize;
          const y = startY + row * this.cellSize;
  
          const cell = this.grid[row][col]; // Get the cell object

        imageMode(CORNER); // Set image mode to CORNER for positioning
        // Draw the appropriate image based on the state of the cell
        if (cell.state === 'empty') {
          image(this.emptyPlot, x, y, this.cellSize, this.cellSize); // Draw empty plot
        } else if (cell.state === 'planted') {
          image(this.plantedPlot[cell.growthStage], x, y, this.cellSize, this.cellSize); // Draw planted plot based on growth stage
        } else if (cell.state === 'harvestable') {
          image(this.harvestablePlot, x, y, this.cellSize, this.cellSize); // Draw harvestable plot
        }
        
        }
    }
}

// Update the growth of plants
updateGrowth() {
  const currentTime = Date.now();

  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      const cell = this.grid[row][col];

      if (cell.state === 'planted') {
        // Check if enough time has passed to grow to the next stage
        if (currentTime - cell.growthTimer >= this.growthDuration) {
          if (cell.growthStage < this.plantedPlot.length - 1) {
            cell.growthStage++; // Advance to the next growth stage
            cell.growthTimer = currentTime; // Reset the growth timer
          } else {
            cell.state = 'harvestable'; // Fully grown, change to harvestable
          }
        }
      }
    }
  }
}

// Handle mouse clicks to interact with the grid
handleMouseClick(mx, my) {
if (this.isUIOpen) {
  const gridWidth = this.cellSize * 5; // Same as above
  const gridHeight = this.cellSize * 5; // Same as above
  const startX = (width - gridWidth) / 2; // Center it horizontally
  const startY = (height - gridHeight) / 2; // Center it vertically

    for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 5; col++) {
            const x = startX + col * this.cellSize;
            const y = startY + row * this.cellSize;

            // Check if the mouse is within the cell
          if (mx > x && mx < x + this.cellSize && my > y && my < y + this.cellSize) {
            const cell = this.grid[row][col]; // Get the cell object

            // Interact with the cell based on its state
            if (cell.state === 'empty') {
              cell.state = 'planted'; // Change to planted
              cell.growthStage = 0; // Start at growth stage 0
              cell.growthTimer = Date.now(); // Start the growth timer
            } else if (cell.state === 'harvestable') {
              gameController.addPotatoes(1); // Add a potato to the player's inventory
              cell.state = 'empty'; // Reset to empty
              cell.growthStage = 0; // Reset growth stage
              cell.growthTimer = 0; // Reset growth timer
            }
            // Exit the loop once the clicked cell is found and updated
          return;
          }
        }
      }
    }
  }
}