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
    string title;
    string description;
    string movieURI;
    address producer;
    bool isLocked;
    address[] buyers;
    uint256[] donations;
    uint256[] shares;
  }

  mapping(uint256 => LockedNFTMovie) public idToNFTs;

  mapping(address => uint256[]) public tokensPerUser;

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

  ////////////////////////////////// ERC721  ///////////////////////////

  // send (lock) erc721 nft from NFTMovie to this SC 
  function lockNFTMovie(uint256 _tokenId, string memory _title, string memory _description, string memory _movieURI) external onlyProducer returns (uint256) {
    require(nftMovie.ownerOf(_tokenId) == msg.sender, "You don't own this NFT!");

    nftMovie.safeTransferFrom(msg.sender, address(this), _tokenId);

    //update mapping
    LockedNFTMovie storage idToNFT = idToNFTs[_tokenId];
    idToNFT.tokenId = _tokenId;
    idToNFT.title = _title;
    idToNFT.description = _description;
    idToNFT.movieURI = _movieURI;
    idToNFT.producer = msg.sender;
    idToNFT.isLocked = true;

    _lockedNFTIdCounter++;

    return _lockedNFTIdCounter - 1;
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
    require(_amount > 0, "Amount must be greater than zero");

    nftMovieToken.safeTransfer(_to, _amount);
  }


  // function that airdrop erc20 tokens from this SC to [] addresses
  function distributeERC20Tokens(uint256 _amount, uint256 _tokenId,  address[] memory _buyers, uint256[] memory _donations) public onlyProducer {
    //update mapping
    LockedNFTMovie storage idToNFT = idToNFTs[_tokenId];

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

      associateOwnershipWithNFT(_buyers[i], _tokenId);
    }

  }

  function associateOwnershipWithNFT(address _tokenHolder, uint256 _tokenId) public returns (uint256[] memory){
        tokensPerUser[_tokenHolder].push(_tokenId);

        return tokensPerUser[_tokenHolder];
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

  // see all shares of NFT
  function getSharesOfNFT(uint256 _id) view public returns (uint256[] memory) {
      return (idToNFTs[_id].shares);
  }

  // shareOf() see #tokens of NFT belonging to address
 function shareOf(address _owner, uint256 _id) view public returns (uint256[] memory) {
        LockedNFTMovie storage nft = idToNFTs[_id];
        address[] storage buyers = nft.buyers;
        uint256[] memory shares = nft.shares;
        uint256[] memory ownedShares = new uint256[](buyers.length);
        
        for (uint256 i = 0; i < buyers.length; i++) {
            if (buyers[i] == _owner) {
                ownedShares[i] = shares[i];
            }
        }

      return (ownedShares);
  } 

  function getTokensForUser(address _user) public view returns (uint256[] memory) {
        return tokensPerUser[_user];
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