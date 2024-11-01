const {expect} = require('chai');
const {ethers} = require('hardhat');

describe("Certificate Contract", function () {
    let certificate;
    let owner;
    let minter;
    let student;
    const addressZero = "0x0000000000000000000000000000000000000000";
    beforeEach(async function () {
        [owner, minter, student] = await ethers.getSigners();

        const Certificate = await ethers.getContractFactory("Certificate");
        certificate = await Certificate.deploy();

        await certificate.grantMinterRole(minter.address);
    });

    it("should award a certificate", async function () {
        const tokenURI = "https://example.com/certificate/1";

        await certificate.connect(minter).awardCertificate(student.address, tokenURI);
        const response = await certificate.ownerOf(0);
        expect(response).to.equal(student.address);

    });

    it("should revert if awarding a certificate to the zero address", async function () {
        const tokenURI = "https://example.com/certificate/2";

        await expect(certificate.connect(minter).awardCertificate(addressZero, tokenURI))
            .to.be.revertedWith("Invalid student address");
    });

    it("should allow the owner to grant and revoke minter role", async function () {

   });

    it("should not allow transfer of the certificate by minter", async function () {
        const tokenURI = "https://example.com/certificate/3";

        await certificate.connect(minter).awardCertificate(minter.address, tokenURI);

        await expect(certificate.transferFrom(minter,owner,0)).to.be.revertedWith("ERC721: caller is not token owner or approved")
    });

    it("should not allow transfer of the certificate by the student", async function () {
        const tokenURI = "https://example.com/certificate/3";
        await certificate.connect(minter).awardCertificate(student.address, tokenURI);
        await certificate.connect(student);
        await expect(certificate.transferFrom(student,owner,0)).to.be.revertedWith("ERC721: caller is not token owner or approved")
    });
});
