pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";
import "./Profiles.sol";

contract CountryClub is Ownable, Profiles {
    
    enum BetState {Created, Accepted, Finished, Cancelled}

    struct Team {
        uint teamId;
        string name;
    }

    struct Game {
        uint gameId;
        uint homeTeamId;
        uint awayTeamId;
        uint startTime;
    }
    
    struct Bet {
        uint betId;
        uint amount;
        uint odds;
        uint teamId;
        uint gameId;
        address creator;
        address acceptor;
        address winner;
        BetState state;
    }
    
    Bet[] public bets;
    Team[] public teams;
    Game[] public games;

    mapping (address => uint[]) public walletBets;
    mapping (uint => uint[]) public gameBets;


    uint public betsCreated = 0;
    uint public betsAccepted = 0;
    uint public betsFinished = 0;
    uint public betsCancelled = 0;
    uint public totalBetMoney = 0;
    uint public totalRev = 0;
    
    event BetCreated(uint indexed id, uint amount, uint _odds, uint teamId, address creator);
    event BetAccepted(uint indexed id, address acceptor, address creator);
    event BetFinished(uint indexed id, uint teamId);
    event BetCancelled(uint indexed id);

    function createTeam(string memory _name) public onlyOwner {
        uint teamCounter = teams.length;
        Team memory team = Team({
            teamId: teamCounter,
            name: _name
        });
        teams.push(team);
    }

    function createGame(uint _homeTeamId, uint _awayTeamId, uint _startTime) public onlyOwner {
        uint gameCounter = games.length;
        Game memory game = Game({
            gameId: gameCounter,
            homeTeamId: _homeTeamId,
            awayTeamId: _awayTeamId,
            startTime: _startTime
        });
        games.push(game);
    }
    
    function createBet(uint _gameId, uint _odds, uint _teamId) public payable {
        require(msg.value > 0, "Bet amount must be greater than 0");
        require(_odds > 0, "Odds must be greater than 0");
        require(games.length >= _gameId, 'Game does not exist');
        require(teams.length >= _teamId, 'Team does not exist');
        require(games[_gameId].startTime > block.timestamp, 'Game has already started');

        uint betCounter = bets.length;

        Bet memory bet = Bet({
            betId: betCounter,
            amount: msg.value,
            odds: _odds,
            teamId: _teamId,
            gameId: _gameId,
            creator: msg.sender,
            acceptor: address(0),
            winner: address(0),
            state: BetState.Created
        });
        bets.push(bet);

        totalBetMoney += msg.value;

        walletBets[msg.sender].push(betCounter);
        gameBets[_gameId].push(betCounter);

        betsCreated++;
        
        emit BetCreated(betCounter, msg.value, _odds, _teamId, msg.sender);
    }
    
    function acceptBet(uint _id) public payable {
        Bet storage bet = bets[_id];
        require(msg.value == bet.amount*100/(bet.odds)*10**16, "Does not match the expected amount");
        require(msg.sender != bet.creator, "Cannot accept your own bet");
        require(bet.state == BetState.Created, "Bet is no longer available");
        bet.acceptor = msg.sender;
        bet.state = BetState.Accepted;

        totalBetMoney += msg.value;

        betsAccepted++;

        emit BetAccepted(_id, bet.creator, bet.acceptor);
    }
    
    function finishBet(uint _id, uint _winningTeamId) public onlyOwner {
        Bet storage bet = bets[_id];
        require(bet.state == BetState.Accepted, "You can only finish an accepted bet");
        bet.state = BetState.Finished;
        uint totalAmount = bet.amount + bet.amount*100/(bet.odds)*10**16;
        uint rev = totalAmount * 5 / 100;
        payable(owner()).transfer(rev);
        totalRev += rev;
        uint winnerAmount = totalAmount - rev;
        if(_winningTeamId == bet.teamId) {
            payable(bet.creator).transfer(winnerAmount);
            updateWins(bet.creator, winnerAmount);
            updateLosses(bet.acceptor, winnerAmount);
            bet.winner = bet.creator;
        } else {
            payable(bet.acceptor).transfer(winnerAmount);
            updateWins(bet.acceptor, winnerAmount);
            updateLosses(bet.creator, winnerAmount);
            bet.winner = bet.acceptor;
        }

        updateBetCount(bet.creator);
        updateBetCount(bet.acceptor);

        betsFinished++;

        emit BetFinished(_id, _winningTeamId);
    }
    
    function cancelBet(uint _id) public {
        Bet storage bet = bets[_id];
        require(msg.sender == bet.creator, "Only the bet creator can cancel the bet");
        require(bet.state == BetState.Created, "Bet not available");
        bet.state = BetState.Cancelled;
        payable(bet.creator).transfer(bet.amount);

        betsCancelled++;
        
        emit BetCancelled(_id);
    }

    function withdraw() public onlyOwner {
        uint balance = address(this).balance;
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

    function getWalletBets(address _wallet) public view returns (uint[] memory) {
        return walletBets[_wallet];
    }

    function getWalletBetsForGame(address _wallet, uint _gameId) public view returns (uint[] memory) {
        uint[] memory walletBetsForGame = new uint[](walletBets[_wallet].length);
        uint counter = 0;
        for(uint i = 0; i < walletBets[_wallet].length; i++) {
            if(bets[walletBets[_wallet][i]].gameId == _gameId) {
                walletBetsForGame[counter] = walletBets[_wallet][i];
                counter++;
            }
        }
        return walletBetsForGame;
    }

    function getGameBets(uint _gameId) public view returns (uint[] memory) {
        return gameBets[_gameId];
    }
}


