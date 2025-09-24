// User data and authentication
document.addEventListener('DOMContentLoaded', function() {
    // Initialize everything after DOM is fully loaded
    initializeApp();
});

function initializeApp() {
    const users = JSON.parse(localStorage.getItem('bitcoinUsers')) || [];
    let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
    const WELCOME_BONUS = 200.00;

    // Bitcoin wallet links
    const bitcoinWallets = [
        "https://blockchain.com/wallet",
        "https://www.blockchain.com/explorer",
        "https://www.coinbase.com/wallet",
        "https://metamask.io/",
        "https://trustwallet.com/",
        "https://www.exodus.com/",
        "https://atomicwallet.io/",
        "https://electrum.org/",
        "https://bluewallet.io/",
        "https://brd.com/"
    ];

    // DOM Elements
    const authContainer = document.getElementById('authContainer');
    const dashboard = document.getElementById('dashboard');
    const loadingScreen = document.getElementById('loadingScreen');
    const welcomeBonus = document.getElementById('welcomeBonus');
    const userName = document.getElementById('userName');
    const userEmail = document.getElementById('userEmail');
    const userAvatar = document.getElementById('userAvatar');
    const balanceDisplay = document.getElementById('balance');
    const logoutBtn = document.getElementById('logoutBtn');
    const authTabs = document.getElementById('authTabs');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const depositBtn = document.getElementById('depositBtn');
    const withdrawBtn = document.getElementById('withdrawBtn');
    const buyBtcBtn = document.getElementById('buyBtcBtn');
    const bonusBtn = document.getElementById('bonusBtn');
    const randomWalletLink = document.getElementById('randomWalletLink');

    // Modals
    const withdrawModal = document.getElementById('withdrawModal');
    const depositModal = document.getElementById('depositModal');
    const buyBtcModal = document.getElementById('buyBtcModal');
    const paystackModal = document.getElementById('paystackModal');

    // Close buttons
    const withdrawClose = document.getElementById('withdrawClose');
    const depositClose = document.getElementById('depositClose');
    const buyBtcClose = document.getElementById('buyBtcClose');
    const paystackClose = document.getElementById('paystackClose');

    // Form elements
    const btcAmountInput = document.getElementById('btcAmount');
    const nairaAmountInput = document.getElementById('nairaAmount');
    const paystackAmount = document.getElementById('paystackAmount');

    // Action buttons
    const goToDeposit = document.getElementById('goToDeposit');
    const cancelWithdraw = document.getElementById('cancelWithdraw');
    const confirmDeposit = document.getElementById('confirmDeposit');
    const cancelDeposit = document.getElementById('cancelDeposit');
    const payWithPaystack = document.getElementById('payWithPaystack');
    const cancelBuy = document.getElementById('cancelBuy');
    const confirmPaystack = document.getElementById('confirmPaystack');
    const cancelPaystack = document.getElementById('cancelPaystack');

    // Copy buttons
    const copyButtons = document.querySelectorAll('.copy-btn');

    // Set random Bitcoin wallet link
    function setRandomWalletLink() {
        const randomIndex = Math.floor(Math.random() * bitcoinWallets.length);
        if (randomWalletLink) {
            randomWalletLink.href = bitcoinWallets[randomIndex];
        }
    }

    // Password validation
    function validatePassword(password) {
        // At least 8 characters with both letters and numbers
        const regex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
        return regex.test(password);
    }

    // Safe localStorage functions
    function safeSetItem(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('LocalStorage error:', e);
            return false;
        }
    }

    function safeGetItem(key) {
        try {
            return JSON.parse(localStorage.getItem(key));
        } catch (e) {
            console.error('LocalStorage error:', e);
            return null;
        }
    }

    // Initialize the app
    function init() {
        // Check if user is already logged in
        if (currentUser) {
            showDashboard();
        } else {
            if (authContainer) authContainer.style.display = 'flex';
        }

        // Set random wallet link on page load
        setRandomWalletLink();

        // Add event listeners only if elements exist
        setupEventListeners();
    }

    // Setup all event listeners
    function setupEventListeners() {
        // Auth tabs functionality
        if (document.querySelectorAll('.auth-tab')) {
            document.querySelectorAll('.auth-tab').forEach(tab => {
                tab.addEventListener('click', () => {
                    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');
                    
                    if (loginForm) loginForm.classList.remove('active');
                    if (signupForm) signupForm.classList.remove('active');
                    
                    const targetForm = document.getElementById(`${tab.dataset.tab}Form`);
                    if (targetForm) targetForm.classList.add('active');
                });
            });
        }

        // Login functionality
        if (loginBtn) {
            loginBtn.addEventListener('click', handleLogin);
        }

        // Signup functionality
        if (signupBtn) {
            signupBtn.addEventListener('click', handleSignup);
        }

        // Logout functionality
        if (logoutBtn) {
            logoutBtn.addEventListener('click', handleLogout);
        }

        // Dashboard buttons
        if (depositBtn) depositBtn.addEventListener('click', () => showModal(depositModal));
        if (withdrawBtn) withdrawBtn.addEventListener('click', () => showModal(withdrawModal));
        if (buyBtcBtn) buyBtcBtn.addEventListener('click', () => showModal(buyBtcModal));

        // Modal close buttons
        if (withdrawClose) withdrawClose.addEventListener('click', () => hideModal(withdrawModal));
        if (depositClose) depositClose.addEventListener('click', () => hideModal(depositModal));
        if (buyBtcClose) buyBtcClose.addEventListener('click', () => hideModal(buyBtcModal));
        if (paystackClose) paystackClose.addEventListener('click', () => hideModal(paystackModal));

        // Modal action buttons
        if (goToDeposit) goToDeposit.addEventListener('click', goToDepositHandler);
        if (cancelWithdraw) cancelWithdraw.addEventListener('click', () => hideModal(withdrawModal));
        if (confirmDeposit) confirmDeposit.addEventListener('click', confirmDepositHandler);
        if (cancelDeposit) cancelDeposit.addEventListener('click', () => hideModal(depositModal));
        if (payWithPaystack) payWithPaystack.addEventListener('click', payWithPaystackHandler);
        if (cancelBuy) cancelBuy.addEventListener('click', () => hideModal(buyBtcModal));
        if (confirmPaystack) confirmPaystack.addEventListener('click', confirmPaystackHandler);
        if (cancelPaystack) cancelPaystack.addEventListener('click', () => hideModal(paystackModal));

        // Bonus button
        if (bonusBtn) bonusBtn.addEventListener('click', bonusBtnHandler);

        // BTC to Naira conversion
        if (btcAmountInput) {
            btcAmountInput.addEventListener('input', btcAmountInputHandler);
        }

        // Copy button functionality
        if (copyButtons) {
            copyButtons.forEach(button => {
                button.addEventListener('click', copyButtonHandler);
            });
        }
    }

    // Event handler functions
    function handleLogin() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        if (!email || !password) {
            alert('Please fill in all fields');
            return;
        }
        
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            currentUser = user;
            safeSetItem('currentUser', currentUser);
            showLoading(false);
        } else {
            alert('Invalid email or password');
        }
    }

    function handleSignup() {
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('signupConfirmPassword').value;
        
        if (!name || !email || !password || !confirmPassword) {
            alert('Please fill in all fields');
            return;
        }
        
        if (!validatePassword(password)) {
            alert('Password must be at least 8 characters long and contain both letters and numbers');
            return;
        }
        
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        
        if (users.some(u => u.email === email)) {
            alert('User with this email already exists');
            return;
        }
        
        const newUser = { 
            name, 
            email, 
            password, 
            balance: WELCOME_BONUS,
            hasReceivedBonus: false
        };
        users.push(newUser);
        safeSetItem('bitcoinUsers', users);
        
        currentUser = newUser;
        safeSetItem('currentUser', currentUser);
        showLoading(true);
    }

    function handleLogout() {
        currentUser = null;
        localStorage.removeItem('currentUser');
        hideDashboard();
    }

    function showModal(modal) {
        if (modal) modal.style.display = 'flex';
    }

    function hideModal(modal) {
        if (modal) modal.style.display = 'none';
    }

    function goToDepositHandler() {
        hideModal(withdrawModal);
        showModal(depositModal);
    }

    function confirmDepositHandler() {
        alert('Thank you! We will verify your transfer and credit your account within 24 hours.');
        hideModal(depositModal);
    }

    function payWithPaystackHandler() {
        const amount = btcAmountInput.value;
        if (!amount || amount < 5) {
            alert('Minimum purchase amount is $5');
            return;
        }
        
        if (paystackAmount) paystackAmount.textContent = `$${parseFloat(amount).toFixed(2)}`;
        hideModal(buyBtcModal);
        showModal(paystackModal);
    }

    function confirmPaystackHandler() {
        alert('Thank you! We will verify your transfer and deliver your Bitcoin within 24 hours.');
        hideModal(paystackModal);
        if (btcAmountInput) btcAmountInput.value = '';
        if (nairaAmountInput) nairaAmountInput.value = '';
    }

    function bonusBtnHandler() {
        hideModal(welcomeBonus);
        showDashboard();
    }

    function btcAmountInputHandler() {
        const amount = parseFloat(btcAmountInput.value) || 0;
        const nairaAmount = amount * 1489.89;
        if (nairaAmountInput) {
            nairaAmountInput.value = `₦${nairaAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        }
    }

    function copyButtonHandler() {
        const text = this.dataset.text;
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                const originalHtml = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i>';
                setTimeout(() => {
                    this.innerHTML = originalHtml;
                }, 2000);
            });
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            const originalHtml = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => {
                this.innerHTML = originalHtml;
            }, 2000);
        }
    }

    // Show loading screen
    function showLoading(showBonus) {
        if (authContainer) authContainer.style.display = 'none';
        if (loadingScreen) loadingScreen.style.display = 'flex';
        
        setTimeout(() => {
            if (loadingScreen) loadingScreen.style.display = 'none';
            if (showBonus) {
                if (welcomeBonus) welcomeBonus.style.display = 'flex';
            } else {
                showDashboard();
            }
        }, 2000);
    }

    // Show dashboard
    function showDashboard() {
        if (userName) userName.textContent = currentUser.name;
        if (userEmail) userEmail.textContent = currentUser.email;
        if (userAvatar) userAvatar.textContent = currentUser.name.charAt(0).toUpperCase();
        if (balanceDisplay) balanceDisplay.textContent = currentUser.balance.toFixed(2);
        
        // Hide auth tabs when logged in
        if (authTabs) authTabs.style.display = 'none';
        
        if (dashboard) dashboard.style.display = 'block';
        if (authContainer) authContainer.style.display = 'none';
    }

    // Hide dashboard
    function hideDashboard() {
        if (dashboard) dashboard.style.display = 'none';
        if (authContainer) authContainer.style.display = 'flex';
        
        // Show auth tabs when logged out
        if (authTabs) authTabs.style.display = 'flex';
        
        // Clear form fields
        const loginEmail = document.getElementById('loginEmail');
        const loginPassword = document.getElementById('loginPassword');
        const signupName = document.getElementById('signupName');
        const signupEmail = document.getElementById('signupEmail');
        const signupPassword = document.getElementById('signupPassword');
        const signupConfirmPassword = document.getElementById('signupConfirmPassword');
        
        if (loginEmail) loginEmail.value = '';
        if (loginPassword) loginPassword.value = '';
        if (signupName) signupName.value = '';
        if (signupEmail) signupEmail.value = '';
        if (signupPassword) signupPassword.value = '';
        if (signupConfirmPassword) signupConfirmPassword.value = '';
    }

    // Initialize the application
    init();
}
