// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract FractionalNFT is ERC721Enumerable, Ownable {
  using SafeMath for uint256;

  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  struct NFTMovie {
    address[] owners;
    uint256[] prices;
    string target;
    uint256[] share;
    string distributorName;
    uint256 distributorPrice;
    uint256 startDate;
    uint256 deadline;
    string[] countries;
  }
  
  mapping(uint256 => NFTMovie) public NFTMovies;

  constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {
    console.log("Contract has been deployed!");
  }

// createNFTMovie
  function createNFTMovie(address[] _owners, uint256[] _prices, string memory _target, uint256[] _shares, strung memory _tokenURI) public onlyOwner returns (uint256) {
    uint256 tokenId = _tokenIds.current(); 

    _safeMint(msg.sender, tokenId);
    _setTokenURI(tokenId, _tokenURI)

    NFTMovie storage nftmovie = NFTMovies[_tokenIds];

    nftmovie.owners = _owners;
    nftmovie.prices = _prices;
    nftmovie.target = _target;
    nftmovie.share = _shares;

    // LOCK nft = transfer NFT to contract
    _transfer(msg.sender, address(this), _tokenId, _tokenURI);

    // mint & transfer ERC20 to contract
    ERC20 

    for (uint256 i = 0; i < _owners.length; i++) {
      transfer
    }

    _tokenIds.increment();
    return tokenId;
  }

  /* // mint NFT directly to a list of addresses 
  function airdropNfts(address[] calldata buyers) public onlyOwner {

      for (uint256 i = 0; i < buyers.length; i++) {
          _mintSingleNFT(buyers[i]);
      }
  }

  function _mintSingleNFT(address buyer) private {
        uint256 newTokenID = _tokenIds.current();
        _safeMint(buyer, newTokenID);
        _tokenIds.increment();

        return newTokenID;
    } */
    

    
}