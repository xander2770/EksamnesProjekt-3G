//HUSK: Når du bruger .set på noget i firebase så sletter den alt og setter den til det du siger. Brug .update for at adde noget

let gameState = "start"; // Game state: "start" or "play"

let gameController
let farm
let player

let storage

let shop

let usernameInput;
let username = ""; // Store the current username

let saveButton;
let saveNotification = ""; // Variable to store the save message
let saveNotificationTimeout; // Variable to store the timeout ID
let autoSaveInterval;

let skinFramesRight = []; // Array for right movement animation frames
let skinFramesLeft = []; // Array for left movement animation frames
let skinIdleFrame
let map

//Settings variables
let settingsIcon; // Variable for the settings icon
let settingsAngle = 0; // Angle for rotating the settings icon
let isRotating = false; // To check if the icon is rotating
let rotationTarget = 0; // Target angle for rotation (e.g., 180 degrees)

//Farm UI images variables
let potatoEmptyPlot
let potatoPlantedPlot = [] // Array for the different stages of the planted potato
let potatoHarvestablePlot

function preload(){
    // Load player animation frames for moving right
  for (let i = 1; i <= 4; i++) { // Assuming 4 frames for the right animation
    skinFramesRight.push(loadImage(`images/PlayerFrames/ØlstykkeFarmManRight${i}_256x256.png`));
    skinFramesLeft.push(loadImage(`images/PlayerFrames/FarmManLeft${i}_256x256.png`));
  }
    // Load the idle frame
    skinIdleFrame = loadImage('images/PlayerFrames/ØlstykkeFarmManIdle_256x256.png');
    
    // Load the map image
    map = loadImage('images/map1_1920x1080.png');

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
  Emil = new EmilErEnAbeVejr
  
  createCanvas(windowWidth-1, windowHeight-1);
  frameRate(60); // Set the frame rate to 60 FPS

  // Create username input and save button
  usernameInput = createInput().attribute("placeholder", "Enter username");
  usernameInput.position(width / 2 - 100, height / 2 - 20);

  //Start button to start the game
  startButton = createButton("Start Game").position(width / 2 - 50, height / 2 + 20).mousePressed(startGame);

  // Create buttons for the settings menu (hidden by default)
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
  deliverInput.position(500, 460);
  deliverInput.size(40);
  deliverInput.hide();

  // Input til antal kartofler der skal hentes
  collectInput = createInput("1", "number");
  collectInput.position(500, 530);
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
  background(100, 150, 200);
  textAlign(CENTER);
  textSize(32);
  fill(255);
  text("Welcome to the Farm Game!", width / 2, height / 2 - 60);
  textSize(16);
  text("Enter your username to start.", width / 2, height / 2 - 40);
}

function drawGame() {
  imageMode(CENTER);
  image(map, width/2, height/2, width, height)

  // Display coins and potatoes
  textSize(16);
  fill(0);
  text("Coins: " + gameController.coins, 55, 30);
  text("Potatoes: " + gameController.potato, 55, 50);
  text("Storage Level: " + gameController.storageLevel, 55, 70);
  text("Growth Level: " + gameController.growthLevel, 55, 90);

  // Display the save notification if it exists
  if (gameController.saveNotification) {
    textSize(20);
    fill(0, 255, 0); // Green color for the notification
    textAlign(CENTER);
    text(gameController.saveNotification, width / 2, 30); // Display at the top center of the screen
  }

//Settings:
  // Display the settings icon
  push(); // Push saves everything before the push, so we can use pop it later so everthing changed after the push is gone
  translate(width - 50, 50); // Translate positions the 0,0 point in the top left. This allows use to rotate the icon around its center. Other wise it would rotate in a big circle.
  rotate(radians(settingsAngle)); // Rotates the icon with how much it has come to
  imageMode(CENTER);
  image(settingsIcon, 0, 0, 50, 50); // Draw the settings icon
  pop(); // Pop removes the translation and rotation, so we can draw other things without it being rotated or translated, like the settings icon

  // Rotation for the settings icon
  if (isRotating) {
    if (settingsAngle < rotationTarget) { // If the angle is less than the target angle, increase it, to make it rotate to the right
      settingsAngle += 5; // Increase the angle by 5 every fram so the rotation becomes smooth
      if (settingsAngle > rotationTarget) {
        settingsAngle = rotationTarget; // Set it to the target angle to avoid overshooting
      }
    } else if (settingsAngle > rotationTarget) { // If the angle is less than the target angle, decrease it, to make it rotate to the left
      settingsAngle -= 5; // Decrease the angle by 5 every fram so the rotation becomes smooth
      if (settingsAngle < rotationTarget) {
        settingsAngle = rotationTarget; // Set it to the target angle to avoid overshooting
      }
    } else {
      isRotating = false; // Stop rotating when the target is reached
    }
  }
//End of settings

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

  // Display potato notifications
  gameController.displayNotifications();
}

