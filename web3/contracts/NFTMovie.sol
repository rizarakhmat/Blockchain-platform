// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@thirdweb-dev/contracts/base/ERC721Base.sol";

contract NFTMovie is ERC721Base {
    uint256 public _tokenIdCounter = 0;

    address immutable _producer;

    struct NFT {
        uint256 tokenID;
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
        _tokenIdCounter++;
        uint256 newTokenId = _tokenIdCounter;
        super.mintTo(msg.sender, _tokenURI);
        _setTokenURI(newTokenId, _tokenURI);
    }

    function createNFTMovie(string memory _movieURI) public onlyProducer {
        //create NFTMovie
        _create(_movieURI);

        //update mapping
        NFT storage idToNFT = idToNFTs[_tokenIdCounter];

        idToNFT.tokenID = _tokenIdCounter;
        idToNFT.movieURI = _movieURI;
        idToNFT.producer = _producer;
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

    

    /* function mintTo(address _to, string memory _tokenURI) public virtual override {
        // Grab the next token ID being minted.
        uint256 tokenId = nextTokenIdToMint();

        // Here, "super" refers to the base contract.
        // We are essentially saying "run the mintTo method from the base contract".
        super.mintTo(_to, _tokenURI);
    } */
}