/* ========================================
   DS-SLOT-GAM7 - Wallet & Transaction System
   ======================================== */

class WalletSystem {
    constructor() {
        this.transactions = [];
        this.depositMethods = ['Credit Card', 'Debit Card', 'Net Banking', 'UPI', 'Wallet'];
        this.withdrawMethods = ['Bank Account', 'Wallet', 'UPI'];
        this.loadTransactions();
    }

    // ========================================
    // DEPOSIT SYSTEM
    // ========================================

    async initiateDeposit(amount, method) {
        console.log(`💳 Deposit initiated: ${amount} via ${method}`);

        if (amount <= 0) {
            return { success: false, message: 'Amount must be greater than 0' };
        }

        if (!this.depositMethods.includes(method)) {
            return { success: false, message: 'Invalid payment method' };
        }

        // Simulate payment gateway processing
        const transaction = {
            id: this.generateTransactionId(),
            type: 'deposit',
            amount: amount,
            method: method,
            status: 'processing',
            timestamp: new Date().toISOString(),
            description: `Deposit via ${method}`
        };

        this.transactions.push(transaction);

        // Simulate processing delay
        return new Promise((resolve) => {
            setTimeout(() => {
                transaction.status = 'completed';
                gameState.balance += amount;
                updateBalanceDisplay();
                saveGameState();
                this.saveTransactions();

                console.log(`✅ Deposit successful: +${amount} coins`);
                resolve({
                    success: true,
                    message: `Deposit of ${amount} coins successful!`,
                    transactionId: transaction.id
                });
            }, 2000);
        });
    }

    // ========================================
    // WITHDRAWAL SYSTEM
    // ========================================

    async initiateWithdraw(amount, method) {
        console.log(`💸 Withdrawal initiated: ${amount} via ${method}`);

        if (amount <= 0) {
            return { success: false, message: 'Amount must be greater than 0' };
        }

        if (amount > gameState.balance) {
            return { success: false, message: 'Insufficient balance' };
        }

        if (!this.withdrawMethods.includes(method)) {
            return { success: false, message: 'Invalid withdrawal method' };
        }

        // Minimum withdrawal amount
        if (amount < 100) {
            return { success: false, message: 'Minimum withdrawal amount is 100' };
        }

        const transaction = {
            id: this.generateTransactionId(),
            type: 'withdrawal',
            amount: amount,
            method: method,
            status: 'pending',
            timestamp: new Date().toISOString(),
            description: `Withdrawal to ${method}`,
            fee: Math.floor(amount * 0.02) // 2% fee
        };

        this.transactions.push(transaction);

        // Deduct from balance immediately
        gameState.balance -= (amount + transaction.fee);
        updateBalanceDisplay();
        saveGameState();
        this.saveTransactions();

        // Simulate processing
        return new Promise((resolve) => {
            setTimeout(() => {
                transaction.status = 'completed';
                this.saveTransactions();

                console.log(`✅ Withdrawal successful: -${amount} coins (Fee: ${transaction.fee})`);
                resolve({
                    success: true,
                    message: `Withdrawal of ${amount} coins initiated! Fee: ${transaction.fee}`,
                    transactionId: transaction.id
                });
            }, 3000);
        });
    }

    // ========================================
    // TRANSACTION HISTORY
    // ========================================

    getTransactionHistory(limit = 10) {
        return this.transactions.slice(-limit).reverse();
    }

    getTransactionById(id) {
        return this.transactions.find(t => t.id === id);
    }

    // ========================================
    // STATISTICS
    // ========================================

    getDepositStats() {
        const deposits = this.transactions.filter(t => t.type === 'deposit' && t.status === 'completed');
        return {
            totalDeposits: deposits.reduce((sum, t) => sum + t.amount, 0),
            count: deposits.length,
            average: deposits.length > 0 ? Math.floor(deposits.reduce((sum, t) => sum + t.amount, 0) / deposits.length) : 0
        };
    }

    getWithdrawalStats() {
        const withdrawals = this.transactions.filter(t => t.type === 'withdrawal' && t.status === 'completed');
        return {
            totalWithdrawals: withdrawals.reduce((sum, t) => sum + t.amount, 0),
            count: withdrawals.length,
            totalFees: withdrawals.reduce((sum, t) => sum + t.fee, 0)
        };
    }

    // ========================================
    // UTILITY FUNCTIONS
    // ========================================

    generateTransactionId() {
        return `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }

    saveTransactions() {
        localStorage.setItem('DS_SLOT_TRANSACTIONS', JSON.stringify(this.transactions));
        console.log('💾 Transactions saved');
    }

    loadTransactions() {
        const saved = localStorage.getItem('DS_SLOT_TRANSACTIONS');
        if (saved) {
            this.transactions = JSON.parse(saved);
            console.log('📂 Transactions loaded');
        }
    }

    // Demo/Test functions
    simulateDeposit() {
        const amount = Math.floor(Math.random() * 5000) + 500;
        const method = this.depositMethods[Math.floor(Math.random() * this.depositMethods.length)];
        return this.initiateDeposit(amount, method);
    }

    simulateWithdraw() {
        const maxAmount = Math.floor(gameState.balance * 0.5);
        if (maxAmount < 100) {
            console.log('Insufficient balance for withdrawal');
            return;
        }
        const amount = Math.floor(Math.random() * maxAmount) + 100;
        const method = this.withdrawMethods[Math.floor(Math.random() * this.withdrawMethods.length)];
        return this.initiateWithdraw(amount, method);
    }
}

// Initialize Wallet System globally
const walletSystem = new WalletSystem();

// Quick Functions for UI Integration
async function handleDeposit(amount, method = 'Credit Card') {
    const result = await walletSystem.initiateDeposit(amount, method);
    if (result.success) {
        alert(`✅ ${result.message}`);
    } else {
        alert(`❌ ${result.message}`);
    }
}

async function handleWithdraw(amount, method = 'Bank Account') {
    const result = await walletSystem.initiateWithdraw(amount, method);
    if (result.success) {
        alert(`✅ ${result.message}`);
    } else {
        alert(`❌ ${result.message}`);
    }
}