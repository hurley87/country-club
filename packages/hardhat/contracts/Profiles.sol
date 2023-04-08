pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Profiles {
    
    struct Profile {
        uint256 id;
        string username;
        address walletAddress;
        uint256 betCount;
        uint256 winnings;
        uint256 losses;
    }
    
    Profile[] public profiles;

    mapping(address => bool) private walletAddressExists;
    mapping(string => bool) private usernameExists;
    mapping(uint256 => bool) private idExists;
    mapping(address => uint256) private walletAddressToProfileId;
    
    event ProfileCreated(uint256 indexed id, string username, address walletAddress);
    
    constructor() {}

    function createProfile(string memory _username, address _walletAddress) public {
        require(!usernameExists[_username], "Username already exists");
        require(!walletAddressExists[_walletAddress], "Wallet address already exists");

        uint256 profileCounter = profiles.length;

        Profile memory project = Profile({
            id: profileCounter,
            username: _username,
            walletAddress: _walletAddress,
            betCount: 0,
            winnings: 0,
            losses: 0
        });
        profiles.push(project);

        usernameExists[_username] = true;
        walletAddressExists[_walletAddress] = true;
        idExists[profileCounter] = true;
        walletAddressToProfileId[_walletAddress] = profileCounter;
        
        emit ProfileCreated(profileCounter, _username, _walletAddress);
    }
    
    function getProfileCount() public view returns (uint256) {
        return profiles.length;
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
        require(idExists[_id], "Profile does not exist");
        return profiles[_id].betCount;
    }
    
    function getWins(uint256 _id) public view returns (uint256) {
        require(idExists[_id], "Profile does not exist");
        return profiles[_id].winnings;
    }
    
    function getLosses(uint256 _id) public view returns (uint256) {
        require(idExists[_id], "Profile does not exist");
        return profiles[_id].losses;
    }

    function updateBetCount(address _walletAddress) internal {
        require(walletAddressExists[_walletAddress], "Profile does not exist");
        uint256 profileId = walletAddressToProfileId[_walletAddress];
        profiles[profileId].betCount += 1;
    }
    
    function updateWins(address _walletAddress, uint256 _winnings) internal {
        require(walletAddressExists[_walletAddress], "Profile does not exist");
        uint256 profileId = walletAddressToProfileId[_walletAddress];
        profiles[profileId].winnings += _winnings;
    }
    
    function updateLosses(address _walletAddress, uint256 _losses) internal {
        require(walletAddressExists[_walletAddress], "Profile does not exist");
        uint256 profileId = walletAddressToProfileId[_walletAddress];
        profiles[profileId].losses += _losses;
    }
    
    function getProfileByWalletAddress(address _walletAddress) public view returns (Profile memory) {
        uint256 profileId = walletAddressToProfileId[_walletAddress];
        require(idExists[profileId], "Profile does not exist");
        return profiles[profileId];
    }

    function getProfiles() public view returns (Profile[] memory) {
        return profiles;
    }
}