function startGame() {
  username = usernameInput.value().trim(); // Trim removes whitespace- from the beginning and end of the string
  if (username) {
    // Check if the username exists in Firebase
    database.collection("eksgameTest").doc("usernames").get().then((doc) => {
      const usernames = doc.data(); // Retrieve all usernames from the document
      if (doc.exists && usernames[username]) { // Check if the specific username exists
        // Load progress if username exists
        const userData = usernames[username]; // Retrieve data for the specific username
        gameController = new GameController();
        gameController.updateCoinsAndPotatoes(userData.coins, userData.potato, userData.storageLevel, userData.growthLevel); // Update the gameController with the loaded data
        gameController.loadUpgradeLevels(userData.storageLevel, userData.growthLevel); // Load the upgrade levels

        //debugging
        console.log("Logged ind som username: " + username);
        console.log("Coins: " + gameController.coins);
        console.log("Potatoes: " + gameController.potato);

        loadGame();
      } else {
        // Ask the player if they want to create a new save
        let createNewSave = confirm("No save file found for this username. Do you want to create a new save?");
        if (createNewSave) {
            database.collection("eksgameTest").doc("usernames").update({
            [username]: {
              coins: 0,
              potato: 0,
              storageLevel: 0,
              growthLevel: 0
            }
            }).then(() => {
            console.log("Logged ind som ny username: " + username);
            gameController = new GameController();
            gameController.updateCoinsAndPotatoes(0, 0, 0, 0);
            gameController.loadUpgradeLevels(0,0)
            loadGame();
          });
        }
      }
    });
  } else { // If the username is empty, show an alert
    alert("Please enter a username!");
  }
}

function loadGame() {
  // Hide the start screen elements
  usernameInput.hide();
  startButton.hide();
  
  // Spawn player with the loaded data
  player = new Player(width / 2, height / 2 + height / 3, 200, 200, skinFramesRight, skinFramesLeft, skinIdleFrame);
  farm = new Farm(width - width/10, height / 2 + height / 3, 200, potatoEmptyPlot, potatoPlantedPlot, potatoHarvestablePlot);
  storage = new Storage(width / 10, height / 2 + height / 3, 20, 200);
  shop = new Shop(width / 2, height / 2 + height / 3, 200);
  gameState = "play";

  // Start auto-saving every 30 seconds
  gameController.startAutoSave(username);
}

function logout() {
  // Ask the user for confirmation before logging out
  let confirmLogout = confirm("Are you sure you want to logout?");
  if (!confirmLogout) {
    //debugging
    console.log("Logout canceled by the user.");
    return; // Exit the function if the user cancels, so it stops the logout process (all code after this)
  }

  // Save progress before logging out
  if (username) { // Making sure the username is not empty, just in case something goes wrong
    console.log("Saving progress before logging out...");
    gameController.saveProgress(username);
  }
  // Stop auto-saving when the user logs out
  gameController.stopAutoSave();

  // Reset the game state
  gameState = "start";

  // Clears the username and the classes. To make sure there isnt 2 classes of the same (even tho it would be overwritten, but still)
  username = "";
  gameController = null;
  player = null;

  
    shop.sellDropdown.remove();
    shop.sellDropdown = null;
  
  
    shop.sellButton.remove();
    shop.sellButton = null;
  
  
    shop.upgradeButton.remove();
    shop.upgradeButton = null;

    shop.upgradeGrowthButton.remove();
    shop.upgradeGrowthButton = null;
  

  // Close the settings menu and rotate back if it's open
  //Note: Right now it rotates back when you start thne game again, if you should be already rotated, we need rotate it in drawStartScreen.
  if (rotationTarget === 180) { // If the settings menu is open
    rotationTarget = 0; // Rotate back to 0 degrees
    isRotating = true; // Trigger the rotation
    saveButton.hide(); // Hide the Save Progress button
    logoutButton.hide(); // Hide the Logout button
  }

  // Show the start screen elements
  usernameInput.show();
  startButton.show();
  usernameInput.value(''); // Clear the input field

  // Hide the game elements
  saveButton.hide();
  logoutButton.hide();

  console.log("User logged out. Returning to the start screen.");
}



function keyPressed() {
  if (key === 'e' || key === 'E') {
    if(farm.isPlayerNearby(player)){
      farm.toggleUI(); // Toggle the farm UI
    }
  }

  if (key === 'e' || key === 'E') {
    if(storage.isPlayerNearby(player)){
      storage.toggleUI(); // Toggle the farm UI
    }
  }

  if (key === 'e' || key === 'E') {
    if(shop.isPlayerNearby(player)){
      shop.toggleUI(); // Toggle the farm UI
    }
  }
}

function mousePressed() {
  // Check if the settings icon is clicked
  const settingsX = width - 50;
  const settingsY = 50;
  const distance = dist(mouseX, mouseY, settingsX, settingsY);

  if (distance < 25) { // Check if the click is within the icon's radius
    isRotating = true; // Start rotating
    if (rotationTarget === 0) {
      rotationTarget = 180; // Rotate to 180 degrees
      saveButton.show(); // Show the Save Progress button
      logoutButton.show(); // Show the Logout button
    } else {
      rotationTarget = 0; // Rotate back to 0 degrees
      saveButton.hide(); // Hide the Save Progress button
      logoutButton.hide(); // Hide the Logout button
    }
  }

  // Checks if mouse is clicked on a plot on the farmU
  if(farm){
    farm.handleMouseClick(mouseX, mouseY);
  }
}

