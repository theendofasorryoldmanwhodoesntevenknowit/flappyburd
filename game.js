// Game Configuration
const GAME_CONFIG = {
    1: {
        name: 'Easy',
        pipeSpeed: 4,
        pipeGap: 130,
        spawnRate: 90,
        gravity: 0.4,
        maxEnemies: 1,
        enemyTypes: ['pipe'],
        score: 100
    },
    2: {
        name: 'Medium',
        pipeSpeed: 6,
        pipeGap: 100,
        spawnRate: 70,
        gravity: 0.5,
        maxEnemies: 2,
        enemyTypes: ['pipe', 'laser'],
        score: 200
    },
    3: {
        name: 'Hard',
        pipeSpeed: 8,
        pipeGap: 80,
        spawnRate: 50,
        gravity: 0.6,
        maxEnemies: 3,
        enemyTypes: ['pipe', 'laser', 'sphere'],
        score: 300
    },
    4: {
        name: 'Insane',
        pipeSpeed: 10,
        pipeGap: 60,
        spawnRate: 40,
        gravity: 0.7,
        maxEnemies: 4,
        enemyTypes: ['pipe', 'laser', 'sphere'],
        score: 500
    }
};

// Game State
let gameState = {
    isRunning: false,
    isPaused: false,
    level: 1,
    score: 0,
    highScore: localStorage.getItem('flappyHighScore') || 0,
    health: 3,
    upgrades: {},
    upgradeCurrency: parseInt(localStorage.getItem('flappyUpgradeCurrency')) || 0,
    isMuted: false,
    isShield: false,
    isSpeedBoost: false,
    speedBoostTimer: 0,
    isSlowMotion: false,
    slowMotionTimer: 0,
    slowMotionMultiplier: 0.5,
    flapPower: 12
};

// Player Object
const player = {
    x: 50,
    y: 0,
    width: 40,
    height: 40,
    velocity: 0
};

// Game Objects Arrays
let pipes = [];
let enemies = [];
let powerups = [];
let frameCount = 0;

// DOM Elements
const gameContainer = document.getElementById('gameContainer');
const gamescreen = document.getElementById('gamescreen');
const flyarea = document.getElementById('flyarea');
const playerEl = document.getElementById('player');
const scoreboard = document.getElementById('scoreboard');
const levelSelect = document.getElementById('levelSelect');
const upgradeShop = document.getElementById('upgradeShop');
const levelDisplay = document.getElementById('levelDisplay');
const scoreDisplay = document.getElementById('scoreDisplay');
const healthDisplay = document.getElementById('healthDisplay');
const upgradesDisplay = document.getElementById('upgradesDisplay');
const finalScore = document.getElementById('finalScore');
const finalLevel = document.getElementById('finalLevel');
const highScoreDisplay = document.getElementById('highScoreDisplay');
const replayBtn = document.getElementById('replayBtn');
const helpModal = document.getElementById('helpModal');
const helpBtn = document.getElementById('helpBtn');
const closeModalBtn = document.querySelector('.close');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const muteBtn = document.getElementById('muteBtn');
const startBtn = document.getElementById('startBtn');
const shopBtn = document.getElementById('shopBtn');
const closeShopBtn = document.getElementById('closeShopBtn');
const upgradeButtons = document.querySelectorAll('.upgrade-buy-btn');

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    initializeGame();
    setupEventListeners();
    updateHUD();
});

function initializeGame() {
    player.y = gamescreen.clientHeight / 2;
    levelSelect.style.display = 'flex';
    scoreDisplay.textContent = '0';
    levelDisplay.textContent = '1';
}

function setupEventListeners() {
    // Controls
    document.addEventListener('click', () => flap());
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            flap();
        }
    });

    // Buttons
    helpBtn.addEventListener('click', () => {
        helpModal.style.display = 'flex';
    });

    closeModalBtn.addEventListener('click', () => {
        helpModal.style.display = 'none';
    });

    fullscreenBtn.addEventListener('click', toggleFullscreen);
    muteBtn.addEventListener('click', toggleMute);
    startBtn.addEventListener('click', showLevelSelect);
    shopBtn.addEventListener('click', showUpgradeShop);
    closeShopBtn.addEventListener('click', hideLevelSelect);
    replayBtn.addEventListener('click', startGame);

    // Level Select
    document.querySelectorAll('.level-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const level = parseInt(e.currentTarget.dataset.level);
            selectLevel(level);
        });
    });

    // Upgrades
    upgradeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const upgradeType = e.currentTarget.dataset.upgrade;
            buyUpgrade(upgradeType);
        });
    });

    helpModal.addEventListener('click', (e) => {
        if (e.target === helpModal) {
            helpModal.style.display = 'none';
        }
    });
}

