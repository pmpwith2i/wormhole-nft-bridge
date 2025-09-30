// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CustomNFT is ERC721, Ownable {

    // Constructor will be called on contract creation
    constructor() Ownable(msg.sender) ERC721("Federico NFT", "FNFT") {}

    // Allows minting of a new NFT 
    function mintCollectionNFT(address collector, uint256 tokenId) public onlyOwner() {
        _safeMint(collector, tokenId); 
    }
}