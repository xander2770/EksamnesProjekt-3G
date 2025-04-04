
// classStorage.js
class Storage {
    constructor(x, y, maxPotatoes) {
       this.x = x;
       this.y = y;
       this.maxPotatoes = maxPotatoes;
       this.storedPotatoes = 0;
       this.isUIOpen = false;
    }
  
    addPotatoes(amount) {
      if (this.storedPotatoes + amount <= this.maxPotatoes) {
        this.storedPotatoes += amount;
        return true; // success
      }
      return false; // ikke plads nok
    }

    display(){
    }

    removePotatoes(amount) {
      if (this.storedPotatoes >= amount) {
        this.storedPotatoes -= amount;
        return amount;
      }
      return 0; // ikke nok at tage
    }
  
    getStoredPotatoes() {
      return this.storedPotatoes;
    }
  
    getMaxCapacity() {
      return this.maxPotatoes;
    }
    toggleUI() {
        this.isUIOpen = !this.isUIOpen;
    }
      
     isPlayerNearby(player) {
       const distance = dist(player.x, player.y, this.x, this.y);
       return distance <= 150; // Afstand spiller skal være indenfor
     }
      
     displayUI() {
       if (this.isUIOpen) {
         fill(50, 50, 50, 200); // Baggrund til UI
         rectMode(CENTER);
         rect(width / 2, height / 2, 800, 600); // Grå UI-box
     
         fill(255);
         textAlign(CENTER, CENTER);
         textSize(20);
         text("Storage UI", width / 2, height / 2 - 100);

        storageCountText.html("Storage: " + storage.getStoredPotatoes() + " potatoes"); // Update the text with the current potato count
       }
    }      
}

  