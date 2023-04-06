pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Players {
    
    struct Player {
        uint256 id;
        string username;
        address walletAddress;
        uint256 betCount;
        uint256 winnings;
        uint256 losses;
    }
    
    Player[] public players;

    mapping(address => bool) private walletAddressExists;
    mapping(string => bool) private usernameExists;
    mapping(uint256 => bool) private idExists;
    mapping(address => uint256) private walletAddressToPlayerId;
    
    event PlayerCreated(uint256 indexed id, string username, address walletAddress);
    
    constructor() {}

    function createPlayer(string memory _username, address _walletAddress) public {
        require(!usernameExists[_username], "Username already exists");
        require(!walletAddressExists[_walletAddress], "Wallet address already exists");
        uint256 newId = players.length;
        Player memory newPlayer = Player(newId, _username, _walletAddress, 0, 0, 0);
        players.push(newPlayer);
        usernameExists[_username] = true;
        walletAddressExists[_walletAddress] = true;
        idExists[newId] = true;
        walletAddressToPlayerId[_walletAddress] = newId;
    }
    
    function getPlayerCount() public view returns (uint256) {
        return players.length;
    }
    
    function checkUsernameExists(string memory _username) public view returns (bool) {
        return usernameExists[_username];
    }
    
    function checkWalletAddressExists(address _walletAddress) public view returns (bool) {
        return walletAddressExists[_walletAddress];
    }

    function checkIdExists(uint256 _id) public view returns (bool) {
        return idExists[_id];
    }

    function getBetCount(uint256 _id) public view returns (uint256) {
        require(idExists[_id], "Player does not exist");
        return players[_id].betCount;
    }
    
    function getWins(uint256 _id) public view returns (uint256) {
        require(idExists[_id], "Player does not exist");
        return players[_id].winnings;
    }
    
    function getLosses(uint256 _id) public view returns (uint256) {
        require(idExists[_id], "Player does not exist");
        return players[_id].losses;
    }

    function updateBetCount(address _walletAddress) internal {
        require(walletAddressExists[_walletAddress], "Player does not exist");
        uint256 playerId = walletAddressToPlayerId[_walletAddress];
        players[playerId].betCount += 1;
    }
    
    function updateWins(address _walletAddress, uint256 _winnings) internal {
        require(walletAddressExists[_walletAddress], "Player does not exist");
        uint256 playerId = walletAddressToPlayerId[_walletAddress];
        players[playerId].winnings += _winnings;
    }
    
    function updateLosses(address _walletAddress, uint256 _losses) internal {
        require(walletAddressExists[_walletAddress], "Player does not exist");
        uint256 playerId = walletAddressToPlayerId[_walletAddress];
        players[playerId].losses += _losses;
    }
    
    function getPlayerByWalletAddress(address _walletAddress) public view returns (Player memory) {
        uint256 playerId = walletAddressToPlayerId[_walletAddress];
        require(idExists[playerId], "Player does not exist");
        return players[playerId - 1];
    }

    function getPlayers() public view returns (Player[] memory) {
        return players;
    }
}