class Shop{
constructor(x,y,dia){
    this.x = x;
    this.y = y;
    this.dia = dia
    this.isUIOpen = false;
}

display() {
    if(!this.isUIOpen && !farm.isUIOpen && !shop.isUiOpen){
    fill(0, 255, 0, 50); // Semi-transparent green for the farm radius
    noStroke();
    rectMode(CENTER);
    rect(this.x, this.y, this.dia, this.dia); // Draw the interaction radius
    }
  }

  displayUI() {
    if (this.isUIOpen) {
      fill(50, 50, 50, 200); // Baggrund til UI
      rectMode(CENTER);
      rect(width / 2, height / 2, 800, 600); // Grå UI-box
  
      fill(255);
      textAlign(CENTER, CENTER);
      textSize(20);
      text("Shop UI", width / 2, height / 2 - 100);
      text("Alex, Build your shop!", width / 2, height / 2 - 50);
 }
}

toggleUI() {
    this.isUIOpen = !this.isUIOpen;
}

isPlayerNearby(player) {
    const distance = dist(player.x, player.y, this.x, this.y);
    return distance <= 150; // Afstand spiller skal være indenfor
 }    

}