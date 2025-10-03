
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract SimpleDEX {
    IERC20 public immutable token;
    string public constant name = "SimpleDEX";

    uint256 public reserveToken;
    uint256 public reserveETH;

    constructor(address _tokenAddress) {
        token = IERC20(_tokenAddress);
    }

    function addLiquidity(uint256 _tokenAmount) public payable {
        token.transferFrom(msg.sender, address(this), _tokenAmount);
        reserveToken += _tokenAmount;
        reserveETH += msg.value;
    }

    function getPrice() public view returns (uint256) {
        if (reserveToken == 0 || reserveETH == 0) return 0;
        return (reserveETH * 1e18) / reserveToken; // Preço de 1 TokenA em ETH
    }

    function swapETHForToken(uint256 minTokensOut) public payable {
        uint256 tokensOut = (msg.value * reserveToken) / (reserveETH + msg.value);
        require(tokensOut >= minTokensOut, "Slippage too high");
        
        reserveETH += msg.value;
        reserveToken -= tokensOut;
        
        token.transfer(msg.sender, tokensOut);
    }
}