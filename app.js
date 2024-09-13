document.addEventListener('DOMContentLoaded', () => {
    updateBalance();
    updateTransactions();
    document.getElementById('wallet-login-btn').addEventListener('click', connectWallet);
});

async function updateBalance() {
    try {
        const response = await fetch('/api/balance');
        const data = await response.json();
        document.getElementById('balance').textContent = data.balance.toFixed(2);
    } catch (error) {
        console.error('Error fetching balance:', error);
    }
}

async function deposit() {
    const amount = parseFloat(document.getElementById('depositAmount').value);
    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }

    try {
        const response = await fetch('/api/deposit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ amount }),
        });

        const data = await response.json();
        if (response.ok) {
            alert(data.message);
            updateBalance();
            updateTransactions();
            document.getElementById('depositAmount').value = '';
        } else {
            alert(data.error);
        }
    } catch (error) {
        console.error('Error depositing:', error);
        alert('An error occurred while depositing');
    }
}

async function withdraw() {
    const amount = parseFloat(document.getElementById('withdrawAmount').value);
    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }

    try {
        const response = await fetch('/api/withdraw', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ amount }),
        });

        const data = await response.json();
        if (response.ok) {
            alert(data.message);
            updateBalance();
            updateTransactions();
            document.getElementById('withdrawAmount').value = '';
        } else {
            alert(data.error);
        }
    } catch (error) {
        console.error('Error withdrawing:', error);
        alert('An error occurred while withdrawing');
    }
}

async function updateTransactions() {
    try {
        const response = await fetch('/api/transactions');
        const transactions = await response.json();
        const transactionList = document.getElementById('transactionList');
        transactionList.innerHTML = '';

        transactions.forEach(transaction => {
            const li = document.createElement('li');
            const amount = Math.abs(transaction.amount).toFixed(2);
            const type = transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1);
            const date = new Date(transaction.timestamp).toLocaleString();
            li.textContent = `${type}: $${amount} - ${date}`;
            transactionList.appendChild(li);
        });
    } catch (error) {
        console.error('Error fetching transactions:', error);
    }
}

async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            const address = accounts[0];
            document.getElementById('wallet-login-btn').textContent = `Connected: ${address.slice(0, 6)}...${address.slice(-4)}`;
            alert('Wallet connected successfully!');
        } catch (error) {
            console.error('Failed to connect wallet:', error);
            alert('Failed to connect wallet. Please try again.');
        }
    } else {
        alert('MetaMask is not installed. Please install it to use this feature.');
    }
}