function startGame() {
    gameState.isRunning = true;
    gameState.score = 0;
    gameState.health = 3;
    gameState.isShield = false;
    gameState.isSpeedBoost = false;
    gameState.isSlowMotion = false;
    gameState.speedBoostTimer = 0;
    gameState.slowMotionTimer = 0;
    gameState.upgrades = {};

    player.y = gamescreen.clientHeight / 2;
    player.velocity = 0;

    pipes = [];
    enemies = [];
    powerups = [];
    frameCount = 0;

    levelSelect.style.display = 'none';
    scoreboard.style.display = 'none';
    upgradeShop.style.display = 'none';

    updateHUD();
    gameLoop();
}

function selectLevel(level) {
    gameState.level = level;
    startGame();
}

function gameLoop() {
    if (!gameState.isRunning || gameState.isPaused) {
        requestAnimationFrame(gameLoop);
        return;
    }

    frameCount++;

    // Update player
    updatePlayer();

    // Update pipes
    updatePipes();

    // Update enemies
    updateEnemies();

    // Update powerups
    updatePowerups();

    // Update upgrades
    updateUpgrades();

    // Spawn objects
    if (frameCount % GAME_CONFIG[gameState.level].spawnRate === 0) {
        spawnPipe();
    }

    if (frameCount % (GAME_CONFIG[gameState.level].spawnRate * 2) === 0) {
        spawnEnemy();
    }

    if (frameCount % 200 === 0) {
        spawnPowerup();
    }

    // Check collisions
    checkCollisions();

    // Render
    render();

    // Check game over
    if (gameState.health <= 0) {
        endGame();
        return;
    }

    requestAnimationFrame(gameLoop);
}

function flap() {
    if (!gameState.isRunning) return;
    player.velocity = -gameState.flapPower;
}

function updatePlayer() {
    const gravity = GAME_CONFIG[gameState.level].gravity;
    player.velocity += gravity;

    // Apply speed boost
    if (gameState.isSpeedBoost) {
        player.velocity *= 0.85;
    }

    player.y += player.velocity;

    // Boundary check
    if (player.y < 0) player.y = 0;
    if (player.y + player.height > gamescreen.clientHeight) {
        gameState.health = 0;
    }
}

function spawnPipe() {
    const config = GAME_CONFIG[gameState.level];
    const gap = config.pipeGap;
    const minHeight = 40;
    const maxHeight = gamescreen.clientHeight - gap - 40;
    const gapStart = Math.random() * (maxHeight - minHeight) + minHeight;

    const pipe = {
        x: gamescreen.clientWidth,
        gapStart: gapStart,
        gapSize: gap,
        width: 80,
        scored: false,
        type: 'pipe'
    };

    pipes.push(pipe);
}

function updatePipes() {
    const config = GAME_CONFIG[gameState.level];
    let multiplier = gameState.isSlowMotion ? gameState.slowMotionMultiplier : 1;

    pipes.forEach((pipe, index) => {
        pipe.x -= config.pipeSpeed * multiplier;

        // Score
        if (!pipe.scored && pipe.x < player.x) {
            pipe.scored = true;
            gameState.score += config.score;
            updateHUD();
        }

        // Remove off-screen
        if (pipe.x + pipe.width < 0) {
            pipes.splice(index, 1);
        }
    });
}

function spawnEnemy() {
    const config = GAME_CONFIG[gameState.level];
    if (enemies.length >= config.maxEnemies) return;

    const enemyType = config.enemyTypes[Math.floor(Math.random() * config.enemyTypes.length)];

    let enemy;
    if (enemyType === 'laser') {
        enemy = {
            x: gamescreen.clientWidth,
            y: Math.random() * (gamescreen.clientHeight - 30),
            width: 200,
            height: 8,
            type: 'laser',
            direction: Math.random() > 0.5 ? 1 : -1
        };
    } else if (enemyType === 'sphere') {
        enemy = {
            x: gamescreen.clientWidth,
            y: Math.random() * (gamescreen.clientHeight - 60),
            width: 30,
            height: 30,
            type: 'sphere',
            velocityY: (Math.random() - 0.5) * 4,
            bounceCount: 0
        };
    }

    if (enemy) enemies.push(enemy);
}

