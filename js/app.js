/* ========================================
   DS-SLOT-GAM7 - Main Game Logic
   ======================================== */

// Game Configuration
const GAME_CONFIG = {
    REELS: 5,
    ROWS: 6,
    PAYLINES: 25,
    SYMBOLS: ['🍎', '🍊', '🍇', '🍓', '💎', '👑'],
    SYMBOL_VALUES: {
        '🍎': 10,
        '🍊': 20,
        '🍇': 50,
        '🍓': 100,
        '💎': 300,
        '👑': 500
    },
    SPIN_DURATION: 2000, // milliseconds
    TURBO_SPIN_DURATION: 1000
};

// Game State
let gameState = {
    balance: 50000,
    currentBet: 100,
    isSpinning: false,
    autoSpinsRemaining: 0,
    isTurboMode: false,
    freeSpins: 0,
    multiplier: 1,
    lastWin: 0,
    vipLevel: 1,
    jackpot: 1000000,
    reelResults: []
};

// Initialize Game
document.addEventListener('DOMContentLoaded', function() {
    initializeGame();
    setupEventListeners();
});

function initializeGame() {
    console.log('🎮 Initializing DS-Slot-GAM7...');
    updateBalanceDisplay();
    updateGameStats();
    loadGameState();
}

function setupEventListeners() {
    // Bet Buttons
    document.querySelectorAll('.bet-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            selectBet(parseInt(this.dataset.bet));
        });
    });

    // Spin Button
    document.getElementById('spinBtn').addEventListener('click', spin);

    // Auto Spin Button
    document.getElementById('autoSpinBtn').addEventListener('click', startAutoSpin);

    // Turbo Spin Button
    document.getElementById('turboSpinBtn').addEventListener('click', toggleTurboMode);

    // Additional Buttons
    document.getElementById('paytableBtn').addEventListener('click', () => openModal('paytableModal'));
    document.getElementById('settingsBtn').addEventListener('click', () => alert('Settings coming soon!'));
    document.getElementById('bonusBtn').addEventListener('click', () => alert('Daily Bonus: +500 coins!'));

    // Modal Close Buttons
    document.querySelectorAll('.close').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').classList.remove('show');
        });
    });

    // Login Button
    document.getElementById('loginBtn').addEventListener('click', () => openModal('loginModal'));

    // Login Form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Login functionality coming with Firebase integration!');
        });
    }
}

// ========================================
// BET MANAGEMENT
// ========================================

function selectBet(amount) {
    if (gameState.isSpinning || gameState.autoSpinsRemaining > 0) {
        alert('Cannot change bet while spinning!');
        return;
    }

    if (amount > gameState.balance) {
        alert('Insufficient balance for this bet!');
        return;
    }

    gameState.currentBet = amount;

    // Update active bet button
    document.querySelectorAll('.bet-btn').forEach(btn => {
        btn.classList.remove('active');
        if (parseInt(btn.dataset.bet) === amount) {
            btn.classList.add('active');
        }
    });

    document.getElementById('currentBet').textContent = amount.toLocaleString();
    console.log(`💰 Bet changed to: ${amount}`);
}

// ========================================
// SPIN LOGIC
// ========================================

function spin() {
    if (gameState.isSpinning) {
        return;
    }

    if (gameState.autoSpinsRemaining > 0) {
        gameState.autoSpinsRemaining--;
        if (gameState.autoSpinsRemaining === 0) {
            document.getElementById('autoSpinBtn').textContent = 'Auto Spin (5)';
        }
    }

    // Deduct bet from balance
    if (gameState.balance < gameState.currentBet) {
        alert('Insufficient balance to spin!');
        return;
    }

    gameState.balance -= gameState.currentBet;
    gameState.isSpinning = true;

    // Disable buttons during spin
    document.getElementById('spinBtn').disabled = true;
    document.getElementById('autoSpinBtn').disabled = true;
    document.getElementById('turboSpinBtn').disabled = true;
    document.querySelectorAll('.bet-btn').forEach(btn => btn.disabled = true);

    // Perform spin
    performSpin();
}

