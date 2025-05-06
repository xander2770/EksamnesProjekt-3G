//HUSK: Når du bruger .set på noget i firebase så sletter den alt og setter den til det du siger. Brug .update for at adde noget

let gameState = "start"; // Game state: "start" eller "play", baseret på om spillet er i startskærmen eller i spillet

let gameController // Klassen gameController
let farm // Klassen farm
let player // Klassen player
let storage // Klassen storage
let shop // Klassen shop
let weather // Klassen weather

let usernameInput;
let username = ""; // Gem det nuværende username

let saveButton;
let saveNotification = ""; // Variabel til at vise gemme notifikationen
let saveNotificationTimeout; // Variabel til at skjule notifikationen efter 3 sekunder
let autoSaveInterval;

let skinFramesRight = []; // Array for højre bevægelse animation frames
let skinFramesLeft = []; // Array for venstre bevægelse animation frames
let skinIdleFrame
let startScreen

let map
let mapClear
let mapCloudy
let mapRain

//Indstillinger variabler
let settingsIcon; // Variabel til indstillingsikonet
let settingsAngle = 0; // Vinkel til rotation af indstillingsikonet
let isRotating = false; // Til at styre om ikonet roterer eller ej
let rotationTarget = 0; // Den vinkel, ikonet skal rotere til

//Farm UI plot billede variabler
let potatoEmptyPlot
let potatoPlantedPlot = [] // Array til at gemme billederne af de forskellige gro stadier når en kartoffel er plantet
let potatoHarvestablePlot

function preload(){
    // Load player animation frames for moving right
  for (let i = 1; i <= 4; i++) { // Assuming 4 frames for the right animation
    skinFramesRight.push(loadImage(`images/PlayerFrames/ØlstykkeFarmManRight${i}_256x256.png`));
    skinFramesLeft.push(loadImage(`images/PlayerFrames/FarmManLeft${i}_256x256.png`));
  }
    // Load the idle frame
    skinIdleFrame = loadImage('images/PlayerFrames/ØlstykkeFarmManIdle_256x256.png');
    
    
    startScreen = loadImage('images/StartScreen1 240x135.png');

    // Load the map image
    mapClear = loadImage('images/Chatimages/ChatGPT Image1.png');
    mapCloudy = loadImage('images/Chatimages/ChatGPT Image2.png');
    mapRain  = loadImage('images/Chatimages/ChatGPT Image3.png');
   

     // Load the settings icon image
    settingsIcon = loadImage('images/settingsIcon_128x128.png');

    //Farm UI images
    potatoEmptyPlot = loadImage('images/FarmImages/potatoEmptyPlot.png');
    potatoHarvestablePlot = loadImage('images/FarmImages/potatoHarvestablePlot.png');
    for (let i = 1; i <= 3; i++) {
        potatoPlantedPlot.push(loadImage(`images/FarmImages/potatoPlantedPlot${i}.png`)); 
    }

    emptyImage = loadImage('images/StorageImages/Empty_Box.png');
    quarterFullImage = loadImage('images/StorageImages/Stadie_1.png');
    halfFullImage = loadImage('images/StorageImages/Stadie_2.png');
    threeQuarterFullImage = loadImage('images/StorageImages/Stadie_3.png');
    fullImage = loadImage('images/StorageImages/Stadie_4.png');
}

function setup() {
  weatherHandler = new vejr
  
  createCanvas(windowWidth-1, windowHeight-1);
  frameRate(60); // Set the frame rate to 60 FPS

  // Lav username input feltet og start knappen
  usernameInput = createInput().attribute("placeholder", "Enter username");
  usernameInput.position(width / 2 - 100, height / 2 - 20);

  // Start knappen til at starte spillet
  startButton = createButton("Start Game").position(width / 2 - 50, height / 2 + 20).mousePressed(startGame);



  // Lav knapperne til at gemme fremskridt og logge ud (de er skjult i starten)
  saveButton = createButton("Save Progress").position(width - 200, 100).mousePressed(() => {
    gameController.saveProgress(username);
  });
  saveButton.style("background-color", "#4CAF50");
  saveButton.style("color", "white");
  saveButton.style("padding", "10px 20px");
  saveButton.style("border", "none");
  saveButton.style("border-radius", "5px");
  saveButton.style("font-size", "16px");
  saveButton.hide();

  logoutButton = createButton("Logout").position(width - 200, 150).mousePressed(logout);
  logoutButton.style("background-color", "#f44336");
  logoutButton.style("color", "white");
  logoutButton.style("padding", "10px 20px");
  logoutButton.style("border", "none");
  logoutButton.style("border-radius", "5px");
  logoutButton.style("font-size", "16px");
  logoutButton.hide();


  // Input til antal kartofler der skal afleveres
  deliverInput = createInput("1", "number");
  deliverInput.position(170, 460);
  deliverInput.size(40);
  deliverInput.hide();

  // Input til antal kartofler der skal hentes
  collectInput = createInput("1", "number");
  collectInput.position(170, 530);
  collectInput.size(40);
  collectInput.hide();

  // Tekst til at vise kartoffel-status
  storageCountText = createP();
  storageCountText.position(200, 300);
  storageCountText.hide();
}

