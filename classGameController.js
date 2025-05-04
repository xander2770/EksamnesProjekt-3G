// Classen der styrer det mesate af spillet, som coins, potatoes og storage level, efter at load funktionen er blevet kaldt.
class GameController {
    constructor() {
      this.coins
      this.potato
      this.storageLevel
      this.growthLevel
      this.autoSaveInterval = null; // Variabel til at gemme intervallet for auto-save, så den auto-save kan stoppes
      this.saveNotification = ""; // Notifikations tekst til at vise, når fremskridtene er gemt
      this.saveNotificationTimeout = null; // Timeout for at skjule notifikationen efter 3 sekunder

      // Notifikations array, der gemmer alle notifikationer, der skal vises på skærmen
      this.notifications = [];
    }
  
    // loadCoinsPotatoesAndLevels() funktionen, kaldes spillet går igang. Den indlæser coins, potatoes og levels fra firebase, og gemmer dem i klassen
    loadCoinsPotatoesAndLevels(coins, potato, storageLevel, growthLevel, storedPotatoes) {
      this.coins = coins;
      this.potato = potato;
      this.storageLevel = storageLevel;
      this.growthLevel = growthLevel;

      if(storedPotatoes){ // Hvis der er gemte opbeverede kartofler i firebase, så gem dem i storage klassen
      storage.storedPotatoes = storedPotatoes
    }

      farm.setGrowthDuration(this.growthLevel); // Sætter gro hastigheden i farm klassen, baseret på growthLevel.
      storage.setStorageCapacity(this.storageLevel); // Sætter opbevaringskapaciteten i storage klassen, baseret på storageLevel.
      shop.setUpgradeCostBasedOnLevel(this.storageLevel,this.growthLevel) // Sætter opgraderingsprisen i shop klassen, baseret på storageLevel og growthLevel.
    }

    // addCoins() funktionen tilføjer coins til coins variablen i klassen, og kalder addNotification() funktionen for at vise en notifikation på skærmen
    addCoins(amount) {
      this.coins += amount;

      if (this.coins == 1) { // Hvis coins er 1, så vis "+ 1 Coin" i notifikationen
        this.addNotification("+ " + amount + " Coin", "Coin");
      }else if (this.coins > 1) { // Hvis coins er større end 1, så vis "+ x Coins" i notifikationen
        this.addNotification("+ " + amount + " Coins", "Coin");
      }
    }
  
    // addPotatoes() funktionen tilføjer potatoes til potato variablen i klassen, og kalder addNotification() funktionen for at vise en notifikation på skærmen
    addPotatoes(amount) {
      this.potato += amount;

      if (this.potato == 1) { // Hvis potatoes er 1, så vis "+ 1 Potato" i notifikationen
        this.addNotification("+ " + amount + " Potato", "Potato");
      }else if (this.potato > 1) { // Hvis potatoes er større end 1, så vis "+ x Potatoes" i notifikationen
        this.addNotification("+ " + amount + " Potatoes", "Potato");
      }
    }

  // addNotification() funktionen tilføjer en notifikation til notifications arrayet, og sætter positionen for notifikationen til at være tilfældig indenfor et område omkring skærmen.
  addNotification(text, type) {
    const offsetX = random(-50, 50); // Tilfældig x offset
    const offsetY = random(-50, 50); // Tilfældig y offset

    this.notifications.push({ // Tilføjer notifikationen til notifications arrayet, som et objekt med x, y, text og hvornår den blev lavet
      x: width * 0.8 + offsetX, // Tilfældig x position, så den ikke altid er i samme position
      y: height / 2 + offsetY, // Tilfældig y position
      text: text,
      time: Date.now(), // Tidspunktet for hvornår notifikationen blev lavet, så den kan fjernes efter 3 sekunder
      speed: random(1, 2), // Tilfældig hastighed for at flytte notifikationen opad
      type: type // Type af notifikation, så den kan have forskellige farver
    });
  }

