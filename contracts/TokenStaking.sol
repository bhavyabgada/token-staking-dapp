// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract TokenStaking is ReentrancyGuard, Ownable {
    using SafeMath for uint256;

    // Staking token (what users will stake)
    IERC20 public stakingToken;
    // Reward token (what users will earn)
    IERC20 public rewardToken;

    // Staking periods and their respective reward multipliers (in basis points, 100 = 1%)
    struct StakingPeriod {
        uint256 duration; // Duration in seconds
        uint256 rewardMultiplier; // Reward multiplier in basis points
    }

    StakingPeriod[] public stakingPeriods;

    // Staking information for each user
    struct Stake {
        uint256 amount;
        uint256 timestamp;
        uint256 periodIndex;
        uint256 reward;
        bool active;
    }

    // Mapping of user address to their stakes
    mapping(address => Stake[]) public stakes;

    // Base APY rate in basis points (e.g., 1000 = 10%)
    uint256 public baseAPY = 1000;

    // Events
    event Staked(address indexed user, uint256 amount, uint256 periodIndex);
    event Unstaked(address indexed user, uint256 amount, uint256 reward);
    event RewardClaimed(address indexed user, uint256 reward);

    constructor(address _stakingToken, address _rewardToken) {
        stakingToken = IERC20(_stakingToken);
        rewardToken = IERC20(_rewardToken);

        // Initialize staking periods
        stakingPeriods.push(StakingPeriod(30 days, 100)); // 30 days, 1x multiplier
        stakingPeriods.push(StakingPeriod(90 days, 150)); // 90 days, 1.5x multiplier
        stakingPeriods.push(StakingPeriod(180 days, 200)); // 180 days, 2x multiplier
        stakingPeriods.push(StakingPeriod(365 days, 300)); // 365 days, 3x multiplier
    }

    function stake(uint256 _amount, uint256 _periodIndex) external nonReentrant {
        require(_amount > 0, "Cannot stake 0 tokens");
        require(_periodIndex < stakingPeriods.length, "Invalid staking period");
        
        // Transfer tokens to contract
        require(stakingToken.transferFrom(msg.sender, address(this), _amount), "Transfer failed");

        // Create new stake
        stakes[msg.sender].push(Stake({
            amount: _amount,
            timestamp: block.timestamp,
            periodIndex: _periodIndex,
            reward: 0,
            active: true
        }));

        emit Staked(msg.sender, _amount, _periodIndex);
    }

    function calculateReward(Stake memory _stake) public view returns (uint256) {
        if (!_stake.active) return 0;

        uint256 timeElapsed = block.timestamp.sub(_stake.timestamp);
        StakingPeriod memory period = stakingPeriods[_stake.periodIndex];

        if (timeElapsed < period.duration) {
            // If staking period not complete, calculate partial rewards
            return _stake.amount
                .mul(baseAPY)
                .mul(period.rewardMultiplier)
                .mul(timeElapsed)
                .div(365 days)
                .div(10000); // Adjust for basis points
        } else {
            // If staking period complete, calculate full rewards
            return _stake.amount
                .mul(baseAPY)
                .mul(period.rewardMultiplier)
                .mul(period.duration)
                .div(365 days)
                .div(10000);
        }
    }

    function unstake(uint256 _stakeIndex) external nonReentrant {
        require(_stakeIndex < stakes[msg.sender].length, "Invalid stake index");
        Stake storage userStake = stakes[msg.sender][_stakeIndex];
        require(userStake.active, "Stake already withdrawn");

        uint256 reward = calculateReward(userStake);
        uint256 amount = userStake.amount;

        // Mark stake as inactive
        userStake.active = false;
        userStake.reward = reward;

        // Transfer staked tokens back to user
        require(stakingToken.transfer(msg.sender, amount), "Transfer failed");

        // Transfer rewards if any
        if (reward > 0) {
            require(rewardToken.transfer(msg.sender, reward), "Reward transfer failed");
        }

        emit Unstaked(msg.sender, amount, reward);
    }

    function getStakes(address _user) external view returns (Stake[] memory) {
        return stakes[_user];
    }

    function setBaseAPY(uint256 _baseAPY) external onlyOwner {
        baseAPY = _baseAPY;
    }

    function addStakingPeriod(uint256 _duration, uint256 _multiplier) external onlyOwner {
        stakingPeriods.push(StakingPeriod(_duration, _multiplier));
    }

    function updateStakingPeriod(uint256 _index, uint256 _duration, uint256 _multiplier) external onlyOwner {
        require(_index < stakingPeriods.length, "Invalid period index");
        stakingPeriods[_index] = StakingPeriod(_duration, _multiplier);
    }
} 