function draw() {
  if (gameState === "start") {
    drawStartScreen();
  } else if (gameState === "play") {
    drawGame();
  }
}

function drawStartScreen() {
  imageMode(CENTER);
  image(startScreen, width/2, height/2, width, height)
  textAlign(CENTER);
  textSize(32);
  fill(255);
  text("Welcome to the Farm Game!", width / 2, height / 2 - 60);
  textSize(16);
  text("Enter your username to start.", width / 2, height / 2 - 40);
}

function drawGame() {
  imageMode(CENTER);
  image(map, width/2, height/2, width, height)  // Vis baggrunden

  // Vis brugerens data
  textSize(16);
  fill(0);
  text("User: "+ username, 90, 30); // Display the username
  text("Coins: " + gameController.coins, 90, 50);
  text("Potatoes in Pocket: " + gameController.potato, 90, 70);
  text("Storage Level: " + gameController.storageLevel, 90, 90);
  text("Growth Level: " + gameController.growthLevel, 90, 110);

  // Vis gemme notifikationen hvis den er eksistere
  if (gameController.saveNotification) {
    textSize(20);
    fill(0, 255, 0); // Green color for the notification
    textAlign(CENTER);
    text(gameController.saveNotification, width / 2, 30); // Display at the top center of the screen
  }

//Indstillinger:
  // Vis indstillingsikonet i øverste højre hjørne
  // Vi bruger push og pop til at gemme og gendanne transformations tilstande (hvor 0,0 er), så vi kan rotere ikonet uden at påvirke andre elementer
  push();
  translate(width - 50, 50);  // Translate flytter 0,0 punktet til det ønskede sted, så vi kan rotere ikonet omkring dets center
  rotate(radians(settingsAngle)); // Rotere ikonet med den ønskede vinkel
  imageMode(CENTER);
  image(settingsIcon, 0, 0, 50, 50); // Tegner ikonet
  pop(); // Pop gendanner transformations tilstande (0,0) til det de var før vi kaldte push (Som er originalt i venstre hjørne)

  // Rotation for indstillingsikonet
  if (isRotating) { // Hvis ikonet roterer, så opdater vinklen
    if (settingsAngle < rotationTarget) { // Hvis vinklen er mindre end målvinklen, så øg den, så det roterer til højre
      settingsAngle += 5; // Øg vinklen med 5 hver frame, så rotationen bliver ser smooth ud
      if (settingsAngle > rotationTarget) {
        settingsAngle = rotationTarget; // Sæt den til målvinklen for at undgå at overshoot
      }
    } else if (settingsAngle > rotationTarget) { // Hvis vinklen er større end målvinklen, så sænk den, så det roterer til venstre
      settingsAngle -= 5; // Sænk vinklen med 5 hver frame, så rotationen bliver ser smooth ud
      if (settingsAngle < rotationTarget) {
        settingsAngle = rotationTarget; // Set it to the target angle to avoid overshooting
      }
    } else {
      isRotating = false; // Stop rotationen når den når målvinklen
    }
  }


  // Handle player movement and display
  if(!farm.isUIOpen && !storage.isUIOpen && !shop.isUIOpen){ // Making sure the player can't move when the UI is open
    if (keyIsDown(65)) { // "a" key
      player.move(-8, "left");
      player.animate(); // Run animation
    } else if (keyIsDown(68)) { // "d" key
      player.move(8, "right");
      player.animate(); // Run animation
    } else {
      player.stopAnimation(); // Stop animation and show idle frame
    }
  } else {
    player.stopAnimation(); // Stop animation and show idle frame if the UI is open
  }

  // Display the farm area
  farm.display();
  // Display the storage area
  storage.display();
  // Display the shop area
  shop.display();

  /* Display the player. Needs to be after the farm and storages area, 
  so it is on top of them and under the their UI*/
  player.display();

  // Display the farm UI if it is open
  farm.displayUI();
  //Display the storage UI
  storage.displayUI();
  //Display the shop UI
  shop.displayUI();

  // Update plant growth
  farm.updateGrowth(); 

  // Display potato and coin notifications
  gameController.displayNotifications();
}

