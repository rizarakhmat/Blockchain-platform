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

  function mintTokens (uint256 _amount) public returns (uint256) {
    super.mintTo(msg.sender, _amount); // mint ERC20 tokens to Producer account

    return 0;
  }
}