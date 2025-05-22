### [H-1] Storing the password onchain makes it visable to anyone, and no longer private.

**Description:** 

All data stored onchain is visiable to anyone and can be read directly from the blockchain. The `PasswordStore::s_password` variable is intended to be a private vaiable access through the `PasswordStore::getPassword` function, which is intended to be only called by the owner of the contract.

We show one such method of reading any data off chain below.

**Impact:** 

Anyone can read the privarte password, severly breaking the functionality of the protocol.

**Proof of Concept:** (Proof of Code)
The below test case shows how anyone can read the password from the blockchain.

Get information about slots and call the storage slot itself:

Read storage all slot in a deployed contract:

```bash 
cast storage 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

Results:
╭------------+---------+------+--------+-------+-------------------------------------------------------------------------------+--------------------------------------------------------------------+-------------------------------------╮
| Name       | Type    | Slot | Offset | Bytes | Value                                                                         | Hex Value                                                          | Contract                            |
+=========================================================================================================================================================================================================================================+
| s_owner    | address | 0    | 0      | 20    | 1390849295786071768276380950238675083608645509734                             | 0x000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266 | src/PasswordStore.sol:PasswordStore |
|------------+---------+------+--------+-------+-------------------------------------------------------------------------------+--------------------------------------------------------------------+-------------------------------------|
| s_password | string  | 1    | 0      | 32    | 49516443757395204518384437876896412918898210405993719258753982441762571943956 | 0x6d7950617373776f726400000000000000000000000000000000000000000014 | src/PasswordStore.sol:PasswordStore |
╰------------+---------+------+--------+-------+-------------------------------------------------------------------------------+--------------------------------------------------------------------+-------------------------------------╯

Check storage slot number 1:
```bash 
cast storage 0x5FbDB2315678afecb367f032d93F642f64180aa3 1 --rpc-url http://127.0.0.1:8545 
```

Results:
- 0x6d7950617373776f726400000000000000000000000000000000000000000014

Decode storage slot value, in this case:

```bash 
cast parse-bytes32-string 0x6d7950617373776f726400000000000000000000000000000000000000000014
```

Results:
- mYPassword

**Recommended Mitigation:** 

---

### [H-2] `PasswordStore::setPassword` has no access conntrols, meaning a non-owner could change the password.

**Description:** 
The `PasswordStore::setPassword` function is set to be an `external` function, however, the natspec of the funtion and overall purpose of the smart contract is the `This funtions allows only the owner to set a new password.`

```javascript
    function setPassword(string memory newPassword) external {
        s_password = newPassword;
        emit SetNewPassword();
    }
```


**Impact:** Anyone can set/change the password of the contract, severaly breaking the contract intended functionality.

**Proof of Concept:** Add the following to the `PasswordStore.t.sol` test file.

```javascript
    function test_non_owner_can_set_password(address randomAddress) public{
        vm.assume(owner!=randomAddress);
        vm.prank(randomAddress);
        string memory expectedPassword = "myPassword";
        passwordStore.setPassword(expectedPassword);

        vm.prank(owner);
        string memory actualPassword = passwordStore.getPassword();
        assertEq(actualPassword, expectedPassword);

    }```
**Recommended Mitigation:** Add an access control conditional to the `setPasssword` function.

```javascript
if(msg.sender ~= s_owner ) {
   revert PasswordStor_NotOwner();
}
```

---

### [L-2] The `PaswordStore::getPassword` natspec indicates a parameter that doesn't exist, causing the natspec to be incorrect.

**Description:** 
```javascript
    /*
     * @notice This allows only the owner to retrieve the password.
     * @audit wrong params mentioned below!
@>     * @param newPassword The new password to set.
     */
    function getPassword() external view returns (string memory) {
```
The `PasswordStore::getPassword` functions signature is `getPassword()` whilte the natspec says it should be `getPassword(string)`.


**Impact:** The natspec is incorrect.

**Recommended Mitigation:** Remove the incorrect natspec line.

```diff
-  * @param newPassword The new password to set.
```


