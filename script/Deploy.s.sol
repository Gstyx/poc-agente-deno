// script/Deploy.s.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/TokenA.sol";
import "../src/SimpleDEX.sol";
import "../src/LendingProtocol.sol";

contract Deploy is Script {
    function run() public {
        // vm.startBroadcast() diz ao Forge: "Grave as transações a seguir na blockchain"
        vm.startBroadcast();

        // 1. Implanta o contrato TokenA
        TokenA tokenA = new TokenA();
        console.log("TokenA deployed at:", address(tokenA));

        // 2. Implanta o SimpleDEX, passando o endereço do TokenA no construtor
        SimpleDEX dex = new SimpleDEX(address(tokenA));
        console.log("SimpleDEX deployed at:", address(dex));
        
        // 3. Implanta o LendingProtocol, passando o endereço da DEX no construtor
        LendingProtocol protocol = new LendingProtocol(address(dex));
        console.log("LendingProtocol deployed at:", address(protocol));

        // --- Configuração Inicial do Ecossistema ---
        vm.deal(address(protocol), 500 ether);
        console.log("LendingProtocol funded with 500 ETH.");

        // 4. Aprova a DEX para gastar 10 TokenA do deployer
        // A conta que roda o script (deployer) já tem todos os tokens iniciais.
        tokenA.approve(address(dex), 10 * 1e18);
        
        // 5. Adiciona a liquidez inicial na DEX (10 TokenA e 10 ETH)
        // Isso estabelece o preço inicial de 1:1 e cria o pool de baixa liquidez.
        dex.addLiquidity{value: 10 ether}(10 * 1e18);

        console.log("Initial liquidity added to SimpleDEX.");

        // vm.stopBroadcast() diz ao Forge: "Pare de gravar as transações"
        vm.stopBroadcast();
    }
}