// startGame() funktionen bliver brugt til at starte spillet, når brugeren trykker på start knappen. Den tjekker om brugeren har indtastet et username, og hvis det er tilfældet, så starter spillet.
function startGame() {
  username = usernameInput.value().trim(); // .trim() funktionen fjerner whitespace fra starten og slutningen af det man har indtastet som username, så man ikke kommer til at trykke mellemrum ved et uheld
  if (username) { // Tjekker om username ikke er tomt
  //database er instansen der kalder forbindelsen til fireBase - funktionerne collection, doc og get() gør det muligt at få data det rigtige sted 
    database.collection("eksgameTest").doc("usernames").get().then((doc) => { // For fat i dataen fra firebase med alle usernames og deres data
      const usernames = doc.data(); // Henterer usernames dataen fra firebase og gemmer den i usernames variablen
      if (doc.exists && usernames[username]) { // Tjekker om det indtastede username eksisterer i firebase databasen (samt om dokumentet eksisterer for at være sikker)
        // Load progress if username exists
        const userData = usernames[username]; // Hent dataen for det indtastede username
        gameController = new GameController(); // Lav en ny gameController klasse
        loadGame();/* Indlæs spillet efter at have hentet dataen fra firebase.
        (Nød til at indlæse spillet før at indlæse opgradering niveauer, fordi den funktion bruger farm og storage klasserne, og de bliver først lavet i loadgame)*/
        gameController.loadCoinsPotatoesAndLevels(userData.coins, userData.potato, userData.storageLevel, userData.growthLevel, userData.storedPotatoes); // Load the gameController with the loaded data

        //debugging
        console.log("Logged ind som username: " + username+", Coins: " + gameController.coins+", Potatoes: " + gameController.potato);  
      } else { // Hvis det indtastede username ikke eksisterer i firebase databasen, så spørg brugeren om de vil lave en ny gemme fil
        // Spørger spilleren om de vil lave en ny gemme fil med confirm funktionen
        let createNewSave = confirm("No save file found for this username. Do you want to create a new save?");
        if (createNewSave) { // Hvis spilleren trykker ja, så lav en ny gemme fil
            database.collection("eksgameTest").doc("usernames").update({ // Opdaterer firebase databasen med det indtastede username og sætter coins, potatoes og levels til standard værdierende
            [username]: {
              coins: 0,
              potato: 0,
              storageLevel: 0,
              growthLevel: 0,
              storedPotatoes: 0
            }
            }).then(() => { // Efter at have opdateret firebase databasen, så kør denne funktion
            console.log("Logged ind som ny username: " + username);
            gameController = new GameController(); // Create a new gameController class
            loadGame(); /* Indlæs spillet efter at have hentet dataen fra firebase.
            (Nød til at indlæse spillet før at indlæse opgradering niveauer, fordi den funktion bruger farm og storage klasserne, og de bliver først lavet i loadgame)*/
            gameController.loadCoinsPotatoesAndLevels(0, 0, 0, 0, 0); // Load the gameController with the default values
          });
        }
      }
    });
  } else { // Hvis username er tomt, så vis en alert
    alert("Please enter a username!");
  }
}

function loadGame() {
  // gem start knappen og input feltet væk, så de ikke er synlige når spillet starter
  usernameInput.hide();
  startButton.hide();
  
  // Lav alle klasserne og deres variabler, og sæt gameState til "play"
  player = new Player(width / 2, height / 2 + height / 3, 200, 200, skinFramesRight, skinFramesLeft, skinIdleFrame);
  farm = new Farm(width - width/10, height / 2 + height / 3, 200, potatoEmptyPlot, potatoPlantedPlot, potatoHarvestablePlot);
  storage = new Storage(width / 10, height / 2 + height / 3, 20, 200);
  shop = new Shop(width / 2, height / 2 + height / 3, 200);
  gameState = "play";

  // Start auto-saving hver 30 sekunder (30000 ms) - Interval kører igen og igen, indtil det stoppes
  gameController.startAutoSave(username);
}

