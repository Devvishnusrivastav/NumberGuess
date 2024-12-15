const contractAddress = "0xAc60F584F16F48206C0f9E0cCFE22a6b8F3981b9";
        const abi = [
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "_number",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "payable",
                "type": "constructor"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "address",
                        "name": "winner",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "reward",
                        "type": "uint256"
                    }
                ],
                "name": "GameWon",
                "type": "event"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "_guess",
                        "type": "uint256"
                    }
                ],
                "name": "guess",
                "outputs": [
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    }
                ],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "_newNumber",
                        "type": "uint256"
                    }
                ],
                "name": "reset",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "withdrawFunds",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "stateMutability": "payable",
                "type": "receive"
            },
            {
                "inputs": [],
                "name": "attempts",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "getBalance",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "owner",
                "outputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            }
        ];

        let web3;
        let contract;
        let userAddress;

        async function connectWallet() {
            if (window.ethereum) {
                web3 = new Web3(window.ethereum);
                try {
                    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
                    userAddress = accounts[0];
                    document.getElementById("walletAddress").innerText = `Connected Wallet: ${userAddress}`;
                    document.getElementById("connectWallet").style.display = "none";
                    document.getElementById("gameInfo").style.display = "block";
                    document.getElementById("guessSection").style.display = "block";
                    contract = new web3.eth.Contract(abi, contractAddress);

                    // Fetch initial attempts
                    const attempts = await contract.methods.attempts().call();
                    document.getElementById("attempts").innerText = attempts;
                } catch (error) {
                    console.error(error);
                    alert("Failed to connect wallet.");
                }
            } else {
                alert("Please install MetaMask!");
            }
        }

        async function makeGuess() {
            const guess = document.getElementById("guessInput").value;
            if (!guess) {
                alert("Please enter a number!");
                return;
            }

            try {
                const feedback = await contract.methods.guess(guess).call({ from: userAddress });
                await contract.methods.guess(guess).send({ from: userAddress });

                // Update feedback and attempts
                document.getElementById("feedback").innerText = feedback;
                const attempts = await contract.methods.attempts().call();
                document.getElementById("attempts").innerText = attempts;
            } catch (error) {
                console.error(error);
                alert("An error occurred while making the guess.");
            }
        }