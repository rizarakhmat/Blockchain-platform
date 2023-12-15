// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@thirdweb-dev/contracts/base/ERC721Base.sol";

contract NFTMovie is ERC721Base {
    uint256 public _tokenIdCounter = 0;

    address immutable _producer;

    struct NFT {
        uint256 tokenID;
        string title;
        string description;
        string movieURI;
        address producer;
    }

    mapping(uint256 => NFT) public idToNFTs;

    constructor(
        address _defaultAdmin,
        string memory _name,
        string memory _symbol,
        address _royaltyRecipient,
        uint128 _royaltyBps
    )
        ERC721Base(
            _defaultAdmin,
            _name,
            _symbol,
            _royaltyRecipient,
            _royaltyBps
        )
    {
        _producer = msg.sender;
    }

    modifier onlyProducer() {
        require(_producer == msg.sender, "Invalid operation");
        _;
    }

    function _create(string memory _tokenURI) internal {
        uint256 newTokenId = _tokenIdCounter;
        super.mintTo(msg.sender, _tokenURI);
        _setTokenURI(newTokenId, _tokenURI);
    }

    function createNFTMovie(string memory _title, string memory _description,string memory _movieURI) public onlyProducer returns (uint256) {
        //create NFTMovie
        _create(_movieURI);

        //update mapping
        NFT storage idToNFT = idToNFTs[_tokenIdCounter];

        idToNFT.tokenID = _tokenIdCounter;
        idToNFT.title = _title;
        idToNFT.description = _description;
        idToNFT.movieURI = _movieURI;
        idToNFT.producer = _producer;

        _tokenIdCounter++;

        return _tokenIdCounter - 1;
    }

     function getNFT(uint256 _id) view public returns (NFT memory) {
        return (idToNFTs[_id]);
    }

    function getNFTs() public view returns (NFT[] memory) {
        NFT[] memory allNFTs = new NFT[](_tokenIdCounter);

        for(uint i = 0; i < _tokenIdCounter; i++) {
            NFT storage item = idToNFTs[i];

            allNFTs[i] = item;
        }

        return allNFTs;
    }
}