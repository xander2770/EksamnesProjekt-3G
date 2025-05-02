// Klasse der styrer spilleren og dens animationer
class Player{
    constructor(x, y, width, height, framesRight, framesLeft, idleFrame){
    // Position på skærmen
    this.x = x;
    this.y = y;

    // Spillerens størrelse
    this.width = width;
    this.height = height;

    // Animation variabler 
    this.framesRight = framesRight; // Billeder der bruges når spilleren går til højre
    this.framesLeft = framesLeft;   // Billeder der bruges når spilleren går til venstre
    this.idleFrame = idleFrame;     // Billede når spilleren står stille

    this.currentFrames = framesRight; // Starter med højre-animation som standard
    this.currentFrame = 0;            // Index på hvilket frame der vises lige nu
    this.animationSpeed = 15;         // Hvor hurtigt animationen skifter (lavere værdi = hurtigere animation)
    this.frameCounter = 0;            // Tæller hvor mange frames der er gået siden sidste skift
    this.isAnimating = false;         // Boolean der styrer om spilleren er i gang med en animation
    }

    // Bevæger spilleren og skifter retning
    move(dx, direction) {
      // Bevæger spilleren i x-retningen
      // dx er hvor meget spilleren skal flytte sig i x-retningen
      const newX = this.x + dx;

        // Forhindrer spilleren i at bevæge sig uden for skærmen
        if (newX >= 0+this.width/2 && newX + this.width/2 <= windowWidth) {
          this.x = newX; 
        }

        // Skift animation frames baseret på retning
        if (direction === "left") {
          this.currentFrames = this.framesLeft;
        } else if (direction === "right") {
          this.currentFrames = this.framesRight;
        }
    }
    
    // Animerer spilleren hvis den bevæger sig
      animate() {
        this.isAnimating = true;
        this.frameCounter++; // Forøger frameCounter med 1 hver gang animate() kaldes
        if (this.frameCounter >= this.animationSpeed) { // Check om frameCounter er større eller lig med animationSpeed
            if (this.currentFrame + 1 >= this.currentFrames.length) { // Hvis den nuværende frame er den sidste i animationen
            this.currentFrame = 0; // Gå tilbage til den første frame
            } else {
            this.currentFrame += 1; // Gå til næste frame
            }
          this.frameCounter = 0; // Reset frameCounter til 0
        }
      }
    
      // Stop animationen og vis den første frame
      stopAnimation() {
        this.isAnimating = false;
        this.currentFrame = 0; // Reset til den første frame
      }

      // Vis spillerens animation eller idle frame
      display() {
        imageMode(CENTER);
        if (this.isAnimating) {
          // Hvis spilleren er i gang med at animere, vis den nuværende frame
          image(this.currentFrames[this.currentFrame], this.x, this.y, this.width, this.height);
        } else {
          // Vis idle frame hvis spilleren ikke er i gang med at animere
          image(this.idleFrame, this.x, this.y, this.width, this.height);
        }
      }
}