function performSpin() {
    const spinDuration = gameState.isTurboMode ? GAME_CONFIG.TURBO_SPIN_DURATION : GAME_CONFIG.SPIN_DURATION;

    // Generate random results for each reel
    gameState.reelResults = [];
    for (let i = 1; i <= GAME_CONFIG.REELS; i++) {
        const reel = document.getElementById(`reel${i}`);
        const randomIndex = Math.floor(Math.random() * GAME_CONFIG.ROWS);
        gameState.reelResults.push(randomIndex);

        // Animate reel spin
        animateReel(reel, randomIndex, spinDuration);
    }

    // Check for wins after spin completes
    setTimeout(() => {
        checkForWins();
        gameState.isSpinning = false;

        // Re-enable buttons
        document.getElementById('spinBtn').disabled = false;
        document.getElementById('autoSpinBtn').disabled = false;
        document.getElementById('turboSpinBtn').disabled = false;
        document.querySelectorAll('.bet-btn').forEach(btn => btn.disabled = false);

        // Continue auto spin if active
        if (gameState.autoSpinsRemaining > 0) {
            setTimeout(() => spin(), 500);
        }
    }, spinDuration);
}

function animateReel(reel, finalIndex, duration) {
    const symbols = reel.querySelectorAll('.symbol');
    const symbolHeight = 60;
    let currentPosition = 0;
    const rotations = Math.floor(Math.random() * 5) + 10;
    const totalDistance = (rotations * GAME_CONFIG.ROWS + finalIndex) * symbolHeight;

    const startTime = Date.now();
    const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smooth deceleration
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const distance = totalDistance * easeProgress;

        reel.style.transform = `translateY(-${distance}px)`;

        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    };

    animate();
}

// ========================================
// WIN DETECTION
// ========================================

function checkForWins() {
    let totalWin = 0;

    // Check for simple wins (3 in a row)
    const winnings = calculatePaylines();
    totalWin += winnings;

    // Check for scatter (3+ symbols)
    const scatterBonus = checkScatters();
    totalWin += scatterBonus;

    // Check for jackpot (rare)
    if (Math.random() < 0.001) { // 0.1% chance
        totalWin += gameState.jackpot;
        showJackpotWin();
    }

    // Apply multiplier
    totalWin = Math.floor(totalWin * gameState.multiplier);

    if (totalWin > 0) {
        gameState.balance += totalWin;
        gameState.lastWin = totalWin;
        displayWin(totalWin);
        playWinSound();
    }

    updateBalanceDisplay();
    updateGameStats();
    saveGameState();
}

function calculatePaylines() {
    // Simplified payline calculation
    // In a real game, this would check all 25 paylines
    let totalWin = 0;

    // Get symbols from each reel
    const reelSymbols = gameState.reelResults.map(index => GAME_CONFIG.SYMBOLS[index % GAME_CONFIG.SYMBOLS.length]);

    // Check for 3, 4, or 5 of a kind
    if (reelSymbols[0] === reelSymbols[1] && reelSymbols[1] === reelSymbols[2]) {
        const symbol = reelSymbols[0];
        const baseValue = GAME_CONFIG.SYMBOL_VALUES[symbol];

        if (reelSymbols[2] === reelSymbols[3] && reelSymbols[3] === reelSymbols[4]) {
            // 5 of a kind
            totalWin += baseValue * 20 * gameState.currentBet;
            console.log(`🎉 5 of a kind: ${symbol} - Win: ${totalWin}`);
        } else if (reelSymbols[2] === reelSymbols[3]) {
            // 4 of a kind
            totalWin += baseValue * 10 * gameState.currentBet;
            console.log(`🎉 4 of a kind: ${symbol} - Win: ${totalWin}`);
        } else {
            // 3 of a kind
            totalWin += baseValue * 5 * gameState.currentBet;
            console.log(`🎉 3 of a kind: ${symbol} - Win: ${totalWin}`);
        }
    }

    return totalWin;
}

function checkScatters() {
    // Simplified scatter check
    let scatterCount = 0;
    const scatterSymbol = '💎';

    gameState.reelResults.forEach(index => {
        if (GAME_CONFIG.SYMBOLS[index % GAME_CONFIG.SYMBOLS.length] === scatterSymbol) {
            scatterCount++;
        }
    });

    if (scatterCount >= 3) {
        const freeSpins = scatterCount * 5;
        gameState.freeSpins += freeSpins;
        console.log(`✨ Scatter! ${scatterCount} scatters - ${freeSpins} free spins awarded!`);
        return scatterCount * 100 * gameState.currentBet;
    }

    return 0;
}

