// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

contract Certificate is ERC721URIStorage, AccessControl {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address public owner;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    mapping(uint256 => bool) private _transferable;
    mapping(string => uint256) private _tokenURIs;

    constructor() ERC721("Cert", "CER") {
        owner = msg.sender;
        _grantRole(DEFAULT_ADMIN_ROLE, owner); // Dono do contrato consegue gerenciar os papéis
        //NOTA: o dono não é um MINTER a princípio. Mas ele consegue transferir certificados.
    }

    function awardCertificate(address student, string memory tokenURI) public onlyRole(MINTER_ROLE) returns (uint256) {
        require(student != address(0), "Invalid student address");

        uint256 newCertificateId = _tokenIds.current();
        _mint(student, newCertificateId); // Isso chamará automaticamente _beforeTokenTransfer
        _setTokenURI(newCertificateId, tokenURI);
        _transferable[newCertificateId] = false; // Marca o certificado como não transferível
        _tokenIds.increment();
        _tokenURIs[tokenURI] = newCertificateId;
        return newCertificateId;
    }

    function grantMinterRole(address account) public onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(MINTER_ROLE, account);
    }

    function revokeMinterRole(address account) public onlyRole(DEFAULT_ADMIN_ROLE) {
        revokeRole(MINTER_ROLE, account);
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal override{
        require(!_transferable[tokenId], "Certificate is not transferable");
    }

    function supportsInterface(bytes4 interfaceId) public view override(AccessControl, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function getTokenId(string memory tokenURI) public view returns (uint256) {
        return _tokenURIs[tokenURI]; // Retorna o tokenId associado ao tokenURI
    }

    function getTokenURI(uint256 tokenId) public view returns (string memory) {
        string memory uri = super.tokenURI(tokenId);
        require(bytes(uri).length > 0, "Token does not have an associated URI");
        return uri;
    }
}