  // displayNotifications() funktionen viser notifikationerne på skærmen, og fjerner dem efter 3 sekunder. Den flytter også notifikationerne opad, så de ikke overlapper hinanden og ser sejere ud.
  displayNotifications() {
    // bruger .filter() metoden til at fjerne notifikationer fra arrayet, der er ældre end 3 sekunder, ved at sammenligne den nuværende tid med tiden for hvornår notifikationen blev lavet
    this.notifications = this.notifications.filter(noti => Date.now() - noti.time < 3000);

    // Looper igennem alle notifikationerne, for at vise dem hver især på skærmen og flytte dem opad
    for (const notification of this.notifications) {
      if (notification.type === "Potato") {
        fill(255, 165, 0); // Orange tekst for potatoes
      } else if (notification.type === "Coins") {
        fill(255, 215, 0); // Guld tekst for coins
      }
      textSize(16);
      textAlign(CENTER, CENTER);
      text(notification.text, notification.x, notification.y);

      // Flytter notifikationen opad med deres egen tilfældige hastighed
      notification.y -= notification.speed;
    }
  }

  
    // saveProgress() funktionen gemmer fremskridtene i firebase, ved at opdatere usernameds coins, potatoes og levels i firebase databasen. Den kaldes når brugeren trykker på "Save" knappen, autoSave() funktionen eller når spillet lukkes.
    saveProgress(username) {
      if (username) { // Tjekker om der er et username, hvis ikke så vis en alert
        //database er instansen der kalder forbindelsen til fireBase - funktionerne collection, doc og update() gør det muligt at opdatere data det rigtige sted 
        database.collection("eksgameTest").doc("usernames").update({
          [username]: {
            coins: this.coins, // Gemmer coins
            potato: this.potato, // Gemmer kartoflerne
            storageLevel: this.storageLevel, // Gemmer opbevarings leveled
            growthLevel: this.growthLevel, // Gemmer gro leveled
            storedPotatoes: storage.storedPotatoes // Gemmer opbevarede kartofler i storage klassen
          }
        }).then(() => { // Når opdateringen er færdig, så kør denne funktion
          //debugging
          console.log(`Saved to Firebase for user ${username}: Coins = ${this.coins}, Potatoes = ${this.potato}, Stored Potatoes = ${storage.storedPotatoes}`);
          
          // Viser notifikationen i 3 sekunder ved at sætte teksten til "Progress saved!" for 3 sekunder
          this.saveNotification = "Progress saved!";
          if (this.saveNotificationTimeout) { // Ryd timeout, hvis den findes, for at undgå dubletter
            clearTimeout(this.saveNotificationTimeout);
          }
          this.saveNotificationTimeout = setTimeout(() => { // Timeout kører 1 gang, i det her tilfælde efter 3 sekunder
            this.saveNotification = ""; // Rydder notifikationen efter 3 sekunder
          }, 3000);
  
        }).catch((error) => { // Hvis der er en fejl, så vis den i console loggen
          console.error("Error saving progress:", error);
        });
      } else {
        alert("No username found. Please log in first."); // Hvis der ikke er et username, så vis en alert
      }
    }
  
    // startAutoSave() funktionen starter auto-save funktionen, der gemmer fremskridtene hver 60 sekunder. Den kaldes når brugeren logger ind, og auto-save funktionen er sat til at køre i baggrunden.
    startAutoSave(username) {
  
      // Hvis der allerede er en auto-save interval, så ryd den for at undgå dubletter
      if (this.autoSaveInterval) {
        clearInterval(this.autoSaveInterval);
        console.log("Cleared existing auto-save interval.");
      }
  
      // Sætter auto-save intervallet til at køre hver 60 sekunder (60000 ms) - Interval kører igen og igen, indtil det stoppes
      this.autoSaveInterval = setInterval(() => {
        console.log("Auto-saving progress...");
        this.saveProgress(username);
      }, 60000);
    }
  
    // stopAutoSave() funktionen stopper auto-save funktionen, hvis den kører. Den kaldes når brugeren logger ud
    stopAutoSave() {
      if (this.autoSaveInterval) { // Tjekker om auto-save intervallet overhoved kører
        clearInterval(this.autoSaveInterval);
        this.autoSaveInterval = null;
      }
    }
  }