function logout() {
  // Spørger spilleren om de vil logge ud med confirm funktionen
  let confirmLogout = confirm("Are you sure you want to logout?");
  if (!confirmLogout) {
    //debugging
    console.log("Logout canceled by the user.");
    return; // Stop log ud funktionen hvis spilleren trykker "cancel" på confirm funktionen
  }

  // Kører saveProgress funktionen for at gemme fremskridtene før log ud
  if (username) { // Tjekker om der er et username, hvis ikke så vis en alert, for at undgå fejl
    console.log("Saving progress before logging out...");
    gameController.saveProgress(username);
  }
  // Stop auto-save funktionen når spilleren logger ud
  gameController.stopAutoSave();

  // Set gameState til "start"
  gameState = "start";

  // Sætter username til tomt og sletter gameController
  username = "";
  gameController = null;

  if(shop.sellDropdown){
    shop.sellDropdown.remove();
    shop.sellDropdown = null;
  }
  
  if(shop.sellButton){
    shop.sellButton.remove();
    shop.sellButton = null;
  }
  
  if(shop.upgradeButton){
    shop.upgradeButton.remove();
    shop.upgradeButton = null;
  }

  if(shop.upgradeGrowthButton){
    shop.upgradeGrowthButton.remove();
    shop.upgradeGrowthButton = null;
  }

  // Luk indstillingsmenuen hvis den er åben og roter ikonet tilbage til 0 grader, hvis den var roteret(åben)
  // Note Lige nu roterer den tilbage når du starter spillet igen, hvis du skulle være allerede roteret, så skal vi rotere det i drawStartScreen.
  if (rotationTarget === 180) {
    rotationTarget = 0; // Rotere tilbage til 0 grader
    isRotating = true; // Start rotationen
    saveButton.hide(); // Gem save knappen væk
    logoutButton.hide(); // Gem logout knappen væk
  }

  // Vis start knappen og input feltet igen
  usernameInput.show();
  startButton.show();
  usernameInput.value(''); // Ryd input feltet

  // Fjern gem og logout knapperne væk
  saveButton.hide();
  logoutButton.hide();

  // Debbugging
  console.log("User logged out. Returning to the start screen.");
}



function keyPressed() {

  if(gameState === "start"){ // Tjekker om spillet er i start tilstand
    if (keyCode === ENTER) { // Tjekker om enter tasten er den tast der blev trykket
      startGame(); // Kør startGame funktionen
    }
  }

  if(gameState === "play"){ // Tjekker om spillet er i play tilstand
    if (key === 'e' || key === 'E') {
      if(farm.isPlayerNearby(player)){ // Bruger isPlayerNearby funktionen til at tjekke om spilleren er i nærheden af farmen
        farm.toggleUI(); // Luk eller åben farm UI
      }
    }

    if (key === 'e' || key === 'E') {
      if(storage.isPlayerNearby(player)){
        storage.toggleUI();
      }
    }

    if (key === 'e' || key === 'E') {
      if(shop.isPlayerNearby(player)){
        shop.toggleUI();
      }
    }
  }
}

function mousePressed() {
  // Tjekker om musen er trykket på indstillingsikonet
  const settingsX = width - 50;
  const settingsY = 50;
  const distance = dist(mouseX, mouseY, settingsX, settingsY);

  if (distance < 25) { // Tjekker om musen er inden for 25 pixels fra indstillingsikonet
    isRotating = true; // Start rotationen
    if (rotationTarget === 0) {
      rotationTarget = 180; // Rotate til 180 grader
      saveButton.show(); // Vis gem knappen
      logoutButton.show(); // Vis logout knappen
    } else {
      rotationTarget = 0; // Hvis den er åben (180 grader), så roter tilbage til 0 grader (Så den er lukket)
      saveButton.hide(); // Fjern gem knappen
      logoutButton.hide(); // Fjern logout knappen
    }
  }

  // Tjekker om musen er trykket på et plot i farm UI
  if(farm){
    farm.handleMouseClick(mouseX, mouseY);
  }
}

