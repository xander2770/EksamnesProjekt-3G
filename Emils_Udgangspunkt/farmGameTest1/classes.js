
// The class that controls the player and its animations
class Player{
    constructor(x, y, width, height, framesRight, framesLeft, idleFrame){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    //Animation variables
    this.framesRight = framesRight; // Array of animation frames for moving right
    this.framesLeft = framesLeft; // Array of animation frames for moving left
    this.idleFrame = idleFrame; // Image for the idle frame
    this.currentFrames = framesRight; // Default to right-facing frames
    this.currentFrame = 0; // Index of the current frame
    this.animationSpeed = 10; // Speed of animation (lower is faster)
    this.frameCounter = 0; // Counter to control frame switching
    this.isAnimating = false; // Flag to control animation
    }

    move(dx, direction) {
      // Prevent moving out of the screen
      const newX = this.x + dx;

        if (newX >= 0+this.width/2 && newX + this.width/2 <= windowWidth) {
          this.x = newX;
        }

        // Switch animation frames based on direction
        if (direction === "left") {
          this.currentFrames = this.framesLeft;
        } else if (direction === "right") {
          this.currentFrames = this.framesRight;
        }
    }
    
    
      animate() {
        this.isAnimating = true;
        this.frameCounter++; // Increment the frame counter every time aniamte() is called. and it is called every frame, in game, cause of draw
        if (this.frameCounter >= this.animationSpeed) { // Check if it's time to switch frames. It is if the frameCounter is greater than or equal to the animationSpeed
            if (this.currentFrame + 1 >= this.currentFrames.length) { // If the last frame is reached
            this.currentFrame = 0; // Reset to the first frame
            } else {
            this.currentFrame += 1; // Move to the next frame
            }
          this.frameCounter = 0; // Resets the frame counter when the frame is changed
        }
      }
    
      stopAnimation() {
        this.isAnimating = false;
        this.currentFrame = 0; // Reset to the first frame
      }

      display() {
        imageMode(CENTER);
        if (this.isAnimating) {
          // Display the current animation frame
          image(this.currentFrames[this.currentFrame], this.x, this.y, this.w, this.h);
        } else {
          // Display the idle frame when not animating
          image(this.idleFrame, this.x, this.y, this.w, this.h);
        }
      }
}

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

// The class that controls the game after loading in
class GameController {
  constructor() {
    this.coins
    this.potato
    this.autoSaveInterval = null;
    this.saveNotification = "";
    this.saveNotificationTimeout = null;
  }

  // To update coins and potatoes
  updateCoinsAndPotatoes(coins, potato) {
    this.coins = coins;
    this.potato = potato;
  }

  // To add coins
  addCoins(amount) {
    this.coins += amount;
  }

  // To add potatoes
  addPotatoes(amount) {
    this.potato += amount;
  }

  // Save progress to Firebase
  saveProgress(username) {
    if (username) {
      database.collection("eksgameTest").doc("usernames").update({
        [username]: {
          coins: this.coins,
          potato: this.potato
        }
      }).then(() => {
        console.log("Saved to Firebase for user "+username+": Coins = "+this.coins+", Potatoes = "+this.potato);
        
        // Show the save notification
        this.saveNotification = "Progress saved!";
        if (this.saveNotificationTimeout) { // clear timeout if it exists, to avoid duplicates
          clearTimeout(this.saveNotificationTimeout); // Clear any existing timeout
        }
        this.saveNotificationTimeout = setTimeout(() => {
          this.saveNotification = ""; // Clear the notification after 3 seconds
        }, 3000);

      }).catch((error) => {
        console.error("Error saving progress:", error);
      });
    } else {
      alert("No username found. Please log in first.");
    }
  }

  // Start auto-saving every 30 seconds
  startAutoSave(username) {

    // Clear interval if there is already existing one, to avoid duplicates running
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
      console.log("Cleared existing auto-save interval.");
    }

    // Set up an interval to auto-save every 60 seconds (60000 milliseconds). Intervals keep running again and again every set seconds, until cleared
    this.autoSaveInterval = setInterval(() => {
      console.log("Auto-saving progress...");
      this.saveProgress(username);
    }, 60000);
  }

  // Stop auto-saving
  stopAutoSave() {
    if (this.autoSaveInterval) { // Making sure the interval is not null/nothing, just in case something goes wrong
      clearInterval(this.autoSaveInterval);
      this.autoSaveInterval = null;
    }
  }

}