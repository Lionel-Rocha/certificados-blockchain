// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

contract Certificate is ERC721URIStorage, AccessControl {
    uint256 private _tokenIdCounter;
    
    address private owner;

    mapping(uint256 => bool) private _transferable; 
    
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    
    // Estrutura de dados para representar as informações do estudante
    struct Student {
        address wallet;
        string institution;
        string course;
        string enrollmentNumber;
    }

    struct CertificateData {
        string tokenURI;
        string institution;
        string course;
    }



    mapping(uint256 => CertificateData) private _certificateData;
    // Mapeamento que vincula o ID do certificado ao estudante
    mapping(uint256 => Student) private _studentInfo;
    // Mapeamento que vincula o endereço da carteira do estudante aos IDs de seus certificados
    mapping(address => uint256[]) public studentCertificates;

    // Mapeamento que vincula a combinação de instituição, curso e matrícula ao ID do certificado
    mapping(string => mapping(string => mapping(string => uint256))) private studentCertificateIndex;


    event CertificateAwarded(address indexed student, uint256 indexed certificateId);

    constructor() ERC721("Cert", "CER") {
        owner = msg.sender;
        _grantRole(DEFAULT_ADMIN_ROLE, owner); // Dono do contrato consegue gerenciar os papéis
        _tokenIdCounter = 1;
    }

    // Função para premiar o estudante com um certificado, agora com informações detalhadas do estudante
    function awardCertificate(
        address studentWallet,
        string memory tokenURI,
        string memory institution,
        string memory course,
        string memory enrollmentNumber
    ) public onlyRole(MINTER_ROLE) returns (uint256) {
        require(studentWallet != address(0), "Invalid student address");

        uint256 newCertificateId = _tokenIdCounter;
        _mint(studentWallet, newCertificateId);
        _setTokenURI(newCertificateId, tokenURI);

        _certificateData[newCertificateId] = CertificateData({
            tokenURI: tokenURI,
            institution: institution,
            course: course
        });

        _transferable[newCertificateId] = false; // O certificado não pode ser transferido por padrão

        studentCertificates[studentWallet].push(newCertificateId);
        studentCertificateIndex[institution][course][enrollmentNumber] = newCertificateId;

        _tokenIdCounter++;

        emit CertificateAwarded(studentWallet, newCertificateId);

        return newCertificateId;
    }

    // Função para conceder o papel de MINTER a um novo endereço
    function grantMinterRole(address account) public onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(MINTER_ROLE, account);
    }

    // Função para revogar o papel de MINTER de um endereço
    function revokeMinterRole(address account) public onlyRole(DEFAULT_ADMIN_ROLE) {
        revokeRole(MINTER_ROLE, account);
    }

    //Não permitir que certificados sejam transferidos
    function _update(address to, uint256 tokenId, address auth) internal override returns (address){
        require(hasRole(MINTER_ROLE, msg.sender), "You cannot transfer certificates.");
        require(!_transferable[tokenId], "Certificate is not transferable");
        revert("You cannot transfer certificates.");
    }


     function getCertificateData(uint256 certificateId) public view returns (CertificateData memory) {
        return _certificateData[certificateId];
    }

    function getCertificatesOfStudent(address student) public view returns (uint256[] memory) {
        return studentCertificates[student];
    }

    function supportsInterface(bytes4 interfaceId) public view override(AccessControl, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function getStudentAddressByDetails(
        string memory institution,
        string memory course,
        string memory enrollmentNumber
    ) public view returns (address) {
        uint256 certificateId = studentCertificateIndex[institution][course][enrollmentNumber];

        require(certificateId != 0, "Certificate not found with the provided information");

        return ownerOf(certificateId);
    }


    
}
