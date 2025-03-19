// Canvas instellen
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 700;
canvas.height = 500;

// Geluiden instellen met Howler.js (externe library)
const knSound = new Howl({ src: ["/sounds/drop_sound.wav"] });
const hitSound = new Howl({ src: ["/sounds/hit_sound.wav"] });
const backgroundMusic = new Howl({ src: ["/sounds/background_sound2.mp3"], loop: true });
backgroundMusic.play();

// Afbeeldingen laden
const backgroundImg = new Image();
backgroundImg.src = "/images/background_game.jpg";
const player1Img = new Image();
player1Img.src = "/images/player1.png";
const player2Img = new Image();
player2Img.src = "/images/player2.png";
const nuggetImg = new Image();
nuggetImg.src = "/images/kipnuggetImage.png";

// Player class
class Player {
    constructor(x, y, image) {
        this.x = x;
        this.y = y;
        this.image = image;
        this.width = 70;
        this.height = 50;
    }

    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}

// Chicken Nugget class
class ChickenNugget {
    constructor(x, y, image) {
        this.x = x;
        this.y = y;
        this.image = image;
        this.width = 30;
        this.height = 30;
        this.vel = 10;
    }

    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}

// Spelers en objecten
let player1 = new Player(300, 103.5, player1Img);
let player2 = new Player(300, 455, player2Img);
let nuggets = [];
let score = 0;
let nuggetCounter = 0;
let gameRunning = true;

// Toetsenbord input
let keys = {};

window.addEventListener("keydown", (e) => keys[e.key] = true);
window.addEventListener("keyup", (e) => keys[e.key] = false);

// Score laten zien
function displayScore() {
    ctx.font = "40px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Score: " + score, 10, 40);
}

// Counter laten zien
function displayNuggetCounter() {
    ctx.font = "24px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Nuggets counter: " + nuggetCounter, 10, 70);
}

// Hoofd game loop
function gameLoop() {
    if (!gameRunning) return; // Stop de game als iemand gewonnen heeft.

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);

    // Beweging speler 1
    if (keys["a"] && player1.x > 70) player1.x -= 5;
    if (keys["d"] && player1.x < 550) player1.x += 5;

    // Beweging speler 2
    if (keys["ArrowLeft"] && player2.x > 80) player2.x -= 5;
    if (keys["ArrowRight"] && player2.x < 550) player2.x += 5;

    // Kipnugget gooien (speler 1)
    if (keys[" "] && nuggets.length < 1) {
        nuggets.push(new ChickenNugget(player1.x + 25, 110, nuggetImg));
        nuggetCounter++;
        knSound.play();
    }

    // Beweging nuggets
    nuggets.forEach((nugget, index) => {
        if (nugget.y < 500 && nugget.y > 0) {
            nugget.y += nugget.vel;
        } else {
            nuggets.splice(index, 1);
        }
    });

    // Botsing checken
    nuggets.forEach((nugget, index) => {
        let nuggetRect = { x: nugget.x, y: nugget.y, width: nugget.width, height: nugget.height };
        let player2Rect = { x: player2.x, y: player2.y, width: player2.width, height: player2.height };

        if (checkCollision(nuggetRect, player2Rect)) {
            nuggets.splice(index, 1);
            score++;
            hitSound.play();
        }
    });

    // Win check
    if (score >= 3) {
        showWinMessage("PLAYER 1 WINS!");
        gameRunning = false;
    }

    if (nuggetCounter > 10) {
        showWinMessage("PLAYER 2 WINS!");
        gameRunning = false;
    }

    // Spelers en objecten tekenen
    player1.draw();
    player2.draw();
    nuggets.forEach(nugget => nugget.draw());
    displayScore();
    displayNuggetCounter();

    requestAnimationFrame(gameLoop);
}

// Functie om botsing te checken
function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// Functie om winnaar te laten zien
function showWinMessage(message) {
    ctx.font = "50px Arial";
    ctx.fillStyle = "red";
    ctx.fillText(message, 150, 250);
    
    setTimeout(() => {
        score = 0;
        nuggetCounter = 0;
        nuggets = [];
        player1.x = 300;
        player2.x = 300;
        gameRunning = true;
        gameLoop();
    }, 3000);
}

// Afbeelding laden en tekenen zodra deze klaar is
backgroundImg.onload = function() {
    gameLoop();  // Start de game loop nadat de achtergrond is geladen
};