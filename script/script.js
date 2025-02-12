const inquirer = require('inquirer');
const { ethers } = require("ethers");
const path = require("path");
const {grantRole, revokeRole, awardCertificate} = require(path.join(__dirname, "writeHelper.js"));
const {getCertificateData, getCertificatesOfStudent, getStudentAddressByDetails} = require(path.join(__dirname, "viewHelper.js"));
async function main() {
    const url = process.env.URL;
    const provider = new ethers.JsonRpcProvider(url);
    let wallet;
    if (process.env.KEY){
        wallet = new ethers.Wallet(process.env.KEY, provider);
    }

    console.log("=== SCRIPT PARA INTERAÇÃO COM CONTRATO CERTIFICATE ===");
    console.log("Lembre-se de preencher o .env com URL, KEY (opcional) e CONTRACT_ADDRESS antes do uso.");
    // Função para exibir o menu
    async function showMenu() {
        console.log("\n");
        const { option } = await inquirer.prompt({
            type: 'list',
            name: 'option',
            message: 'Escolha uma ação:',
            choices: [
                'Conceder cargo de emissor(grantRole)',
                'Revogar cargo de emissor (revokeRole)',
                'Emitir certificado (awardCertificate)',
                'Ver dados do certificado (getCertificateData)',
                'Ver certificados do estudante (getCertificatesOfStudent)',
                'Buscar endereço do estudante (getStudentAddressByDetails)',
                'Sair'
            ]
        });

        switch (option) {
            case 'Conceder cargo de emissor(grantRole)':
                await grantsRole();
                break;
            case 'Revogar cargo de emissor (revokeRole)':
                await revokesRole();
                break;
            case 'Emitir certificado (awardCertificate)':
                await awardsCertificate();
                break;
            case 'Ver dados do certificado (getCertificateData)':
                await getsCertificateData();
                break;
            case 'Ver certificados do estudante (getCertificatesOfStudent)':
                await getsCertificatesOfStudent();
                break;
            case 'Buscar endereço do estudante (getStudentAddressByDetails)':
                await getsStudentAddressByDetails();
                break;
            case 'Sair':
                console.log("Saindo...");
                return;
            default:
                console.log("Opção inválida. Tente novamente.");
                showMenu();
        }
    }

    // Função para conceder cargo
    async function grantsRole() {
        const { address } = await inquirer.prompt({
            type: 'input',
            name: 'address',
            message: 'Digite o endereço:'
        });

        try {
            await grantRole(wallet, address);
            console.log(`Cargo concedido com sucesso a ${address}`);
        } catch (error) {
            handleError(error);
        }
        showMenu();
    }

    // Função para revogar cargo
    async function revokesRole() {
        const { address } = await inquirer.prompt({
            type: 'input',
            name: 'address',
            message: 'Digite o endereço:'
        });

        try {
            await revokeRole(wallet, address);
            console.log(`Cargo revogado com sucesso de ${address}`);
        } catch (error) {
            handleError(error);
        }
        showMenu();
    }

    // Função para emitir certificado
    async function awardsCertificate() {
        const { address, tokenuri, institution, course, enrollmentNumber } = await inquirer.prompt([
            {
                type: 'input',
                name: 'address',
                message: 'Digite o endereço do estudante:'
            },
            {
                type: 'input',
                name: 'tokenuri',
                message: 'Digite o token URI:'
            },
            {
                type: 'input',
                name: 'institution',
                message: 'Digite a instituição:'
            },
            {
                type: 'input',
                name: 'course',
                message: 'Digite o nome do curso:'
            },
            {
                type: 'input',
                name: 'enrollmentNumber',
                message: 'Digite o número de matrícula:'
            }
        ]);

        try {
            await awardCertificate(wallet, address, tokenuri, institution, course, enrollmentNumber);
            console.log(`Certificado emitido com sucesso para ${address}`);
        } catch (error) {
            handleError(error);
        }
        showMenu();
    }

    // Função para ver dados do certificado
    async function getsCertificateData() {
        const { certificateId } = await inquirer.prompt({
            type: 'input',
            name: 'certificateId',
            message: 'Digite o ID do certificado:'
        });

        await getCertificateData(certificateId, provider);
        showMenu();
    }

    // Função para ver certificados do estudante
    async function getsCertificatesOfStudent() {
        const { address } = await inquirer.prompt({
            type: 'input',
            name: 'address',
            message: 'Digite o endereço do estudante:'
        });

        await getCertificatesOfStudent(address, provider);
        showMenu();
    }

    // Função para buscar o endereço do estudante
    async function getsStudentAddressByDetails() {
        const { institution, course, enrollmentNumber } = await inquirer.prompt([
            {
                type: 'input',
                name: 'institution',
                message: 'Digite a instituição:'
            },
            {
                type: 'input',
                name: 'course',
                message: 'Digite o nome do curso:'
            },
            {
                type: 'input',
                name: 'enrollmentNumber',
                message: 'Digite o número de matrícula:'
            }
        ]);

        await getStudentAddressByDetails(institution, course, enrollmentNumber, provider);
        showMenu();
    }

    // Função para tratar erros
    function handleError(error) {
        if (error.shortMessage === "invalid value for Contract target") {
            console.log("Endereço de contrato inválido.");
        } else {
            console.log("Ocorreu um erro durante a transação.");
        }
    }

    // Iniciar o menu
    showMenu();
}

main();
