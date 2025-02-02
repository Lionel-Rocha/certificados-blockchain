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
        console.log(`Success!\nBlock number: ${result.blockNumber}\nTransaction hash: ${hash}`);
        return true;
    } catch (error) {
        if (error.message.includes("caller is not token owner or approved")){
            console.error("Current address can't grand roles. Did you populate the .env file?");
            return false;
        } else {
            console.error("Couldn't complete this transaction.");
            return false;
        }
    }

}


async function revokeRole(wallet, address){
    const contract = await connect(wallet);

    try{
        let result = await contract.revokeMinterRole(address);
        console.log(`Success!\nBlock number: ${result.blockNumber}\nTransaction hash: ${hash}`);
        return true;
    } catch (error) {
        if (error.message.includes("caller is not token owner or approved")){
            console.error("Current address can't revoke roles. Did you populate the .env file?");
            return false;
        } else {
            console.error("Couldn't complete this transaction.");
            return false;
        }
    }
}

async function awardCertificate(wallet, address, tokenuri, institution, course, enrollmentNumber){
    const contract = await connect(wallet);

    try{
        let result = await contract.awardCertificate(address, tokenuri, institution, course, enrollmentNumber);
        console.log(result);
    }catch (error) {
        if (error.message.includes("caller is not token owner or approved")){
            console.error("Current address can't award certificates. Did you populate the .env file?");
            return false;
        } else {
            console.error("Couldn't complete this transaction.");
            return false;
        }
    }
}

module.exports = {
    grantRole: grantRole,
    revokeRole: revokeRole,
    awardCertificate: awardCertificate
}