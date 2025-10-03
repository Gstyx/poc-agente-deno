// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;
 
import "forge-std/Test.sol";
import "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";

contract TokenA is ERC20 {
    constructor() ERC20("TokenA", "TKA") {
        _mint(msg.sender, 1_000_000 * 10 ** decimals());
    }
}
