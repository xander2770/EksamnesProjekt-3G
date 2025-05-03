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
    this.plotSize = 100; // Size of each grid plot

    
    
    // Make a grid with 5 rows and 5 columns, that holds the state of each plot as an object.
    this.grid = Array(this.plotsAmountRow) // Create an array for each row in the grid (5 rows)
            .fill() // fill(), fills the array with undefined values, so we can use map() on it.
              .map(() => // Map changes each of the undefined values to a new array. (it does not modify the undefined values, but changes them to a new array)
                Array(this.plotsAmountCol) // Map each index in the array to a new column array (5 columns)
                .fill() // Fill columns with undefined to prepare for mapping
                  .map(() => ({ state: 'empty', growthStage: 0, growthTimer: 0 })) //and the we map those arrays undefined, with objects that has a state of 'empty', growth stage of 0, and growth timer of 0.
              ); // This is the grid that holds the state of each plot, by having 5 arrays with rows and each of those arrays has 5 arrays with columns, that holds the state of each plot as an object.

              //Note: Map only works if the array isen't empty, so we first fill it with undefined values even tho they are undefined, so we can use map() on it.

    this.growthDuration // How long it takes for a plant to grow to the next stage
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
    if(!this.isUIOpen && !storage.isUIOpen && !shop.isUIOpen){ // Only display if no UI is open
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
      textSize(uiW * 0.02); // Set text size relative to window width
      text("Farm", uiX - uiW / 3, uiY - uiH / 2 + 50); // Place text near the top-left side of the UI box
      textSize(16);
      text("Click on a plot to plant or harvest potatoes!", uiX - uiW / 3, uiY - uiH / 2 + 100,200); // Place text below the title
      let growthTime = (this.growthDuration / 1000).toFixed(1); // Convert milliseconds to seconds with one decimal place
      fill(0, 255, 0); // Yellow text for growth time
      text("Growth time: "+growthTime+" seconds", uiX - uiW / 3, uiY - uiH / 2 + 150); // Place text below the instructions

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

    for (let row = 0; row < this.plotsAmountRow; row++) { // Loop through each rows that each holds 5 columns
        for (let col = 0; col < this.plotsAmountCol; col++) { // Loop through each columns that each holds 5 plots
          // Calculate the x and y position of the current plot, by using the startX and startY and the plot size multiplied by the current row and column
          const x = startX + col * this.plotSize; // Calculate the x position of the current plot the loops are on
          const y = startY + row * this.plotSize;  // Calculate the y position of the current plot the loops are on
  
          const plot = this.grid[row][col]; // Get the current plot, that the loops are on

          imageMode(CORNER); // Set image mode to CORNER for positioning
         // Draw the correct image based on the state of the plot
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

setGrowthDuration(level) {
  const baseDuration = 10000; // Base growth duration for level 1
  const decrement = 500; // Decrease in duration per level
  let calculatedDuration = baseDuration;

  // Use a for loop to decrement the duration for each level
  for (let i = 0; i < level; i++) {
    calculatedDuration -= decrement;
  }

  // Ensure the duration does not go below 500ms
  if (calculatedDuration < 500) {
    calculatedDuration = 500;
  }
  
  // Default to 1 if weather is unknown

  // Defines weather effects with a Json object
  // Clear weather has no effect, cloudy weather slows growth, and rain speeds up growth
  const weatherEffects = {
    "clear": 1,    // No effect
    "cloudy": 1.5, // Slower growth
    "rain": 0.5   // Faster growth
  };

  // Get the weather effect based on the current weather, by taking it from the weatherHandler class and getting it in the weatherEffect Json
  const weatherEffect = weatherEffects[weatherHandler.weather] || 1; // Default to 1 if weather is not one of the 3 or not defined

  // Apply the weather effect to the calculated duration by multiplying it
  calculatedDuration *= weatherEffect;

  this.growthDuration = calculatedDuration; // Set the growth duration

  // Debugging
  console.log(`Growth duration set to ${this.growthDuration} ms for level ${level} with the weather effect of ${weatherEffect}.`);
}

// Update the growth of plants over time
// Note: This function is called in sketch draw
updateGrowth() {
  const currentTime = Date.now()

  for (let row = 0; row < this.plotsAmountRow; row++) { // Loop through each rows that each holds 5 columns
    for (let col = 0; col < this.plotsAmountCol; col++) { // Loop through each columns that each holds 5 plots
      const plot = this.grid[row][col] // Get the current plot, that the loops are on

      if (plot.state === 'planted') { // Checks growth only for planted plots
        // Check if enough time has passed to grow to the next stage
        if (currentTime - plot.growthTimer >= this.growthDuration) { // Check if the growth timer has reached the growth duration, by minusing the current time with when the plot was last updated or planted
          if (plot.growthStage < this.plantedPlot.length - 1) { // Check if the plot is not fully grown
            plot.growthStage++; // Grow it to the next growth stage
            plot.growthTimer = currentTime; // And sets the growth timer to the current time, so it restarts the timer for the next growth stage
          } else {
            plot.state = 'harvestable'; // When fully grown, change to harvestable
          }
        }
      }
    }
  }
}

// Handle mouse clicks to interact with the grid
handleMouseClick(mx, my) {
if (this.isUIOpen) {
  const gridWidth = this.plotSize * 5;  // This is the total width of the grid, so we can center it
  const gridHeight = this.plotSize * 5;  // This is the total height of the grid, so we can center it
  const startX = (width - gridWidth) / 2; // Center it horizontally
  const startY = (height - gridHeight) / 2; // Center it vertically

    for (let row = 0; row < this.plotsAmountRow; row++) { // Loop through each rows that each holds 5 columns
        for (let col = 0; col < this.plotsAmountCol; col++) { // Loop through each columns that each holds 5 plots
          // Calculate the x and y position of the current plot, by using the startX and startY and the plot size multiplied by the current row and column
            const x = startX + col * this.plotSize; // Calculate the x position of the current plot the loops are on
            const y = startY + row * this.plotSize;  // Calculate the y position of the current plot the loops are on

          // Check if the mouse is within the plot area, and only do something if it is
          if (mx > x && mx < x + this.plotSize && my > y && my < y + this.plotSize) {
            const plot = this.grid[row][col]; // Get the current plot, that the loops are on

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