function updateEnemies() {
    const config = GAME_CONFIG[gameState.level];
    let multiplier = gameState.isSlowMotion ? gameState.slowMotionMultiplier : 1;

    enemies.forEach((enemy, index) => {
        if (enemy.type === 'laser') {
            enemy.x -= 5 * multiplier;
            if (Math.random() > 0.95) {
                enemy.direction *= -1;
            }
            enemy.y += enemy.direction * 2;

            if (enemy.y < 0) enemy.y = 0;
            if (enemy.y + enemy.height > gamescreen.clientHeight) {
                enemy.y = gamescreen.clientHeight - enemy.height;
            }
        } else if (enemy.type === 'sphere') {
            enemy.x -= config.pipeSpeed * multiplier;
            enemy.y += enemy.velocityY;
            enemy.velocityY += 0.3;

            if (enemy.y < 0 || enemy.y + enemy.height > gamescreen.clientHeight) {
                enemy.velocityY *= -0.8;
                enemy.bounceCount++;
            }
        }

        // Remove off-screen
        if (enemy.x + enemy.width < 0) {
            enemies.splice(index, 1);
        }
    });
}

function spawnPowerup() {
    const powerupType = Math.random() > 0.6 ? 'shield' : (Math.random() > 0.5 ? 'speedBoost' : 'slowMotion');
    const powerup = {
        x: gamescreen.clientWidth,
        y: Math.random() * (gamescreen.clientHeight - 30),
        width: 25,
        height: 25,
        type: powerupType
    };
    powerups.push(powerup);
}

function updatePowerups() {
    const config = GAME_CONFIG[gameState.level];
    let multiplier = gameState.isSlowMotion ? gameState.slowMotionMultiplier : 1;

    powerups.forEach((powerup, index) => {
        powerup.x -= config.pipeSpeed * multiplier;

        if (powerup.x + powerup.width < 0) {
            powerups.splice(index, 1);
        }
    });
}

function updateUpgrades() {
    if (gameState.isSpeedBoost) {
        gameState.speedBoostTimer--;
        if (gameState.speedBoostTimer <= 0) {
            gameState.isSpeedBoost = false;
        }
    }

    if (gameState.isSlowMotion) {
        gameState.slowMotionTimer--;
        if (gameState.slowMotionTimer <= 0) {
            gameState.isSlowMotion = false;
        }
    }
}

function checkCollisions() {
    // Pipe collision
    pipes.forEach(pipe => {
        if (
            player.x < pipe.x + pipe.width &&
            player.x + player.width > pipe.x &&
            (player.y < pipe.gapStart || player.y + player.height > pipe.gapStart + pipe.gapSize)
        ) {
            hitObstacle();
        }
    });

    // Enemy collision
    enemies.forEach(enemy => {
        if (
            player.x < enemy.x + enemy.width &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.y + player.height > enemy.y
        ) {
            hitObstacle();
        }
    });

    // Powerup collision
    powerups.forEach((powerup, index) => {
        if (
            player.x < powerup.x + powerup.width &&
            player.x + player.width > powerup.x &&
            player.y < powerup.y + powerup.height &&
            player.y + player.height > powerup.y
        ) {
            collectPowerup(powerup.type);
            powerups.splice(index, 1);
        }
    });
}

function hitObstacle() {
    if (gameState.isShield) {
        gameState.isShield = false;
        gameState.upgrades.shield = (gameState.upgrades.shield || 0) - 1;
    } else {
        gameState.health--;
        updateHUD();
    }
}

function collectPowerup(type) {
    if (type === 'shield') {
        gameState.isShield = true;
        gameState.upgrades.shield = (gameState.upgrades.shield || 0) + 1;
    } else if (type === 'speedBoost') {
        gameState.isSpeedBoost = true;
        gameState.speedBoostTimer = 300;
    } else if (type === 'slowMotion') {
        gameState.isSlowMotion = true;
        gameState.slowMotionTimer = 300;
    }

    gameState.score += 50;
    gameState.upgradeCurrency += 10;
    updateHUD();
}

