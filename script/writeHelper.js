const ethers = require('ethers')
const path = require("path");
const certificateJson = require(path.join(__dirname, "Certificate_metadata.json"));
const abi = certificateJson.output.abi;
require('dotenv').config();
async function connect(wallet){
    let address = process.env.CONTRACT_ADDRESS;
    return new ethers.Contract(address, abi, wallet);
}

async function grantRole(wallet, address){
    const contract = await connect(wallet);

    try{
        let result = await contract.grantMinterRole(address);
        console.log(`Sucesso!\nBlock number: ${result.blockNumber}\nHash da transação: ${result.hash}`);
        return true;
    } catch (error) {
        if (error.message.includes("caller is not token owner or approved")){
            console.error("O endereço atual não consegue fornecer papéis.");
            return false;
        } else {
            console.error("Não foi possível completar a transação.");
            throw error;
        }
    }

}


async function revokeRole(wallet, address){
    const contract = await connect(wallet);

    try{
        let result = await contract.revokeMinterRole(address);
        console.log(`Sucesso!\nBlock number: ${result.blockNumber}\nHash da transação: ${result.hash}`);
        return true;
    } catch (error) {
        if (error.message.includes("caller is not token owner or approved")){
            console.error("O endereço atual não consegue revogar papéis.");
            return false;
        } else {
            console.error("Não foi possível completar a transação.");
            throw error;
        }
    }
}

async function awardCertificate(wallet, address, tokenuri, institution, course, enrollmentNumber){
    const contract = await connect(wallet);

    try{
        let result = await contract.awardCertificate(address, tokenuri, institution, course, enrollmentNumber);
        let receipt = await result.wait();
        console.log(`Sucesso!\nBlock number: ${result.blockNumber}\nHash da transação: ${result.hash}`);

    }catch (error) {
        if (error.message.includes("caller is not token owner or approved")){
            console.error("O endereço atual não consegue fornecer certificados.");
            return false;
        } else {
            console.error("Não foi possível completar a transação.");
            throw error;
        }
    }
}

module.exports = {
    grantRole: grantRole,
    revokeRole: revokeRole,
    awardCertificate: awardCertificate
}