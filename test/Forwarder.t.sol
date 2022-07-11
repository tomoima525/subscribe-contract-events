// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/SigUtils.sol";
import "../src/Forwarder.sol";

contract ForwarderTest is Test {
    SigUtils internal sigUtils;
    Forwarder internal forwarder;
    Contract internal cont;

    uint256 internal userPrivateKey;
    uint256 internal spenderPrivateKey;
    uint256 internal otherPrivateKey;

    address internal user;
    address internal spender;

    function setUp() public {
        cont = new Contract();
        forwarder = new Forwarder("name", "1.0");
        sigUtils = new SigUtils(forwarder.DOMAIN_SEPARATOR());

        userPrivateKey = 0xA11CE;
        spenderPrivateKey = 0xB0B;
        otherPrivateKey = 0xCa123;

        user = vm.addr(userPrivateKey);
        spender = vm.addr(spenderPrivateKey);
    }

    function test_canExecuteWhenInputIsCorrect() public {
        Forwarder.ForwardRequest memory req = Forwarder.ForwardRequest({
            from: user,
            to: address(cont),
            nonce: 0,
            id: 1
        });

        bytes32 digest = sigUtils.getTypedDataHash(req);
        emit log_uint(req.id);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(userPrivateKey, digest);

        forwarder.execute(req, v, r, s);
        // Contract being executed by Forwarder
        assertEq(cont.id(), req.id);
    }

    function test_canExecuteWhenSpenderIsWhiteListed() public {
        forwarder.addSenderToWhitelist(spender);
        Forwarder.ForwardRequest memory req = Forwarder.ForwardRequest({
            from: user,
            to: address(cont),
            nonce: 0,
            id: 1
        });

        bytes32 digest = sigUtils.getTypedDataHash(req);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(userPrivateKey, digest);

        vm.prank(spender);
        forwarder.execute(req, v, r, s);
        // Contract being executed by Forwarder
        assertEq(cont.id(), req.id);
    }

    function test_cannotExecuteWhenInputIsNotCorrect() public {
        Forwarder.ForwardRequest memory req = Forwarder.ForwardRequest({
            from: user,
            to: address(cont),
            nonce: 0,
            id: 21
        });

        bytes32 digest = sigUtils.getTypedDataHash(req);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(userPrivateKey, digest);

        vm.expectRevert("Not Verified");
        forwarder.execute(req, v, r, s);
    }

    function test_cannotExecuteWhenSignatureIncorrect() public {
        Forwarder.ForwardRequest memory req = Forwarder.ForwardRequest({
            from: user,
            to: address(cont),
            nonce: 0,
            id: 21
        });
        bytes32 digest = sigUtils.getTypedDataHash(req);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(otherPrivateKey, digest);

        vm.expectRevert("Forwarder: signature does not match request");
        forwarder.execute(req, v, r, s);
    }

    function test_cannotExecuteWhenNotInwhiteList() public {
        Forwarder.ForwardRequest memory req = Forwarder.ForwardRequest({
            from: user,
            to: address(cont),
            nonce: 0,
            id: 21
        });

        bytes32 digest = sigUtils.getTypedDataHash(req);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(userPrivateKey, digest);
        vm.prank(vm.addr(0xD001));
        vm.expectRevert(
            "Forwarder: sender of meta-transaction is not whitelisted"
        );
        forwarder.execute(req, v, r, s);
    }
}
