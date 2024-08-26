import './App.css';
import React, { useState } from 'react';
import { ethers } from 'ethers';
import MyContractABI from './abi/MyContract.json'; // Adjust path as needed

const CONTRACT_ADDRESS = '0xYourDeployedContractAddress'; // Replace with actual deployed contract address

function App() {
    const [isInGame, setIsInGame] = useState(0);
    const [account, setAccount] = useState(null);
    const [betAmount, setBetAmount] = useState('');
    const [provider, setProvider] = useState(null);
    const [contract, setContract] = useState(null);
    const [message, setMessage] = useState('');

    // Connect to MetaMask and set up contract interaction
    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                const userAccount = accounts[0];
                setAccount(userAccount);
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();

                const contract = new ethers.Contract(CONTRACT_ADDRESS, MyContractABI.abi, signer);
                setContract(contract);
                setProvider(provider);

                // Set the player address in the contract
                const tx = await contract.setPlayer(userAccount);
                await tx.wait();

                setMessage('Wallet connected and player set!');
            } catch (error) {
                console.error('Failed to connect wallet:', error);
                setMessage('Failed to connect wallet');
            }
        } else {
            console.error('MetaMask is not installed');
            setMessage('MetaMask is not installed');
        }
    };

    // Start the game
    function onPlayGame() {
        setIsInGame(1);
    }

    // Place a bet
    const placeBet = async () => {
        if (!contract) {
            console.error('Contract is not set');
            return;
        }
        try {
            const tx = await contract.place_bet(ethers.utils.parseEther(betAmount));
            await tx.wait();
            setMessage('Bet placed successfully!');
        } catch (error) {
            console.error('Error placing bet:', error);
            setMessage('Error placing bet');
        }
    };

    // Handle the coin flip interaction
    const flipCoin = async () => {
        if (!contract) {
            console.error('Contract is not set');
            return;
        }
        try {
            const guess = Math.round(Math.random()); // 0 or 1 randomly
            const tx = await contract.coinFlip(guess, { value: ethers.utils.parseEther(betAmount) });
            await tx.wait();
            setMessage('Coin flipped!');
        } catch (error) {
            console.error('Error flipping coin:', error);
            setMessage('Error flipping coin');
        }
    };

    return (
        <div className="App">
            {isInGame ? (
                <div>
                    <button onClick={connectWallet}>
                        {account ? `Connected: ${account}` : 'Connect Wallet'}
                    </button>
                    <button onClick={onPlayGame}>Play The Game</button>
                </div>
            ) : (
                <div>
                    <h1>Coin Flip Game</h1>
                    <h2>
                        Place bet{' '}
                        <input
                            value={betAmount}
                            onChange={(e) => setBetAmount(e.target.value)}
                            placeholder="0.1"
                        />
                    </h2>
                    <button onClick={placeBet}>Place Bet</button>
                    <button onClick={flipCoin}>Flip the coin</button>
                    {message && <p>{message}</p>}
                </div>
            )}
        </div>
    );
}

export default App;
