// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import {IMailbox} from "@hyperlane-xyz/core/contracts/interfaces/IMailbox.sol";
import {IPostDispatchHook} from "@hyperlane-xyz/core/contracts/interfaces/hooks/IPostDispatchHook.sol";
import {IInterchainSecurityModule} from "@hyperlane-xyz/core/contracts/interfaces/IInterchainSecurityModule.sol";
import {Address} from "@openzeppelin/contracts/utils/Address.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract TokenLockAndMint is Ownable, ReentrancyGuard {
    IERC20 public token;
    address public mailbox = 0x6966b0E55883d49BFB24539356a2f8A673E02039;
    address public remoteContract;
    uint32 public remoteDomain;
    uint256 public lastAmount;
    uint8 public LOCK_MESSAGE_TYPE = 1;
    uint8 public WITHDRAW_MESSAGE_TYPE = 2;
    uint8 public DISTRIBUTE_MESSAGE_TYPE = 3;
    
    event TokensLocked(address indexed user, uint256 amount, uint256 timestamp);
    event TokensMinted(address indexed user, uint256 amount, uint256 timestamp);

    constructor(address _token) Ownable(msg.sender) {
        token = IERC20(_token);
        remoteDomain = 8008135;
    }

    function initialize(address _remoteContract) external onlyOwner {
        remoteContract = _remoteContract;
    }

    IPostDispatchHook public hook;
    mapping(bytes32 => bytes32) hash;
    uint32 DomainID = 8008135;

    function setHook(address _hook) public onlyOwner {
        hook = IPostDispatchHook(_hook);
    }

    event hashedCiphertext(bytes32 _hash);

    function lockTokens(uint256 amount) external payable nonReentrant {
        require(amount > 0, "Amount must be greater than 0");

        // Transfer tokens from sender to this contract
        token.transferFrom(msg.sender, address(this), amount);
        uint32 _amount = usdcToUint32(amount);
        // Send a message to the remote chain to mint the tokens
        bytes memory message = abi.encode(0x7a07cd14d1d72e081f4ca08d2e5167e67ecaba9bd7992aadf8381c928376a7a5,abi.encode(msg.sender, _amount));
        uint256 quote = IMailbox(mailbox).quoteDispatch(
            DomainID,
            addressToBytes32(remoteContract),
            abi.encode(message)
        );
        IMailbox(mailbox).dispatch{value:quote}(
            remoteDomain,
            addressToBytes32(remoteContract),
            message
        );
        emit TokensLocked(msg.sender, amount, block.timestamp);
    }

    function withdrawMessage() external {
        bytes memory message = abi.encode(0x2de40578e7ce0d6676a0042a6a492c4f834d79954ae20684b034773b9422fc82,abi.encode(msg.sender, 0));
        uint256 quote = IMailbox(mailbox).quoteDispatch(
            DomainID,
            addressToBytes32(remoteContract),
            abi.encode(message)
        );
        IMailbox(mailbox).dispatch{value: quote}(
            remoteDomain,
            addressToBytes32(remoteContract),
            message
        );
    }

    function distributeFunds(
        address userAddress1,
        address userAddress2,
        address userAddress3,
        bytes calldata cipherText
    ) external payable {
        CommitCiphertextHash(
            userAddress1,
            userAddress2,
            userAddress3,
            cipherText
        );
    }

    function handle(
        uint32 _origin,
        bytes32 _sender,
        bytes calldata _data
    ) public payable {
        require(_origin == remoteDomain, "Invalid source domain");
        require(
            _sender == bytes32(addressToBytes32(remoteContract)),
            "Invalid source contract"
        );
        (address user, uint256 amount) = abi.decode(_data, (address, uint256));
        token.transfer(user, amount);
    }


    function addressToBytes32(address _addr) internal pure returns (bytes32) {
        return bytes32(uint256(uint160(_addr)));
    }

    function bytes32ToAddress(bytes32 _buf) internal pure returns (address) {
        return address(uint160(uint256(_buf)));
    }

    function usdcToUint32(uint256 usdcAmount) public pure returns (uint32) {
        // USDC has 6 decimal places, so we divide by 10^6 to get the whole number part
        uint32 wholeNumber = uint32(usdcAmount / 10**18);
        return wholeNumber;
    }

    modifier onlyMailbox() {
        require(msg.sender == mailbox, "MailboxClient: sender not mailbox");
        _;
    }

    function CommitCiphertextHash(
        address user1,
        address user2,
        address user3,
        bytes calldata Ciphertext
    ) public returns (bytes32) {
        //necessary snippet
        bytes32 _hash = keccak256(Ciphertext);

        //necessary snippets
        uint256 quote = IMailbox(mailbox).quoteDispatch(
            DomainID,
            addressToBytes32(remoteContract),
            abi.encode(_hash, abi.encode(user1, user2, user3))
        );
        IMailbox(mailbox).dispatch{value: quote}(
            DomainID,
            addressToBytes32(remoteContract),
            abi.encode(_hash, abi.encode(user1, user2, user3))
        );

        return _hash;
    }
}
