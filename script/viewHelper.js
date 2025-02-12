const ethers = require('ethers')
const path = require("path");
const certificateJson = require(path.join(__dirname, "Certificate_metadata.json"));
const abi = certificateJson.output.abi;
require('dotenv').config();
async function connect(rpcProvider){
    let address = process.env.CONTRACT_ADDRESS;
    return new ethers.Contract(address, abi, rpcProvider);
}
async function getCertificateData(certificateId, rpcProvider){
    const contract = await connect(rpcProvider);

    try{
        let result = await contract.getCertificateData(certificateId);
        if (result.length === 0){
            console.log("Não há certificados com esse ID.");
        } else {
            console.log(`Instituição: ${result[1]}\nCurso: ${result[2]}\nURI: ${result[0]}`)
        }
    }catch (error) {
        console.error("Houve um erro. ");
        console.log(error);
    }
}

async function getCertificatesOfStudent(address, rpcProvider){
    const contract = await connect(rpcProvider);

    try{
        let result = await contract.getCertificatesOfStudent(address);
        if (result.length === 0){
            console.log("Este estudante não tem certificados em sua carteira.");
        } else {
            console.log(`IDs dos certificados do estudante: ${result}`);
        }
    }catch (error) {
        console.error("Houve um erro.");
    }
}

async function getStudentAddressByDetails(institution, course, enrollmentNumber, rpcProvider){
    const contract = await connect(rpcProvider);

    try{
        let result = await contract.getStudentAddressByDetails(institution, course, enrollmentNumber);
        if (result.length === 0){
            console.log("Este estudante não foi encontrado.");
        } else {
            console.log(`Endereço do estudante: ${result}`);
        }
    } catch(error){
        console.error("Houve um erro.");
        console.log(error);
    }
}


module.exports = {
    getCertificateData: getCertificateData,
    getCertificatesOfStudent: getCertificatesOfStudent,
    getStudentAddressByDetails: getStudentAddressByDetails
}