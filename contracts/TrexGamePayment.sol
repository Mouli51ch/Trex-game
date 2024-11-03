// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function allowance(address owner, address spender) external view returns (uint256);
}

/**
 * @title TrexGamePayment
 * @dev Contract for handling payments and game credits for the Trex Runner game
 */
contract TrexGamePayment {
    // State variables
    address public owner;
    IERC20 public aiaToken;
    uint256 public gamePrice;
    uint256 public totalGamesPlayed;
    bool public paused;
    uint256 public maxCreditsPerPurchase;
    uint256 public minGameInterval;
    
    // Structs
    struct PlayerStats {
        uint256 credits;
        uint256 gamesPlayed;
        uint256 highScore;
        uint256 totalSpent;
        bool hasPlayedBefore;
        uint256 lastGameTime;
        uint256 totalScore;
        uint256 consecutiveGames;
    }
    
    struct LeaderboardEntry {
        address player;
        uint256 highScore;
    }
    
    // Mappings
    mapping(address => PlayerStats) public playerStats;
    mapping(address => bool) public authorizedOperators;
    mapping(uint256 => LeaderboardEntry) public leaderboard;
    uint256 public leaderboardSize;
    
    // Constants
    uint256 public constant MAX_LEADERBOARD_SIZE = 10;
    uint256 public constant BONUS_THRESHOLD = 5; // Consecutive games for bonus
    
    // Events
    event CreditsPurchased(address indexed player, uint256 amount, uint256 totalCost);
    event GameStarted(address indexed player, uint256 gameId);
    event GameEnded(address indexed player, uint256 gameId, uint256 score);
    event GamePriceUpdated(uint256 oldPrice, uint256 newPrice);
    event OperatorStatusUpdated(address operator, bool status);
    event HighScoreAchieved(address indexed player, uint256 score);
    event TokensWithdrawn(address indexed owner, uint256 amount);
    event PausedStateChanged(bool isPaused);
    event BonusCreditsAwarded(address indexed player, uint256 amount);
    event LeaderboardUpdated(address indexed player, uint256 position, uint256 score);

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier onlyOperator() {
        require(authorizedOperators[msg.sender] || msg.sender == owner, "Not authorized");
        _;
    }

    modifier whenNotPaused() {
        require(!paused, "Contract is paused");
        _;
    }

    modifier validGameInterval() {
        require(
            playerStats[msg.sender].lastGameTime + minGameInterval <= block.timestamp,
            "Please wait before starting a new game"
        );
        _;
    }

    /**
     * @dev Contract constructor
     * @param _aiaToken Address of the AIA token contract
     * @param _initialGamePrice Initial price for one game credit
     */
    constructor(
        address _aiaToken,
        uint256 _initialGamePrice
    ) {
        require(_aiaToken != address(0), "Invalid token address");
        require(_initialGamePrice > 0, "Invalid game price");
        
        owner = msg.sender;
        aiaToken = IERC20(_aiaToken);
        gamePrice = _initialGamePrice;
        authorizedOperators[msg.sender] = true;
        paused = false;
        maxCreditsPerPurchase = 10;
        minGameInterval = 30 seconds;
        leaderboardSize = 0;
    }

    /**
     * @dev Purchase game credits with volume discount
     * @param numberOfCredits Number of credits to purchase
     */
    function purchaseCredits(uint256 numberOfCredits) external whenNotPaused {
        require(numberOfCredits > 0, "Must purchase at least 1 credit");
        require(numberOfCredits <= maxCreditsPerPurchase, "Exceeds max credits per purchase");
        
        // Calculate price with volume discount
        uint256 discount = (numberOfCredits - 1) * 5 / 100; // 5% discount per additional credit
        if (discount > 30) discount = 30; // Max 30% discount
        
        uint256 totalCost = gamePrice * numberOfCredits * (100 - discount) / 100;
        require(aiaToken.balanceOf(msg.sender) >= totalCost, "Insufficient balance");
        require(aiaToken.allowance(msg.sender, address(this)) >= totalCost, "Insufficient allowance");

        bool success = aiaToken.transferFrom(msg.sender, address(this), totalCost);
        require(success, "Token transfer failed");

        PlayerStats storage stats = playerStats[msg.sender];
        stats.credits += numberOfCredits;
        stats.totalSpent += totalCost;

        emit CreditsPurchased(msg.sender, numberOfCredits, totalCost);
    }

    /**
     * @dev Start a new game with consecutive game bonus
     * @return gameId Unique identifier for the game session
     */
    function startGame() external whenNotPaused validGameInterval returns (uint256 gameId) {
        PlayerStats storage stats = playerStats[msg.sender];
        require(stats.credits > 0, "No credits available");
        
        stats.credits -= 1;
        stats.gamesPlayed += 1;
        stats.lastGameTime = block.timestamp;
        stats.consecutiveGames += 1;
        
        // Award bonus credit for consecutive games
        if (stats.consecutiveGames >= BONUS_THRESHOLD) {
            stats.credits += 1;
            stats.consecutiveGames = 0;
            emit BonusCreditsAwarded(msg.sender, 1);
        }
        
        totalGamesPlayed += 1;
        gameId = totalGamesPlayed;

        emit GameStarted(msg.sender, gameId);
        return gameId;
    }

    /**
     * @dev End a game and update leaderboard
     * @param gameId ID of the game session
     * @param score Final score achieved
     */
    function endGame(uint256 gameId, uint256 score) external whenNotPaused {
        PlayerStats storage stats = playerStats[msg.sender];
        require(stats.hasPlayedBefore || stats.gamesPlayed > 0, "No active game");

        stats.hasPlayedBefore = true;
        stats.totalScore += score;

        if (score > stats.highScore) {
            stats.highScore = score;
            emit HighScoreAchieved(msg.sender, score);
            _updateLeaderboard(msg.sender, score);
        }

        emit GameEnded(msg.sender, gameId, score);
    }

    /**
     * @dev Update leaderboard with new high score
     */
    function _updateLeaderboard(address player, uint256 score) private {
        // Find position for the new score
        uint256 position = leaderboardSize;
        for (uint256 i = 0; i < leaderboardSize; i++) {
            if (score > leaderboard[i].highScore) {
                position = i;
                break;
            }
        }

        // Shift lower scores down
        if (position < MAX_LEADERBOARD_SIZE) {
            for (uint256 i = leaderboardSize < MAX_LEADERBOARD_SIZE ? 
                leaderboardSize : MAX_LEADERBOARD_SIZE - 1; i > position; i--) {
                leaderboard[i] = leaderboard[i - 1];
            }
            
            // Insert new score
            leaderboard[position] = LeaderboardEntry(player, score);
            if (leaderboardSize < MAX_LEADERBOARD_SIZE) {
                leaderboardSize++;
            }
            
            emit LeaderboardUpdated(player, position, score);
        }
    }

    /**
     * @dev Get player statistics
     * @param player Address of the player
     */
    function getPlayerStats(address player) external view returns (PlayerStats memory) {
        return playerStats[player];
    }

    /**
     * @dev Get leaderboard
     * @return Array of LeaderboardEntry
     */
    function getLeaderboard() external view returns (LeaderboardEntry[] memory) {
        LeaderboardEntry[] memory board = new LeaderboardEntry[](leaderboardSize);
        for (uint256 i = 0; i < leaderboardSize; i++) {
            board[i] = leaderboard[i];
        }
        return board;
    }

    /**
     * @dev Update game configuration
     */
    function updateGameConfig(
        uint256 _newPrice,
        uint256 _maxCredits,
        uint256 _minInterval
    ) external onlyOwner {
        require(_newPrice > 0, "Invalid price");
        require(_maxCredits > 0, "Invalid max credits");
        
        uint256 oldPrice = gamePrice;
        gamePrice = _newPrice;
        maxCreditsPerPurchase = _maxCredits;
        minGameInterval = _minInterval;
        
        emit GamePriceUpdated(oldPrice, _newPrice);
    }

    // Previous admin functions remain unchanged...
    function setOperator(address operator, bool status) external onlyOwner {
        require(operator != address(0), "Invalid operator address");
        authorizedOperators[operator] = status;
        emit OperatorStatusUpdated(operator, status);
    }

    function setPaused(bool _paused) external onlyOwner {
        paused = _paused;
        emit PausedStateChanged(_paused);
    }

    function addFreeCredits(address player, uint256 amount) external onlyOperator {
        require(player != address(0), "Invalid player address");
        playerStats[player].credits += amount;
        emit CreditsPurchased(player, amount, 0);
    }

    function withdrawTokens(uint256 amount) external onlyOwner {
        require(amount > 0, "Invalid amount");
        uint256 balance = aiaToken.balanceOf(address(this));
        require(balance >= amount, "Insufficient contract balance");

        bool success = aiaToken.transfer(owner, amount);
        require(success, "Token transfer failed");
        
        emit TokensWithdrawn(owner, amount);
    }

    function getContractBalance() external view returns (uint256) {
        return aiaToken.balanceOf(address(this));
    }
}