<div align="center">

![image](https://github.com/user-attachments/assets/25f8c0e3-8d9b-4cef-8f2e-84cc5f8f8b7f)

# Emissão de certificados na blockchain

</div>

<div align="center">
  
![Static Badge](https://img.shields.io/badge/vers%C3%A3o-0.8.20-3F3988?style=flat&logo=Solidity)
![Static Badge](https://img.shields.io/badge/vers%C3%A3o-20.11.1-559F1F?style=flat&logo=nodedotjs)

</div>

Inspirada na tecnologia Blockcerts, desenvolvida pelo MIT em parceria com a empresa Learning Machine para a emissão, armazenamento e verificação de certificados educacionais
na blockchain, o código deste repositório tem as funções de emitir, gerir papéis de emissor, e visualizar certificados em uma rede blockchain baseada em Ethereum Virtual Machine (EVM).
Além da segurança e da transparência proporcionadas pela blockchain, tal solução
também oferece autonomia aos estudantes, permitindo que armazenem seus certificados digitalmente e compartilhem-nos diretamente com empregadores ou universidades.

## Objetivos
✅ Gerar autonomia para os estudantes obterem e compartilharem seus certificados

✅ Evitar fraudes em certificados acadêmicos

## Como utilizar
Antes de realizar o deploy do contrato, siga as etapas abaixo:

* Se for implantar em uma rede local (Hardhat ou outro simulador), é necessário ter o Node.js v20.11.1 instalado.
* Instale o Hardhat e configure-o corretamente. O uso de Linux ou WSL (Windows Subsystem for Linux) é altamente recomendado.
* Se for implantar em uma testnet (Goerli, Sepolia, etc.), obtenha fundos de teste em uma faucet antes do deploy para pagar as taxas de transação.

1. Certifique-se de que a rede está ativa
    * Se estiver usando uma blockchain local, execute `npx hardhat node`.
    * Se estiver usando uma testnet, certifique-se de que tem saldo na carteira.
2. Realize o deploy do contrato
3. Obtenha o endereço do contrato implantado
4. Após o deploy, anote o endereço do contrato e configure as variáveis de ambiente no arquivo **.env**
   
```
URL={endereço RPC da rede}
KEY={chave privada da carteira de deploy}
CONTRACT_ADDRESS={endereço do contrato implantado}
```

5. Instale as dependências do projeto
   * No diretório do projeto, execute `npm install`
  
Isso deve ser suficiente para deixar o projeto utilizável. Em caso de dúvidas ou erros na instalação e uso, **abrir uma issue no projeto**.

## Próximos passos

- [ ] Criar interface web interativa
- [ ] Deploy em testnet
- [ ] Contrato em Rust (para uso em redes baseadas em WASM)
