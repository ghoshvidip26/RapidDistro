// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RUSDC is ReentrancyGuard, Ownable {
    IERC20 public immutable usdcToken;

    event PaymentSent(address indexed from, address indexed to, uint256 amount);
    event BatchPaymentSent(
        address indexed from,
        address[] recipients,
        uint256[] amounts
    );
    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);

    mapping(address => uint256) public balances;

    constructor(address _usdcToken) Ownable(msg.sender) {
        usdcToken = IERC20(_usdcToken); // USDC contract address base Sepolia 0x036CbD53842c5426634e7929541eC2318f3dCF7e
    }

    function deposit(uint256 amount) external nonReentrant {
        require(amount > 0, "Deposit amount must be greater than 0");
        require(
            usdcToken.transferFrom(msg.sender, address(this), amount),
            "USDC transfer failed"
        );

        balances[msg.sender] += amount;
        emit Deposited(msg.sender, amount);
    }

    function withdraw(uint256 amount) external nonReentrant {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        require(
            usdcToken.transfer(msg.sender, amount),
            "USDC withdrawal failed"
        );
        emit Withdrawn(msg.sender, amount);
    }

    function sendPayment(address to, uint256 amount) external nonReentrant {
        require(balances[msg.sender] >= amount, "Insufficient funds");
        require(to != address(0), "Invalid recipient");

        balances[msg.sender] -= amount;
        balances[to] += amount;

        emit PaymentSent(msg.sender, to, amount);
    }

    function batchSendPayment(
        address[] calldata recipients,
        uint256[] calldata amounts
    ) external nonReentrant {
        require(recipients.length == amounts.length, "Mismatched arrays");

        uint256 totalAmount = 0;
        for (uint256 i = 0; i < amounts.length; i++) {
            require(recipients[i] != address(0), "Invalid recipient");
            totalAmount += amounts[i];
        }

        require(balances[msg.sender] >= totalAmount, "Insufficient funds");

        for (uint256 i = 0; i < recipients.length; i++) {
            balances[msg.sender] -= amounts[i];
            balances[recipients[i]] += amounts[i];
        }

        emit BatchPaymentSent(msg.sender, recipients, amounts);
    }

    function recoverTokens(address token, uint256 amount) external onlyOwner {
        require(
            IERC20(token).transfer(owner(), amount),
            "Token recovery failed"
        );
    }
}
