class Farm{
  constructor(x, y, dia) {
    this.x = x; // Farm's x position
    this.y = y; // Farm's y position
    this.dia = dia; // Interaction radius
    this.isUIOpen = false; // Flag to track if the UI is open

    // Mini-game grid (3x3)
    this.grid = Array(5).fill().map(() => Array(5).fill('empty')); // Initialize grid with 'empty'
    this.cellSize = 100; // Size of each grid cell
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
    // UI background
    fill(50, 50, 50, 200); // Semi-transparent dark background
    rectMode(CENTER);
    const uiWidth = width * 0.8; // Width of the UI box - Ignore it cant find the width and height of the screen. Still can and works
    const uiHeight = height * 0.8;// Height of the UI box 
    const uiX = width / 2; //Position - Ignore Same as above
    const uiY = height / 2; //Position - Ignore Same as above
    rect(uiX, uiY, uiWidth, uiHeight);

    // Text inside the UI
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(20);
    text("Farm UI", uiX, uiY - uiHeight / 2 + 50); // Place text near the top of the UI box
    textSize(16);
    text("Click on a grid cell to plant or harvest potatoes!", uiX, uiY - uiHeight / 2 + 100); // Place text below the title

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

            // Draw the grid cell
            stroke(255);
            noFill();
            rectMode(CORNER);
            rect(x, y, this.cellSize, this.cellSize); // Inset an image instead of a rectangle. (Image of a plot)

            // Display the state of the cell
            if (this.grid[row][col] === 'planted') {
                fill(0, 255, 0); // Green for planted
                ellipse(x + this.cellSize / 2, y + this.cellSize / 2, 20);
            } else if (this.grid[row][col] === 'harvestable') {
                fill(255, 165, 0); // Orange for harvestable
                ellipse(x + this.cellSize / 2, y + this.cellSize / 2, 20);
            }
        }
    }
    noStroke();
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
                // Interact with the cell based on its state
                if (this.grid[row][col] === 'empty') {
                    this.grid[row][col] = 'planted'; // Plant a potato
                } else if (this.grid[row][col] === 'planted') {
                    this.grid[row][col] = 'harvestable'; // Potato grows
                } else if (this.grid[row][col] === 'harvestable') {
                    this.grid[row][col] = 'empty'; // Harvest the potato
                }
            }
        }
    }
  }
}
}