function displayWin(amount) {
    const winDisplay = document.getElementById('winDisplay');
    const winAmount = document.getElementById('winAmount');

    winAmount.textContent = `WIN: ${amount.toLocaleString()} 💰`;
    winDisplay.classList.add('show');

    setTimeout(() => {
        winDisplay.classList.remove('show');
    }, 3000);
}

function showJackpotWin() {
    alert(`🎊 JACKPOT WIN! 🎊\n${gameState.jackpot.toLocaleString()} coins!\n\nCongratulations! You're extremely lucky!`);
    console.log('💎 JACKPOT WON!');
}

// ========================================
// AUTO SPIN & TURBO MODE
// ========================================

function startAutoSpin() {
    if (gameState.isSpinning) return;

    gameState.autoSpinsRemaining = 5;
    document.getElementById('autoSpinBtn').textContent = `Auto Spin (${gameState.autoSpinsRemaining})`;
    spin();
}

function toggleTurboMode() {
    gameState.isTurboMode = !gameState.isTurboMode;
    const btn = document.getElementById('turboSpinBtn');

    if (gameState.isTurboMode) {
        btn.style.background = 'linear-gradient(135deg, #ff6b6b 0%, #ff8e72 100%)';
        btn.style.boxShadow = '0 5px 15px rgba(255, 107, 107, 0.4)';
        console.log('⚡ Turbo Mode: ON');
    } else {
        btn.style.background = '';
        btn.style.boxShadow = '';
        console.log('⚡ Turbo Mode: OFF');
    }
}

// ========================================
// UI UPDATES
// ========================================

function updateBalanceDisplay() {
    document.getElementById('balance').textContent = gameState.balance.toLocaleString();
}

function updateGameStats() {
    document.getElementById('lastWin').textContent = gameState.lastWin.toLocaleString();
    document.getElementById('freeSpins').textContent = gameState.freeSpins;
    document.getElementById('multiplier').textContent = `${gameState.multiplier}x`;
    document.getElementById('vipLevel').textContent = gameState.vipLevel;
    document.getElementById('jackpot').textContent = gameState.jackpot.toLocaleString();
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        document.addEventListener('click', closeModalOnOutsideClick);
    }
}

function closeModalOnOutsideClick(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('show');
    }
}

// ========================================
// SOUND EFFECTS (Placeholder)
// ========================================

function playWinSound() {
    // Sound effects will be added later
    console.log('🔊 Win sound would play here');
    // Example: new Audio('sounds/win.mp3').play();
}

function playSpinSound() {
    // Sound effects will be added later
    console.log('🔊 Spin sound would play here');
}

// ========================================
// LOCAL STORAGE
// ========================================

function saveGameState() {
    localStorage.setItem('DS_SLOT_GAME_STATE', JSON.stringify(gameState));
    console.log('💾 Game state saved');
}

function loadGameState() {
    const saved = localStorage.getItem('DS_SLOT_GAME_STATE');
    if (saved) {
        Object.assign(gameState, JSON.parse(saved));
        updateBalanceDisplay();
        updateGameStats();
        console.log('📂 Game state loaded');
    }
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

function getRandomSymbol() {
    return GAME_CONFIG.SYMBOLS[Math.floor(Math.random() * GAME_CONFIG.SYMBOLS.length)];
}

// Add money cheat (for testing)
function addMoney(amount) {
    gameState.balance += amount;
    updateBalanceDisplay();
    saveGameState();
    console.log(`Added ${amount} coins. Balance: ${gameState.balance}`);
}

// Increase VIP level (for testing)
function increaseVIP() {
    if (gameState.vipLevel < 10) {
        gameState.vipLevel++;
        gameState.multiplier += 0.1;
        updateGameStats();
        saveGameState();
        console.log(`VIP Level: ${gameState.vipLevel}, Multiplier: ${gameState.multiplier}x`);
    }
}

// ========================================
// INITIALIZATION MESSAGES
// ========================================

console.log('%c🎰 DS-SLOT-GAM7 Initialized! 🎰', 'color: #d4af37; font-size: 16px; font-weight: bold;');
console.log('%cGame Configuration Loaded', 'color: #ffd700; font-size: 12px;');
console.log('%cUse addMoney(amount) or increaseVIP() for testing', 'color: #999; font-size: 11px;');
