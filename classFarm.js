class Farm{
  constructor(x, y, dia, emptyPlot, plantedPlot, harvestablePlot) {
    this.x = x; // Farm's x position
    this.y = y; // Farm's y position
    this.dia = dia; // Interaktions radius
    this.isUIOpen = false; // Variabel til at holde styr på om UI er åben eller lukket

    // Billeder til de forskellige tilstande af plottene
    this.emptyPlot = emptyPlot; // Billede for tomt plot
    this.plantedPlot = plantedPlot; // Billede for plantet plot
    this.harvestablePlot = harvestablePlot; // Billede for høstbart plot

    this.growthDuration // Hvor lang tid det tager for en plante at vokse til næste stadie, afhænger af niveauet og vejret

    this.plotsAmountRow = 5; // Mængde af rækker i gridet
    this.plotsAmountCol = 5; // Mængde af kolonner i gridet
    this.plotSize = 100; // Størrelse af hvert plot i gridet (100x100)

    
    
    // Variabel til at holde styr på gridet, som er en 2D array med arrays og objekter der holder tilstand, grostadie og gro timer
    this.grid = Array(this.plotsAmountRow) // Laver en array med 5 rækker
            .fill() // fill() fylder arrayen med undefined værdier, så vi kan bruge map() på den
              .map(() => // Map() laver en ny array for hver række, som indeholder 5 kolonner (map() er kun muligt hvis arrayen ikke er tom, derfor fylder vi den med undefined værdier)
                Array(this.plotsAmountCol) // Laver en array med 5 kolonner
                .fill() // fill() fylder arrayen med undefined værdier, så vi kan bruge map() på den
                  .map(() => ({ state: 'empty', growthStage: 0, growthTimer: 0 })) // Map() laver et nyt objekt for hver kolonne, som indeholder tilstand, grostadie og gro timer
              ); // Returnerer den nye array med 5 rækker og 5 kolonner, som indeholder objekter med tilstand, grostadie og gro timer
  }

  // isPlayerNearby() tjekker om spilleren er inden for farmens interaktionsradius (Så spilleren kan åbne UI'en ved at trykke på "E" når de er tæt på farmen)
  // Note: dist() er en funktion der beregner afstanden mellem to punkter
  isPlayerNearby(player) {
    const distance = dist(player.x, player.y, this.x, this.y);
    return distance <= this.dia; // Returnerer true hvis spilleren er inden for radius, ellers false
  }

  // toggleUI() skifter UI'en mellem åben og lukket tilstand, når spilleren trykker på "E" tasten
  toggleUI() {
    this.isUIOpen = !this.isUIOpen;
  }

  // display() viser farmens interaktionsradius, hvis ingen UI er åben
  display() {
    if(!this.isUIOpen && !storage.isUIOpen && !shop.isUIOpen){
      fill(0, 255, 0, 50);
      noStroke();
      rectMode(CENTER);
      rect(this.x, this.y, this.dia, this.dia); // Tegner en rectangle omkring farmen, som viser interaktionsradius
    }
  }

 // displayUI() viser UI'en for farmen, hvis den er åben
  displayUI() {
    if (this.isUIOpen) {
      // UI baggrund
      fill(50, 50, 50, 200); // Semi-transparent baggrund
      rectMode(CENTER);
      const uiW = width * 0.8; // Bredde af UI boksen, baseret på vinduets bredde
      const uiH = height * 0.8;// Højden af UI boksen, baseret på vinduets højde
      const uiX = width / 2; // X position af UI boksen
      const uiY = height / 2; // Y position af UI boksen
      rect(uiX, uiY, uiW, uiH); // Tegner UI boksen i midten af vinduet

      // Text inde i UI boksen
      fill(255);
      textAlign(CENTER, CENTER);
      textSize(uiW * 0.02); // Sætter tekststørrelsen baseret på UI boksens bredde
      text("Farm", uiX - uiW / 3, uiY - uiH / 2 + 50);
      textSize(16);
      text("Click on a plot to plant or harvest potatoes!", uiX - uiW / 3, uiY - uiH / 2 + 100,200);
      let growthTime = (this.growthDuration / 1000).toFixed(1); // Laver en variabel der holder på hvor lang tid det tager for en plante at vokse til næste stadie, og skriver det i sekunder runder den til 1 decimal med funktionen toFixed(1)
      fill(0, 255, 0);
      text("Growth time: "+growthTime+" seconds", uiX - uiW / 3, uiY - uiH / 2 + 150); // Viserer hvor lang tid det tager for en plante at vokse til næste stadie i sekunder

      // Viser gridet med plottene (selve farmen)
      this.displayGrid();
    }
  }

  // displayGrid() visualiserer gridet med plottene, som er en 2D array med objekter der holder tilstand, grostadie og gro timer
  displayGrid() {
    
    const gridWidth = this.plotSize * 5; // gridWidth er bredden af gridet, som er 5 plots bredt
    const gridHeight = this.plotSize * 5; // gridHeight er højden af gridet, som er 5 plots højt
    const startX = (width - gridWidth) / 2; // Variabel der holder på x positionen af hvor gridet skal starte med at tegnes, så det er centreret i vinduet
    const startY = (height - gridHeight) / 2; // Variabel der holder på y positionen af hvor gridet skal starte med at tegnes, så det er centreret i vinduet

    for (let row = 0; row < this.plotsAmountRow; row++) { // Looper gennem hver række i gridet, som er 5 plots bredt
        for (let col = 0; col < this.plotsAmountCol; col++) { // Looper gennem hver kolonne i gridet, som er 5 plots højt
          // Hvert plots x og y position beregnes ved at tage startX og startY og tilføje plotSize ganget med den nuværende række og kolonne
          const x = startX + col * this.plotSize; // Regner x positionen af det nuværende plot, som loopsene er på
          const y = startY + row * this.plotSize;  // Regner y positionen af det nuværende plot, som loopsene er på
  
          const plot = this.grid[row][col]; // Laver en variabel der holder på det nuværende plot, som loopsene er på

          imageMode(CORNER); // Sætter billedemodus til CORNER, så billedet tegnes fra dets øverste venstre hjørne
         // Tegner plottene i gridet baseret på deres tilstand
          if (plot.state === 'empty') {
            image(this.emptyPlot, x, y, this.plotSize, this.plotSize); // Tegner tomt plot
          } else if (plot.state === 'planted') {
            image(this.plantedPlot[plot.growthStage], x, y, this.plotSize, this.plotSize); // Tegner plantet plot baseret på grostadiet (grostadiet bestemmer hvilket billede der skal bruges fra plantedPlot arrayet, der er fyldt med billeder af de forskellige grostadier)
          } else if (plot.state === 'harvestable') {
            image(this.harvestablePlot, x, y, this.plotSize, this.plotSize); // Tegner høstbart plot
          }
        }
    }
}

// setGrowthDuration() sætter hvor lang tid det tager for en plante at vokse til næste stadie, baseret på niveauet og vejret
setGrowthDuration(level) {
  let calculatedDuration = 10000; // Startværdi for grotiden i millisekunder (10 sekunder)
  const decrement = 500; // Hvor meget grotiden skal reduceres for hvert niveau gro tid er opgraderet (500 ms)

  // Looper gennem niveauet og reducer grotiden pr. niveau
  for (let i = 0; i < level; i++) {
    calculatedDuration -= decrement;
  }

  // Definerer vejrfaktorerne, som påvirker grotiden med et objekt der indeholder vejrfaktorerne og deres effekter
  const weatherEffects = {
    "clear": 1,    // Ingen effekt
    "cloudy": 1.5, // Langsommere grotid
    "rain": 0.5   // Hurtigere grotid
  };

  // Variabel der holder på vejrfaktoren, som bliver hentet fra weatherHandler objektet, som indeholder vejret i spillet
  const weatherEffect = weatherEffects[weatherHandler.weather] || 1; // Hvis der er en fejl og vejrfaktoren ikke findes, så sætter den den til 1 (ingen effekt)

  // Ganger grotiden baseret på vejrfaktoren
  calculatedDuration *= weatherEffect;
  this.growthDuration = calculatedDuration; // Sætter grotiden til den beregnede værdi

  // Debugging
  console.log(`Growth duration set to ${this.growthDuration} ms for level ${level} with the weather effect of ${weatherEffect}.`);
}

// updateGrowth() opdaterer grostadiet for hver plot i gridet, hvis det er plantet og tiden er gået
updateGrowth() {
  const currentTime = Date.now() // Varibel der holder på den nuværende tid i millisekunder, så vi kan bruge den til at tjekke om tiden er gået for at opdatere grostadiet

  for (let row = 0; row < this.plotsAmountRow; row++) { // Looper gennem hver række i gridet, som er 5 plots bredt
    for (let col = 0; col < this.plotsAmountCol; col++) { // Looper gennem hver kolonne i gridet, som er 5 plots højt
      const plot = this.grid[row][col] // Varibel der holder på det nuværende plot, som loopsene er på

      if (plot.state === 'planted') { // Tjekker om plotten er plantet
        if (currentTime - plot.growthTimer >= this.growthDuration) { // Tjekker om tiden er gået for at opdatere grostadiet, ved at trække gro timeren fra den nuværende tid og tjekke om det er større end grotiden
          if (plot.growthStage < this.plantedPlot.length - 1) { // Tjekker den er færdig med at vokse, ved at tjekke om grostadiet er mindre end længden af plantedPlot arrayet minus 1 (da arrayet starter fra 0)
            plot.growthStage++; // Sætter grostadiet til det næste stadie
            plot.growthTimer = currentTime; // Opdaterer gro timeren til den nuværende tid, så vi kan bruge den til at tjekke om tiden er gået for at opdatere grostadiet igen
          } else {
            plot.state = 'harvestable'; // Sætter tilstanden til høstbart, hvis grostadiet er færdigt med at vokse
          }
        }
      }
    }
  }
}

// handleMouseClick() tjekker om spilleren klikker på et plot i gridet, og opdaterer tilstanden og grostadiet for det plot
handleMouseClick(mx, my) {
if (this.isUIOpen) { // Tjekker om UI'en er åben, så man kan interagere med plottene
  const gridWidth = this.plotSize * 5;  // gridWidth er bredden af gridet, som er 5 plots bredt
  const gridHeight = this.plotSize * 5;  // gridHeight er højden af gridet, som er 5 plots højt
  const startX = (width - gridWidth) / 2; // Variabel der holder på x positionen af hvor gridet er startet med blevet tegnes så vi kan finde det specikke plot
  const startY = (height - gridHeight) / 2; // Variabel der holder på y positionen af hvor gridet er startet med blevet tegnes så vi kan finde det specikke plot

    for (let row = 0; row < this.plotsAmountRow; row++) { // Looper gennem hver række i gridet, som er 5 plots bredt
        for (let col = 0; col < this.plotsAmountCol; col++) { // Looper gennem hver kolonne i gridet, som er 5 plots højt
          // Hvert plots x og y position beregnes ved at tage startX og startY og tilføje plotSize ganget med den nuværende række og kolonne
          const x = startX + col * this.plotSize; // Regner x positionen af det nuværende plot, som loopsene er på
          const y = startY + row * this.plotSize;  // Regner y positionen af det nuværende plot, som loopsene er på

          // Tjekker om musen er inden for plottet loopnse er på, ved at tjekke om musens x og y position er inden for plottet
          if (mx > x && mx < x + this.plotSize && my > y && my < y + this.plotSize) {
            const plot = this.grid[row][col]; // Varibel der holder på det nuværende plot, som loopsene er på

            // Tjekker om plotten er tom eller høstbar, og opdaterer tilstanden og grostadiet for det plot hvis det er
            if (plot.state === 'empty') {
              plot.state = 'planted'; // Sætter tilstanden til plantet
              plot.growthStage = 0; // Sætter grostadiet til 0 (startstadiet)
              plot.growthTimer = Date.now(); // Starter gro timeren til den nuværende tid, så vi kan bruge den til at tjekke om tiden er gået for at opdatere grostadiet
            } else if (plot.state === 'harvestable') {
              gameController.addPotatoes(1); // Tilføjer 1 kartoffel, når de høster en kartoffel
              plot.state = 'empty'; // Sætter tilstanden til tomt igen
              plot.growthStage = 0; // Genstarter grostadiet til 0 (startstadiet)
              plot.growthTimer = 0; // Genstarter gro timeren til 0, da der ikke er nogen plante i plottet
            }
            // Stopper loopen når vi har fundet det plot vi vil interagere med, så vi ikke opdaterer flere plots på en gang
          return;
          }
        }
      }
    }
  }
}