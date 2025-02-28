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

    constructor(address _usdcToken) Ownable(msg.sender) {
        usdcToken = IERC20(_usdcToken); // USDC contract address base Sepolia 0x036CbD53842c5426634e7929541eC2318f3dCF7e
    }

    function sendPayment(address to, uint256 amount) external nonReentrant {
        require(to != address(0), "Invalid recipient");
        require(amount > 0, "Amount must be greater than 0");
        require(
            usdcToken.allowance(msg.sender, address(this)) >= amount,
            "Insufficient allowance"
        );
        require(
            usdcToken.transferFrom(msg.sender, to, amount),
            "USDC transfer failed"
        );

        emit PaymentSent(msg.sender, to, amount);
    }

    function batchSendPayment(
        address[] calldata recipients,
        uint256[] calldata amounts
    ) external nonReentrant {
        require(recipients.length == amounts.length, "Mismatched input arrays");

        uint256 totalAmount = 0;
        for (uint256 i = 0; i < recipients.length; i++) {
            totalAmount += amounts[i];

            require(
                usdcToken.transferFrom(msg.sender, recipients[i], amounts[i]),
                "USDC transfer failed"
            );
        }

        require(
            usdcToken.allowance(msg.sender, address(this)) >= totalAmount,
            "Insufficient allowance"
        );

        emit BatchPaymentSent(msg.sender, recipients, amounts);
    }

    function recoverTokens(address token, uint256 amount) external onlyOwner {
        require(amount > 0, "Invalid amount");
        require(
            IERC20(token).transfer(owner(), amount),
            "Token recovery failed"
        );
    }
}
