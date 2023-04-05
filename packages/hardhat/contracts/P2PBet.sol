pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract P2PBet is Ownable {
    
    enum BetState {Created, Accepted, Finished, Cancelled}
    
    struct Team {
        uint256 teamId;
        string name;
    }

    struct Game {
        uint gameId;
        uint homeTeamId;
        uint awayTeamId;
    }
    
    struct Bet {
        uint betId;
        uint256 amount;
        uint256 odds;
        uint teamId;
        uint gameId;
        address creator;
        address acceptor;
        BetState state;
    }
    
    Bet[] public bets;
    Team[] public teams;
    Game[] public games;

    uint256 public betCount = 0;
    uint public totalBetMoney = 0;
    
    event BetCreated(uint256 indexed id, uint256 amount, uint256 _odds, uint teamId, address creator);
    event BetAccepted(uint256 indexed id, address acceptor);
    event BetFinished(uint256 indexed id, uint teamId);
    event BetCancelled(uint256 indexed id);
    
    constructor() {}

    function createTeam(string memory _name) public onlyOwner {
        uint teamCounter = teams.length;
        teams.push(Team(teamCounter, _name));
    }

    function createGame(uint _homeTeamId, uint _awayTeamId) public onlyOwner {
        uint gameCounter = games.length;
        games.push(Game(gameCounter, _homeTeamId, _awayTeamId));
    }
    
    function createBet(uint _gameId, uint _teamId, uint _odds) public payable {
        require(msg.value > 0, "Bet amount must be greater than 0");
        require(_odds > 0, "Odds must be greater than 0");
        require(games.length >= _gameId, 'Game does not exist');
        require(teams.length >= _teamId, 'Team does not exist');

        uint betCounter = bets.length;

        Bet memory bet = Bet({
            betId: betCounter,
            amount: msg.value,
            odds: _odds,
            teamId: _teamId,
            gameId: _gameId,
            creator: msg.sender,
            acceptor: address(0),
            state: BetState.Created
        });
        bets.push(bet);

        totalBetMoney += msg.value;
        
        emit BetCreated(betCount, msg.value, _odds, _teamId, msg.sender);
    }
    
    function acceptBet(uint _id) public payable {
        Bet storage bet = bets[_id];
        require(msg.value == bet.amount / bet.odds, "Does not match the expected amount");
        require(msg.sender != bet.creator, "Cannot accept your own bet");
        require(bet.state == BetState.Created, "Bet is no longer available");
        bet.acceptor = msg.sender;
        bet.state = BetState.Accepted;
        emit BetAccepted(_id, msg.sender);
    }
    
    function finishBet(uint _id, uint _winningTeamId) public onlyOwner {
        Bet storage bet = bets[_id];
        require(bet.state == BetState.Accepted, "You can only finish an accepted bet");
        bet.state = BetState.Finished;
        uint256 totalAmount = bet.amount + bet.amount / bet.odds;
        uint256 ownerFee = totalAmount * 5 / 100;
        uint256 winnerAmount = totalAmount - ownerFee;
        if(_winningTeamId == bet.teamId) {
            payable(bet.acceptor).transfer(winnerAmount);
        } else {
            payable(bet.creator).transfer(winnerAmount);
        }

        emit BetFinished(_id, _winningTeamId);
    }
    
    function cancelBet(uint _id) public {
        Bet storage bet = bets[_id];
        require(msg.sender == bet.creator, "Only the bet creator can cancel the bet");
        require(bet.state == BetState.Created, "Bet not available");
        bet.state = BetState.Cancelled;
        payable(bet.creator).transfer(bet.amount);
        emit BetCancelled(_id);
    }

    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "Contract balance is zero.");
        payable(owner()).transfer(balance);
    }

    function getBet(uint _id) public view returns (Bet memory) {
        return bets[_id];
    }

    function getTeam(uint _id) public view returns (Team memory) {
        return teams[_id];
    }

    function getGame(uint _id) public view returns (Game memory) {
        return games[_id];
    }

    function getTeams() public view returns (Team[] memory) {
        return teams;
    }

    function getGames() public view returns (Game[] memory) {
        return games;
    }

    function getBets() public view returns (Bet[] memory) {
        return bets;
    }
}


