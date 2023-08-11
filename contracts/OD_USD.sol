// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract OD_USD is ERC20 {
    address owner;
    constructor() ERC20("OD_USD", "OD_USD") {
        owner = msg.sender;
        _mint(owner, 1000000000000000000000000000);
    }
}
