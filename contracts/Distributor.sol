// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import {IMailbox} from "@hyperlane-xyz/core/contracts/interfaces/IMailbox.sol";
import "@fhenixprotocol/contracts/FHE.sol";
import {IPostDispatchHook} from "@hyperlane-xyz/core/contracts/interfaces/hooks/IPostDispatchHook.sol";
import {IInterchainSecurityModule} from "@hyperlane-xyz/core/contracts/interfaces/IInterchainSecurityModule.sol";
import {Address} from "@openzeppelin/contracts/utils/Address.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract PayRoll is
    Ownable,
    ReentrancyGuard
{
    IERC20 public token;
    address public mailbox = 0x139f2134e7DD6b2f7A5a9da55B534cF3Cd9Ab858;
    address public remoteContract;
    uint32 public remoteDomain;
    uint256 public lastAmount;
    uint256 private constant TOKEN_DECIMALS = 18;
    bytes constant value1 = hex"01";
    bytes constant value2 = hex"02";

    IInterchainSecurityModule public interchainSecurityModule =
        IInterchainSecurityModule(0xb415338D519eB84C1316811D30e108E47a915CBa);

    event handled(bytes32 hash);
    address public ISM = 0xb415338D519eB84C1316811D30e108E47a915CBa;

    mapping(address => euint32) private ownerToBalance;

    constructor() Ownable(msg.sender) {
        remoteDomain = 84532;
    }

    function initialize(address _remoteContract) external onlyOwner {
        remoteContract = _remoteContract;
    }

    function dispatchTokens(uint256 amount, address owner) internal {
        require(amount > 0, "Amount must be greater than 0");
        // Send a message to the remote chain to mint the tokens
        bytes memory message = abi.encode(owner, amount);
        IMailbox(mailbox).dispatch(
            remoteDomain,
            addressToBytes32(remoteContract),
            message
        );
    }


    function handle(
        uint32 _origin,
        bytes32 _sender,
        bytes memory _body
    ) external onlyMailbox {
        require(_origin == remoteDomain, "Invalid source domain");
        require(
            _sender == bytes32(addressToBytes32(remoteContract)),
            "Invalid source contract"
        );
        bytes32 committedHash = abi.decode(_body, (bytes32));
        emit handled(committedHash);
    }

    function handleWithCiphertext(
        uint32 _origin,
        bytes32 _sender,
        bytes memory _message
    ) external onlyISM {
        (bytes memory message, bytes memory ciphertext) = abi.decode(
            _message,
            (bytes, bytes)
        );
        (bytes32 committedHash, bytes memory extraData) = abi.decode(
            message,
            (bytes32, bytes)
        );

        if (committedHash == 0x7a07cd14d1d72e081f4ca08d2e5167e67ecaba9bd7992aadf8381c928376a7a5) {
            (address _user, uint32 _amount) = abi.decode(
                extraData,
                (address, uint32)
            );
            euint32 lastBalance = ownerToBalance[_user];
            ownerToBalance[_user] = FHE.add(
                FHE.asEuint32(_amount),
                lastBalance
            );
        } else if (committedHash == 0x2de40578e7ce0d6676a0042a6a492c4f834d79954ae20684b034773b9422fc82) {
            withdrawFunds(bytes32ToAddress(_sender));
        } else {
            (address _user1, address _user2, address _user3) = abi.decode(
                extraData,
                (address, address, address)
            );
            distributeFunds(
                bytes32ToAddress(_sender),
                [_user1, _user2, _user3],
                ciphertext
            );
        }

        //rest of function logic
    }

    function distributeFunds(
        address owner,
        address[3] memory users,
        bytes memory encryptedValue
    ) internal {
        lastAmount++;
        euint32 cumulativeAmount = FHE.asEuint32(0);
        for (uint256 i = 0; i < users.length; i++) {
            euint32 encryptedValueFormatted = FHE.asEuint32(encryptedValue);
            cumulativeAmount = FHE.add(
                cumulativeAmount,
                encryptedValueFormatted
            );
            ownerToBalance[users[i]] = FHE.add(
                ownerToBalance[users[i]],
                encryptedValueFormatted
            );
        }

        require(
            FHE.decrypt(FHE.lte(cumulativeAmount, ownerToBalance[owner])),
            "Exceeds balance"
        );

        ownerToBalance[owner] = FHE.sub(
            ownerToBalance[owner],
            cumulativeAmount
        );
    }

    function transferFunds(
        address owner,
        address receiver,
        bytes calldata encryptedAmount
    ) public {
        euint32 amount = FHE.asEuint32(encryptedAmount);
        FHE.req(FHE.lte(amount, ownerToBalance[owner]));
        ownerToBalance[receiver] = FHE.add(ownerToBalance[receiver], amount);
        ownerToBalance[owner] = FHE.sub(ownerToBalance[owner], amount);
    }

    function withdrawFunds(address owner) internal {
        uint32 decryptedAmount = FHE.decrypt(ownerToBalance[owner]);
        ownerToBalance[owner] = FHE.asEuint32(0);
        dispatchTokens(uint256(decryptedAmount) * (10**TOKEN_DECIMALS), owner);
    }

    function addressToBytes32(address _addr) internal pure returns (bytes32) {
        return bytes32(uint256(uint160(_addr)));
    }

    function bytes32ToAddress(bytes32 _buf) internal pure returns (address) {
        return address(uint160(uint256(_buf)));
    }

    modifier onlyMailbox() {
        require(
            msg.sender == mailbox,
            "Only mailbox can call this function !!!"
        );
        _;
    }
    modifier onlyISM() {
        require(msg.sender == ISM, "Only mailbox can call this function !!!");
        _;
    }
}
