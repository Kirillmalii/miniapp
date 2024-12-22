// Initialize Telegram WebApp
const tg = window.Telegram.WebApp;
tg.expand();

// Game state
let gameState = {
    score: 0,
    clickPower: 1,
    autoClickerCount: 0,
    grandmaCount: 0,
    factoryCount: 0,
    clickUpgradeCost: 10,
    autoClickerCost: 50,
    grandmaCost: 100,
    factoryCost: 500,
    achievements: [],
    totalClicks: 0,
    totalCookies: 0
};

// Achievements data
const achievements = [
    { id: 'first_click', name: ' First Click', requirement: 1, type: 'clicks' },
    { id: '100_clicks', name: ' Click Master', requirement: 100, type: 'clicks' },
    { id: '1000_clicks', name: ' Click God', requirement: 1000, type: 'clicks' },
    { id: '100_cookies', name: ' Cookie Lover', requirement: 100, type: 'cookies' },
    { id: '1000_cookies', name: ' Cookie Master', requirement: 1000, type: 'cookies' },
    { id: '10000_cookies', name: ' Cookie God', requirement: 10000, type: 'cookies' }
];

// DOM elements
const scoreElement = document.getElementById('score');
const perClickElement = document.getElementById('perClick');
const perSecondElement = document.getElementById('perSecond');
const clickButton = document.getElementById('clickButton');
const upgradeClickButton = document.getElementById('upgradeClick');
const buyAutoClickerButton = document.getElementById('buyAutoClicker');
const buyGrandmaButton = document.getElementById('buyGrandma');
const buyFactoryButton = document.getElementById('buyFactory');
const upgradeClickCostElement = document.getElementById('upgradeClickCost');
const autoClickerCostElement = document.getElementById('autoClickerCost');
const grandmaCostElement = document.getElementById('grandmaCost');
const factoryCostElement = document.getElementById('factoryCost');
const achievementCountElement = document.getElementById('achievementCount');
const achievementPopup = document.getElementById('achievementPopup');
const achievementText = document.getElementById('achievementText');

// Update display
function updateDisplay() {
    scoreElement.textContent = Math.floor(gameState.score);
    perClickElement.textContent = gameState.clickPower;
    perSecondElement.textContent = 
        gameState.autoClickerCount + 
        (gameState.grandmaCount * 5) + 
        (gameState.factoryCount * 25);
    
    upgradeClickCostElement.textContent = gameState.clickUpgradeCost;
    autoClickerCostElement.textContent = gameState.autoClickerCost;
    grandmaCostElement.textContent = gameState.grandmaCost;
    factoryCostElement.textContent = gameState.factoryCost;
    achievementCountElement.textContent = gameState.achievements.length;

    // Update button states
    upgradeClickButton.disabled = gameState.score < gameState.clickUpgradeCost;
    buyAutoClickerButton.disabled = gameState.score < gameState.autoClickerCost;
    buyGrandmaButton.disabled = gameState.score < gameState.grandmaCost;
    buyFactoryButton.disabled = gameState.score < gameState.factoryCost;
}

// Show achievement popup
function showAchievementPopup(achievementName) {
    achievementText.textContent = `Achievement Unlocked: ${achievementName}`;
    achievementPopup.classList.add('show');
    setTimeout(() => {
        achievementPopup.classList.remove('show');
    }, 3000);
}

// Check achievements
function checkAchievements() {
    achievements.forEach(achievement => {
        if (!gameState.achievements.includes(achievement.id)) {
            let requirement = achievement.requirement;
            let current = achievement.type === 'clicks' ? 
                gameState.totalClicks : gameState.totalCookies;
            
            if (current >= requirement) {
                gameState.achievements.push(achievement.id);
                showAchievementPopup(achievement.name);
                updateDisplay();
            }
        }
    });
}

// Click handler
clickButton.addEventListener('click', () => {
    gameState.score += gameState.clickPower;
    gameState.totalClicks++;
    gameState.totalCookies += gameState.clickPower;
    updateDisplay();
    checkAchievements();

    // Cookie click animation
    clickButton.style.transform = 'scale(0.95)';
    setTimeout(() => {
        clickButton.style.transform = 'scale(1)';
    }, 100);
});

// Upgrade click power
upgradeClickButton.addEventListener('click', () => {
    if (gameState.score >= gameState.clickUpgradeCost) {
        gameState.score -= gameState.clickUpgradeCost;
        gameState.clickPower *= 2;
        gameState.clickUpgradeCost = Math.floor(gameState.clickUpgradeCost * 2.5);
        updateDisplay();
    }
});

// Buy auto clicker
buyAutoClickerButton.addEventListener('click', () => {
    if (gameState.score >= gameState.autoClickerCost) {
        gameState.score -= gameState.autoClickerCost;
        gameState.autoClickerCount += 1;
        gameState.autoClickerCost = Math.floor(gameState.autoClickerCost * 1.5);
        updateDisplay();
    }
});

// Buy grandma
buyGrandmaButton.addEventListener('click', () => {
    if (gameState.score >= gameState.grandmaCost) {
        gameState.score -= gameState.grandmaCost;
        gameState.grandmaCount += 1;
        gameState.grandmaCost = Math.floor(gameState.grandmaCost * 1.5);
        updateDisplay();
    }
});

// Buy factory
buyFactoryButton.addEventListener('click', () => {
    if (gameState.score >= gameState.factoryCost) {
        gameState.score -= gameState.factoryCost;
        gameState.factoryCount += 1;
        gameState.factoryCost = Math.floor(gameState.factoryCost * 1.5);
        updateDisplay();
    }
});

// Auto production loop
setInterval(() => {
    const production = 
        gameState.autoClickerCount + 
        (gameState.grandmaCount * 5) + 
        (gameState.factoryCount * 25);
    
    if (production > 0) {
        gameState.score += production;
        gameState.totalCookies += production;
        updateDisplay();
        checkAchievements();
    }
}, 1000);

// Save game state
function saveGame() {
    localStorage.setItem('cookieClickerState', JSON.stringify(gameState));
}

// Load game state
function loadGame() {
    const savedState = localStorage.getItem('cookieClickerState');
    if (savedState) {
        gameState = JSON.parse(savedState);
        updateDisplay();
        checkAchievements();
    }
}

// Save game every 30 seconds
setInterval(saveGame, 30000);

// Initialize game
loadGame();
updateDisplay();
