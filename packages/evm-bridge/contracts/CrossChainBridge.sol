// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./CustomNFT.sol";
import "./MessageSender.sol";

contract CrossChainBridge is Ownable {
    CustomNFT public nft;
    MessageSender public messageSender;

    address public targetAddress; // Address on the target chain to receive messages
    uint16 public targetChain; // Target chain ID

    // Constructor will be called on contract creation
    constructor(
        address nftContractAddress,
        address messageSenderAddress,
        address target,
        uint16 chain
    ) Ownable(msg.sender) {
        nft = CustomNFT(nftContractAddress);
        messageSender = MessageSender(messageSenderAddress);
        targetAddress = target;
        targetChain = chain;
    }

    // Allows locking of an NFT in the bridge
    function lockNFT(uint256 tokenId) public {
        // Transfer the NFT from the sender to the bridge contract
        require(
            nft.ownerOf(tokenId) == msg.sender,
            "You must own the NFT to lock it"
        );
        require(
            nft.getApproved(tokenId) == address(this) ||
                nft.isApprovedForAll(msg.sender, address(this)),
            "Bridge contract must be approved to transfer this NFT"
        );

        messageSender.sendMessage(
            targetChain,
            targetAddress,
            "NFT Locked in Bridge"
        );
        nft.transferFrom(msg.sender, address(this), tokenId);
    }
}
