// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./SimpleDEX.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract LendingProtocol {
    SimpleDEX public dexOracle;
    IERC20 public collateralToken;
    
    mapping(address => uint256) public collateralBalances;

    constructor(address _dexAddress) {
        dexOracle = SimpleDEX(_dexAddress);
        collateralToken = dexOracle.token();
    }

    function depositCollateral(uint256 amount) public {
        collateralToken.transferFrom(msg.sender, address(this), amount);
        collateralBalances[msg.sender] += amount;
    }

    // Função de empréstimo que usa o preço manipulável
    function borrowETH(uint256 ethAmount) public {
        uint256 price = dexOracle.getPrice();
        uint256 userCollateralValue = (collateralBalances[msg.sender] * price) / 1e18;

        // Requer 150% de colateralização
        require(userCollateralValue >= (ethAmount * 150) / 100, "Insufficient collateral");
        
        // Lógica de empréstimo... (simplificada)
        payable(msg.sender).transfer(ethAmount);
    }
}