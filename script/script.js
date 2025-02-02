const ethers = require('ethers');
const path = require("path");
const writer = require(path.join(__dirname, "writeHelper.js"));
const {awardCertificate} = require("./writeHelper");
require('dotenv').config();

async function main(){
    const url = process.env.URL;
    const provider = new ethers.JsonRpcProvider(url);
    let wallet;
    if (process.env.KEY){
        wallet = new ethers.Wallet(process.env.KEY, provider);
    }

    const command = process.argv[2];

    if (command === "grantRole"){
        const address = process.argv[3];
        try{
            await writer.grantRole(wallet, address);
        } catch(error){
            if (error.shortMessage === "invalid value for Contract target"){
                console.log("Invalid contract address.");
            } else {
                console.log("An error occurred during this transaction.")
            }
        }

    } else if (command === "revokeRole"){
        const address = process.argv[3];
        try{
            await writer.revokeRole(wallet, address);
        } catch(error){
            if (error.shortMessage === "invalid value for Contract target"){
                console.log("Invalid contract address.");
            } else {
                console.log("An error occurred during this transaction.")
            }
        }
    }
    else if (command === "awardCertificate"){
        const address = process.argv[3];
        const tokenuri = process.argv[4];
        const institution = process.argv[5];
        const course = process.argv[6];
        const enrollmentNumber = process.argv[7];
        try{
            await awardCertificate(address, tokenuri, institution, course, enrollmentNumber);
        } catch (error) {
            if (error.shortMessage === "invalid value for Contract target"){
                console.log("Invalid contract address.");
            } else {
                console.log("An error occurred during this transaction.")
            }
        }


    }
    else if (command === "getCertificateData"){
        const certificateId = process.argv[3];
        //chamar a função getCertificateData
    }
    else if (command === "getCertificatesOfStudent"){
        const address = process.argv[3];
        //chamar a função getCertificatesOfStudent
    }
    else if (command === "getStudentAddressByDetails"){
        const institution = process.argv[3];
        const course = process.argv[4];
        const enrollmentNumber = process.argv[5];
        //chamar a função getStudentAddressByDetails
    }

}

main();