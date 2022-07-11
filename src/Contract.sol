// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract Contract {
    event Verified(uint256 indexed tokenId, address indexed to);

    uint256 public id;

    function verify(uint256 _id, address to) public returns (bool, uint256) {
        require(_id == 1, "Not Verified");
        id = _id;
        emit Verified(_id, to);
        return (true, _id);
    }
}
