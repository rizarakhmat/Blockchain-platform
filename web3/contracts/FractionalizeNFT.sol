// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@thirdweb-dev/contracts/eip/interface/IERC20.sol";
import "@thirdweb-dev/contracts/external-deps/openzeppelin/token/ERC20/utils/SafeERC20.sol";
import "@thirdweb-dev/contracts/eip/interface/IERC721.sol";
import "@thirdweb-dev/contracts/external-deps/openzeppelin/token/ERC721/IERC721Receiver.sol";

contract FractionalizeNFT is IERC721Receiver {
  using SafeERC20 for IERC20;

  address immutable _producer;

  uint256 public _lockedNFTIdCounter = 0;

  // Interfaces for ERC20 and ERC721
  IERC20 public immutable nftMovieToken;
  IERC721 public immutable nftMovie;

  struct LockedNFTMovie {
    uint256 tokenId;
    address producer;
    bool isLocked;
    address[] buyers;
    uint256[] donations;
    uint256[] shares;
  }

  mapping(uint256 => LockedNFTMovie) public idToNFTs;

  uint256 totalBalance;

  constructor(IERC721 _nftMovie, IERC20 _nftMovieToken) {
    nftMovie = _nftMovie;
    nftMovieToken = _nftMovieToken;
    _producer = msg.sender;
  }

  modifier onlyProducer() {
    require(_producer == msg.sender, "Invalid operation");
    _;
  }

  /////////////////////////////////// ERC20 ////////////////////

  // send(lock) erc20 tokens from FractionToken to this SC
  function depositERC20(uint256 _amount) external payable {
    uint256 balanceBefore = IERC20(nftMovieToken).balanceOf(address(this));

    IERC20(nftMovieToken).transferFrom(
      msg.sender,
      address(this),
      _amount
    );
  
    uint256 actualAmount = IERC20(nftMovieToken).balanceOf(address(this)) - balanceBefore;

    totalBalance += actualAmount;
  }

  // internal function that send erc20 token from this SC to reciver
  function sendERC20Token (address _to, uint256 _amount) internal {
    require(_amount > 0, "_amount should be > 0");

    nftMovieToken.safeTransfer(_to, _amount);
  }


  // function that airdrop erc20 tokens from this SC to [] addresses
  function distributeERC20Tokens(uint256 _amount, address[] memory _buyers, uint256[] memory _donations) public onlyProducer {
    //update mapping
    LockedNFTMovie storage idToNFT = idToNFTs[_lockedNFTIdCounter];

    uint256 totalTokens = _amount;
    uint256 target = 0;
    for (uint256 i = 0; i < _buyers.length; i++) {
      target += _donations[i];
      idToNFT.buyers.push(_buyers[i]);
      idToNFT.donations.push(_donations[i]);
    }

    for (uint256 i = 0; i < _buyers.length; i++) {
      uint256 numberOfTokens = (_donations[i] * totalTokens) / target;
      idToNFT.shares.push(numberOfTokens);

      sendERC20Token(
        _buyers[i],
        numberOfTokens
      );
    }
  }

  ////////////////////////////////// ERC721  ///////////////////////////

  // send (lock) erc721 nft from NFTMovie to this SC 
  function lockNFTMovie(uint256 _tokenId) external onlyProducer {
    require(nftMovie.ownerOf(_tokenId) == msg.sender, "You don't own this NFT!");

    nftMovie.safeTransferFrom(
      msg.sender,
      address(this),
      _tokenId
    );

    //update mapping
    LockedNFTMovie storage idToNFT = idToNFTs[_lockedNFTIdCounter];
    idToNFT.tokenId = _tokenId;
    idToNFT.producer = msg.sender;
    idToNFT.isLocked = true;

    _lockedNFTIdCounter++;
  }

  ///////////////////////////////////// read functions //////////////////////
  
  function getLockedNFT(uint256 _id) view public returns (LockedNFTMovie memory) {
    return (idToNFTs[_id]);
  }

  function getLockedNFTs() public view returns (LockedNFTMovie[] memory) {
    LockedNFTMovie[] memory allLockedNFTs = new LockedNFTMovie[](_lockedNFTIdCounter);

    for(uint i = 0; i < _lockedNFTIdCounter; i++) {
        LockedNFTMovie storage item = idToNFTs[i];

        allLockedNFTs[i] = item;
    }

    return allLockedNFTs;
  }


  //required function for ERC721
  function onERC721Received(
    address,
    address from,
    uint256,
    bytes calldata
  ) external pure override returns (bytes4) {        
    return IERC721Receiver.onERC721Received.selector;
  }
}