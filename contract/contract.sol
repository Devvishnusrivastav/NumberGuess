// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

contract GuessTheNumber {
    uint private actualNumber;
    address public owner;
    uint public attempts;

    event GameWon(address winner, uint reward);

    constructor(uint _number) payable {
        require(msg.value >= 0.1 ether, "Contract must be funded with at least 0.1 ether.");
        owner = msg.sender;
        actualNumber = _number;
    }

    function guess(uint _guess) public returns (string memory) {
        require(_guess > 0, "Guess must be greater than 0");

        attempts++;
        if (_guess < actualNumber) {
            return "Your guess is smaller.";
        } else if (_guess > actualNumber) {
            return "Your guess is greater.";
        } else {
            uint reward = 0.01 ether;
            require(address(this).balance >= reward, "Not enough funds in the contract.");
            payable(msg.sender).transfer(reward);
            emit GameWon(msg.sender, reward);
            return "Correct! You guessed the number and won 0.01 Ether!";
        }
    }

    function reset(uint _newNumber) public {
        require(msg.sender == owner, "Only owner can reset the game.");
        actualNumber = _newNumber;
        attempts = 0;
    }

    // Fallback to receive funds
    receive() external payable {}

    function withdrawFunds() public {
        require(msg.sender == owner, "Only owner can withdraw funds.");
        payable(owner).transfer(address(this).balance);
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}
