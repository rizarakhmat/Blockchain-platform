// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@thirdweb-dev/contracts/base/ERC20Base.sol";

contract FractionToken is ERC20Base {

  constructor(
        address _defaultAdmin,
        string memory _name,
        string memory _symbol
    )
        ERC20Base(
            _defaultAdmin,
            _name,
            _symbol
        )
    {}

  uint256 public _mintedTokenGroupsCounter = 0;

  mapping(uint256 => uint256) public tokenToNFT;

  function mintTokens (uint256 _amount, uint256 _tokenId) public returns (uint256) {
    require(_amount > 0, "Amount must be greater than zero");

    super.mintTo(msg.sender, _amount); // mint ERC20 tokens to Producer account
    tokenToNFT[_mintedTokenGroupsCounter] = _tokenId;

    _mintedTokenGroupsCounter++;
    return 0;
  }
}