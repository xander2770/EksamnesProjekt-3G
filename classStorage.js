
// classStorage.js
class Storage {
    constructor(x, y, maxPotatoes, dia) {
      // Position på skærmen
       this.x = x;
       this.y = y;

        // Maksimalt antal kartofler der kan være i storage
       this.maxPotatoes = maxPotatoes;

       // Aktuelt antal kartofler i storage
       this.storedPotatoes = 0;

       // Sætter Ui'et til falsk, så det ikke vises i starten
       this.isUIOpen = false;

       // Radius for hvor tæt spilleren skal være for at åbne Ui'et
       this.dia = dia

       // Sætter delay i deliver og collect knapperne, så de ikke kan spammes
       this.delayAmount = 5 
       this.delayCurrent = 0

       // Variable til image
       this.imageToDisplay;
    }

    // Viser områder hvor storage kan åbnes
    display() {
      if(!this.isUIOpen && !farm.isUIOpen && !shop.isUIOpen){
      fill(0, 255, 0, 50);
      noStroke();
      rectMode(CENTER);
      rect(this.x, this.y, this.dia, this.dia); // Tegner interaktionsområdet
      }
    }

    // Viser UI'et når spilleren er tæt nok på storage og trykker på E
    displayUI() {
      if (this.isUIOpen) {
      
        // UI background
        fill(50, 50, 50, 200); // Semi-transparant mørk baggrund
        rectMode(CENTER);
        const uiW = width * 0.8; // Bredde af UI-boksen
        const uiH = height * 0.8;// Højde af UI-boksen 
        const uiX = width / 2; //Position - Ignore Same as above
        const uiY = height / 2; //Position - Ignore Same as above
        rect(uiX, uiY, uiW, uiH);
      
        // Tekst der viser hvor mange kartofler der er i storage
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(20);
        text("Storage", uiX, uiY - uiH / 2 + 50);

        text("Storage: " + this.storedPotatoes + "/" + this.maxPotatoes + " potatoes", uiX, uiY - uiH / 2 + 100); // Update the text with the current potato count
      
        // Beregner hvor mange bokse der skal vises og hvordan de skal fordeles
        const boxSize = 20;
        const numBoxes = this.maxPotatoes / boxSize;
        const boxesPerRow = 4; // Hvor mange kasser du vil have per række
        const spacingX = 220; // Afstand mellem kasser (vandret)
        const spacingY = 180; // Afstand mellem rækker (lodret)
        
        // Loop der tegner kasserne baseret på hvor mange kartofler der er i storage
        for (let i = 0; i < numBoxes; i++) {
          let potatoesInBox = this.storedPotatoes - (i * boxSize);
          potatoesInBox = constrain(potatoesInBox, 0, boxSize);
        
          // Beregn hvor fuld kassen er
          const fullness = potatoesInBox / boxSize;
        
          // Vælg billedet baseret på hvor fuld kassen er
          let boxImage;
          if (fullness === 0) {
            boxImage = emptyImage;
          } else if (fullness <= 0.25) {
            boxImage = quarterFullImage;
          } else if (fullness <= 0.5) {
            boxImage = halfFullImage;
          } else if (fullness <= 0.75) {
            boxImage = threeQuarterFullImage;
          } else {
            boxImage = fullImage;
          }
        
          const row = Math.floor(i / boxesPerRow); // Holder styr på hvor mange rækker der er
          const col = i % boxesPerRow; // Holder styr på hvor mange kasser der er i rækken
        
          // Beregn positionen for kassen
          const x = uiX + (col - (boxesPerRow - 1) / 2) * spacingX; 
          const y = uiY - 50 + row * spacingY; 
        
          imageMode(CENTER);
          image(boxImage, x, y, 200, 200);
        }
        

      // Tegner "Deliver"-knappen som en grøn firkant
      fill(0, 200, 0); 
      rectMode(CORNER);
      rect(170, 450, 100, 40); 

      // Tegner "Collect"-knappen som en blå firkant
      fill(0, 0, 200); 
      rect(170, 520, 100, 40);

      // Skriver teksten "Deliver" og "Collect" inde i knapperne
      fill(255);
      textSize(16);
      textAlign(CENTER, CENTER);
      text("Deliver", 220, 470); 
      text("Collect", 220, 540); 


      //Tilføjer delay til hvor hurtigt du kan levere og samle kartofler, det virker ved frames
      // delayCurrent tæller op hver frame og når den når delayAmount, så kan du trykke på knapperne igen 
      this.delayCurrent++ 
      if(this.delayCurrent >= this.delayAmount){
          // Tjekker om musen er trykket ned og over knappen "Deliver"
          if (mouseIsPressed && mouseX > 170 && mouseX < 270 && mouseY > 450 && mouseY < 490) {
            this.deliverPotatoes(); // Leverer kartofler
          }

            // Tjekker om musen er trykket ned og over knappen "Collect"
            if (mouseIsPressed && mouseX > 170 && mouseX < 270 && mouseY > 520 && mouseY < 560) {
              this.collectPotatoes(); // Leverer kartofler
          }
          this.delayCurrent = 0 // Resets delayCurrent, så den kan tælle op igen
          }
      }
   }
    // Åbner og lukker UI'et 
    toggleUI() {
        this.isUIOpen = !this.isUIOpen;
    }
      
    // Tjekker om spilleren er tæt nok på storage til at åbne UI'et
    isPlayerNearby(player) {
       const distance = dist(player.x, player.y, this.x, this.y);
       return distance <= 150; // Afstand spiller skal være indenfor
    }    

    // Afleverer kartofler til storage og tjekker om der er plads i storage
    deliverPotatoes() {
      let amount = int(deliverInput.value()); // Henter værdien fra inputfeltet og konverterer den til et heltal
    
      // Tjekker om værdien er gyldig og om spilleren har nok kartofler til at aflevere
      if (gameController.potato >= amount ) {
        if (this.storedPotatoes + amount <= this.maxPotatoes) {
          gameController.potato -= amount;
          this.storedPotatoes += amount;
        } 
      } 
    }
    // Afhenter kartofler fra storage og tjekker om der er nok kartofler i storage
    collectPotatoes() {
      let amount = int(collectInput.value()); // Henter værdien fra inputfeltet og konverterer den til et heltal
      
      // Tjekker om værdien er gyldig og om der er nok kartofler i storage
      if (amount > 0 && this.storedPotatoes >= amount) {
        gameController.potato += amount;
        this.storedPotatoes -= amount;
      }
    }

    // Justerer hvor mange kartofler der kan være i storage baseret på opgraderingsniveauet
    setStorageCapacity(level) {
      const baseCapacity = 20; // Basislagerkapacitet starter på 20 kartofler
      let calculatedCapacity = baseCapacity; 
    
      // For hver opgradering, fordobles lagerkapaciteten
      for (let i = 1; i <= level; i++) {
        calculatedCapacity *= 2; // Fordobler lagerkapaciteten for hver opgradering
      }
    
      // Opdaterer maxPotatoes med den beregnede kapacitet
      this.maxPotatoes = calculatedCapacity;
      console.log(`Storage capacity set to ${this.maxPotatoes} for level ${level}`);
    }
}
