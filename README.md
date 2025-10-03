# PoC: Agente Autônomo com IA para Exploração de Vulnerabilidade DeFi

Este repositório contém o código de um agente autônomo off-chain, desenvolvido com Deno e TypeScript, que serve como o "cérebro" para uma Prova de Conceito (PoC) de ataque a um protocolo DeFi.

O agente monitora um ambiente blockchain, utiliza um modelo de linguagem de IA (rodando localmente com Ollama) para formular uma estratégia de ataque e, em seguida, executa essa estratégia de forma autônoma.

## 🚀 Stack Tecnológica

* **Runtime:** Deno
* **Linguagem:** TypeScript
* **Interação com Blockchain:** ethers.js
* **Inteligência Artificial:** Ollama (com um modelo como Gemma ou Llama)

## 🎯 Lógica do Agente

1.  **Monitoramento:** O agente se conecta a um nó blockchain (Anvil) e periodicamente lê o preço de um ativo em uma `SimpleDEX`.
2.  **Decisão com IA:** Ele envia os dados de mercado (preço, liquidez) para um modelo de linguagem local através de um prompt detalhado, pedindo a estratégia mais lucrativa.
3.  **Execução:** Ao receber da IA a estratégia correta para o ataque de manipulação de oráculo, o agente a executa enviando uma sequência de transações para a blockchain:
    * **PASSO 1:** Realiza um grande `swap` na DEX para inflacionar o preço do colateral.
    * **PASSO 2:** Deposita o colateral supervalorizado no `LendingProtocol`.
    * **PASSO 3:** Pega um empréstimo injusto, explorando a vulnerabilidade.

## ⚙️ Como Executar a Demonstração

### Pré-requisitos
* [Deno](https://deno.land/) instalado.
* [Ollama](https://ollama.com/) instalado e com um modelo baixado (ex: `ollama run gemma3:latest`).
* O ambiente on-chain (contratos) deve estar implantado.

### Execução
Para rodar a simulação completa, você precisará de múltiplos terminais.

1.  **Inicie a Blockchain e Implante os Contratos:**
    Siga as instruções do [repositório on-chain](https://github.com/Gstyx/poc-contratos-forge) para iniciar o `anvil` e rodar o `forge script`. Anote os endereços dos contratos implantados.

2.  **Inicie a IA:**
    Em um novo terminal, inicie o servidor Ollama.
    ```bash
    ollama run gemma3:latest
    ```

3.  **Configure e Rode o Agente:**
    * Abra o arquivo `agent.ts` e atualize as constantes de endereço (`DEX_CONTRACT_ADDRESS`, etc.) com os valores obtidos na etapa 1.
    * Em um novo terminal, execute o agente:
    ```bash
    deno run --allow-net agent.ts
    ```
O terminal do agente mostrará o ciclo completo de monitoramento, decisão e execução do ataque.

## 🔗 Repositórios do Projeto

* **Agente Autônomo (Off-Chain):** `https://github.com/Gstyx/poc-agente-deno`
* **Contratos Inteligentes (On-Chain):** `https://github.com/Gstyx/poc-contratos-forge`
