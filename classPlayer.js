// The class that controls the player and its animations
class Player{
    constructor(x, y, width, height, framesRight, framesLeft, idleFrame){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    //Animation variables
    this.framesRight = framesRight; // Array of animation frames for moving right
    this.framesLeft = framesLeft; // Array of animation frames for moving left
    this.idleFrame = idleFrame; // Image for the idle frame
    this.currentFrames = framesRight; // Default to right-facing frames
    this.currentFrame = 0; // Index of the current frame
    this.animationSpeed = 15; // Speed of animation (lower is faster)
    this.frameCounter = 0; // Counter to control frame switching
    this.isAnimating = false; // Flag to control animation
    }

    move(dx, direction) {
      // Prevent moving out of the screen
      const newX = this.x + dx;

        if (newX >= 0+this.width/2 && newX + this.width/2 <= windowWidth) {
          this.x = newX;
        }

        // Switch animation frames based on direction
        if (direction === "left") {
          this.currentFrames = this.framesLeft;
        } else if (direction === "right") {
          this.currentFrames = this.framesRight;
        }
    }
    
    
      animate() {
        this.isAnimating = true;
        this.frameCounter++; // Increment the frame counter every time aniamte() is called. and it is called every frame, in game, cause of draw
        if (this.frameCounter >= this.animationSpeed) { // Check if it's time to switch frames. It is if the frameCounter is greater than or equal to the animationSpeed
            if (this.currentFrame + 1 >= this.currentFrames.length) { // If the last frame is reached
            this.currentFrame = 0; // Reset to the first frame
            } else {
            this.currentFrame += 1; // Move to the next frame
            }
          this.frameCounter = 0; // Resets the frame counter when the frame is changed
        }
      }
    
      stopAnimation() {
        this.isAnimating = false;
        this.currentFrame = 0; // Reset to the first frame
      }

      display() {
        imageMode(CENTER);
        if (this.isAnimating) {
          // Display the current animation frame
          image(this.currentFrames[this.currentFrame], this.x, this.y, this.w, this.h);
        } else {
          // Display the idle frame when not animating
          image(this.idleFrame, this.x, this.y, this.width, this.height);
        }
      }
}