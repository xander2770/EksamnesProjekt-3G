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
          //debugging
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