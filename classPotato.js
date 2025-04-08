//classPotato.js
class Potato {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = 50;
      this.originalY = y;
      this.bounceHeight = 10;
      this.bounceSpeed = 0.1;
      this.bounceOffset = random(0, 1000); //
    }
  
    update() {
      //Laver et lille "hop" med sin position
      this.y = this.originalY + sin(millis() * this.bounceSpeed + this.bounceOffset) * this.bounceHeight;
    }
  
    display() {
      fill(210, 180, 140); // Brun farve
      ellipse(this.x, this.y, this.size);
    }
  }
  