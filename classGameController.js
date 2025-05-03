// The class that controls the game after loading in
class GameController {
    constructor() {
      this.coins
      this.potato
      this.storageLevel
      this.growthLevel
      this.autoSaveInterval = null;
      this.saveNotification = "";
      this.saveNotificationTimeout = null;

      // Notifications for potatoes
    this.notifications = [];
    }
  
    // To update coins and potatoes
    loadCoinsAndPotatoes(coins, potato, storageLevel, growthLevel, storedPotatoes) {
      this.coins = coins;
      this.potato = potato;
      this.storageLevel = storageLevel; // Store the storage level
      this.growthLevel = growthLevel; // Store the grow level

      if(storedPotatoes){ //If storedPotatoes is not null, then set the storedPotatoes to the storage class
      storage.storedPotatoes = storedPotatoes
    }
    }

    loadUpgradeLevels(storageLevel, growthLevel) {
      this.storageLevel = storageLevel; // Store the storage level
      this.growthLevel = growthLevel; // Store the grow level

      farm.setGrowthDuration(this.growthLevel); // Set the growth duration based on the new growth level
      storage.setStorageCapacity(this.storageLevel);
      shop.setUpgradeCostBasedOnLevel(this.storageLevel,this.growthLevel) // Set the storage capacity based on the new level
    }

  
    // To add coins
    addCoins(amount) {
      this.coins += amount;

      // Add a notification for the added  coins
      if (this.coins == 1) {
        this.addNotification("+ " + amount + " Coin", "Coin");
      }else if (this.coins > 1) {
        this.addNotification("+ " + amount + " Coins", "Coin");
      }
    }
  
    // To add potatoes
    addPotatoes(amount) {
      this.potato += amount;

      // Add a notification for the added potatoes
      if (this.potato == 1) {
        this.addNotification("+ " + amount + " Potato", "Potato");
      }else if (this.potato > 1) {
        this.addNotification("+ " + amount + " Potatoes", "Potato");
      }
    
    }

    // Add a notification
  addNotification(text, type) {
    // Generate random offsets within a square bounding box
    const offsetX = random(-50, 50); // Random x offset
    const offsetY = random(-50, 50); // Random y offset

    this.notifications.push({
      x: width * 0.8 + offsetX, // Random position within the radius
      y: height / 2 + offsetY,
      text: text,
      time: Date.now(), // Timestamp for the notification
      speed: random(1, 2), // Random upwards speed
      type: type
    });
  }

  // Display notifications
  displayNotifications() {
    // Filter out notifications older than 3 seconds - Filter works like a for loop, but it creates a new array with the elements that are true in the function
    this.notifications = this.notifications.filter(noti => Date.now() - noti.time < 3000); //Date.now() takes the current time, so when the time the notification was created is longer than 3 seconds ago, it is removed

    // Display and update each notification
    for (const notification of this.notifications) {
      if (notification.type === "Potato") {
        fill(255, 165, 0); // Orange text for potatoes
      } else if (notification.type === "Coins") {
        fill(255, 215, 0); // Gold text for coins
      }
      textSize(16);
      textAlign(CENTER, CENTER);
      text(notification.text, notification.x, notification.y);

      // Move the notification upwards
      notification.y -= notification.speed;
    }
  }

  
    // Save progress to Firebase
    saveProgress(username) {
      if (username) {
        database.collection("eksgameTest").doc("usernames").update({
          [username]: {
            coins: this.coins,
            potato: this.potato,
            storageLevel: this.storageLevel, // Save the storage level
            growthLevel: this.growthLevel, // Save the growth level
            storedPotatoes: storage.storedPotatoes
          }
        }).then(() => {
          //debugging
          console.log(`Saved to Firebase for user ${username}: Coins = ${this.coins}, Potatoes = ${this.potato}, Stored Potatoes = ${storage.storedPotatoes}`);
          
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
      }, 120000);
    }
  
    // Stop auto-saving
    stopAutoSave() {
      if (this.autoSaveInterval) { // Making sure the interval is not null/nothing, just in case something goes wrong
        clearInterval(this.autoSaveInterval);
        this.autoSaveInterval = null;
      }
    }
  
  }