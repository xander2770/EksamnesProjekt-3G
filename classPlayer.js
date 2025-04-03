class player {
    constructor(name, id) {
        this.name = name;
        this.id = id;
        this.score = 0;
    }
    addScore(points) {
        this.score += points;
    }
    getScore() {
        return this.score;
    }
    getName() {
        return this.name;
    }
    getId() {
        return this.id;
    }
    resetScore() {
        this.score = 0;
    }

}