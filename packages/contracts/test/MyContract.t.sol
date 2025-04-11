// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/MyContract.sol";

contract MyContractTest is Test {
    MyContract myContract;

    function setUp() public {
        myContract = new MyContract();
    }

    function testSetValue() public {
        myContract.setValue(42);
        assertEq(myContract.value(), 42);
    }
}