function render() {
    // Update player position
    playerEl.style.transform = `translate(${player.x}px, ${player.y}px) rotate(${Math.min(player.velocity * 5, 90)}deg)`;

    // Render pipes
    const pipesContainer = document.getElementById('pipes-container');
    pipesContainer.innerHTML = pipes.map((pipe, index) => `
        <div class="pipe" style="left: ${pipe.x}px; top: 0; height: 100%;">
            <div class="pipe_upper" style="height: ${pipe.gapStart}px;"></div>
            <div class="pipe_lower" style="height: ${gamescreen.clientHeight - pipe.gapStart - pipe.gapSize}px;"></div>
        </div>
    `).join('');

    // Render enemies
    const enemiesContainer = document.getElementById('enemies-container');
    enemiesContainer.innerHTML = enemies.map(enemy => {
        if (enemy.type === 'laser') {
            return `<div class="laser" style="left: ${enemy.x}px; top: ${enemy.y}px; width: ${enemy.width}px;"></div>`;
        } else if (enemy.type === 'sphere') {
            return `<div class="sphere" style="left: ${enemy.x}px; top: ${enemy.y}px;"></div>`;
        }
    }).join('');

    // Render powerups
    const powerupsContainer = document.getElementById('powerups-container');
    powerupsContainer.innerHTML = powerups.map(powerup => `
        <div class="powerup ${powerup.type}" style="left: ${powerup.x}px; top: ${powerup.y}px;"></div>
    `).join('');
}

function endGame() {
    gameState.isRunning = false;

    if (gameState.score > gameState.highScore) {
        gameState.highScore = gameState.score;
        localStorage.setItem('flappyHighScore', gameState.highScore);
    }

    localStorage.setItem('flappyUpgradeCurrency', gameState.upgradeCurrency);

    finalScore.textContent = gameState.score;
    finalLevel.textContent = gameState.level;
    highScoreDisplay.textContent = gameState.highScore;
    scoreboard.style.display = 'flex';
}

function updateHUD() {
    scoreDisplay.textContent = gameState.score;
    levelDisplay.textContent = gameState.level;
    healthDisplay.textContent = '❤️'.repeat(Math.max(0, gameState.health));

    let upgradesText = '';
    if (gameState.isShield) upgradesText += '🛡️ ';
    if (gameState.isSpeedBoost) upgradesText += '⚡ ';
    if (gameState.isSlowMotion) upgradesText += '🐢 ';
    upgradesDisplay.textContent = upgradesText || 'None';
}

function showLevelSelect() {
    gameState.isRunning = false;
    levelSelect.style.display = 'flex';
}

function showUpgradeShop() {
    document.getElementById('shopPoints').textContent = gameState.upgradeCurrency;
    upgradeShop.style.display = 'flex';

    upgradeButtons.forEach(btn => {
        const upgrade = btn.dataset.upgrade;
        const costs = { shield: 50, speedBoost: 75, slowMotion: 100 };
        btn.disabled = gameState.upgradeCurrency < costs[upgrade];
    });
}

function hideLevelSelect() {
    levelSelect.style.display = 'none';
    upgradeShop.style.display = 'none';
}

function buyUpgrade(type) {
    const costs = { shield: 50, speedBoost: 75, slowMotion: 100 };

    if (gameState.upgradeCurrency >= costs[type]) {
        gameState.upgradeCurrency -= costs[type];
        gameState.upgrades[type] = (gameState.upgrades[type] || 0) + 1;
        localStorage.setItem('flappyUpgradeCurrency', gameState.upgradeCurrency);
        showUpgradeShop();
    }
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        gameContainer.requestFullscreen().catch(err => console.log('Fullscreen error:', err));
        document.body.classList.add('fullscreen');
    } else {
        document.exitFullscreen();
        document.body.classList.remove('fullscreen');
    }
}

function toggleMute() {
    gameState.isMuted = !gameState.isMuted;
    muteBtn.textContent = gameState.isMuted ? '🔇 Muted' : '🔊 Sound';
}
