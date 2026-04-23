// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title Crowdfunding
 * @notice Permissionless crowdfunding with per-campaign goals, deadlines,
 *         creator withdrawals on success, and contributor refunds on failure.
 */
contract Crowdfunding is ReentrancyGuard {
    struct Campaign {
        address creator;
        uint256 goal;
        uint256 deadline;
        uint256 totalRaised;
        bool withdrawn;
    }

    uint256 public campaignCount;

    mapping(uint256 => Campaign) public campaigns;
    mapping(uint256 => mapping(address => uint256)) public contributions;

    event CampaignCreated(
        uint256 indexed campaignId,
        address indexed creator,
        uint256 goal,
        uint256 deadline
    );

    event Funded(
        uint256 indexed campaignId,
        address indexed contributor,
        uint256 amount,
        uint256 totalRaised
    );

    event Withdrawn(
        uint256 indexed campaignId,
        address indexed creator,
        uint256 amount
    );

    event Refunded(
        uint256 indexed campaignId,
        address indexed contributor,
        uint256 amount
    );

    error InvalidGoal();
    error InvalidDuration();
    error CampaignNotFound();
    error CampaignEnded();
    error CampaignNotEnded();
    error ZeroContribution();
    error NotCreator();
    error GoalNotReached();
    error GoalReached();
    error AlreadyWithdrawn();
    error NothingToRefund();
    error TransferFailed();

    modifier campaignExists(uint256 _campaignId) {
        if (_campaignId >= campaignCount) revert CampaignNotFound();
        _;
    }

    /**
     * @notice Create a new campaign.
     * @param _goal Funding goal in wei (> 0).
     * @param _duration Duration in seconds from now (> 0).
     * @return campaignId The id of the newly created campaign.
     */
    function createCampaign(uint256 _goal, uint256 _duration)
        external
        returns (uint256 campaignId)
    {
        if (_goal == 0) revert InvalidGoal();
        if (_duration == 0) revert InvalidDuration();

        campaignId = campaignCount;
        campaigns[campaignId] = Campaign({
            creator: msg.sender,
            goal: _goal,
            deadline: block.timestamp + _duration,
            totalRaised: 0,
            withdrawn: false
        });

        unchecked {
            campaignCount = campaignId + 1;
        }

        emit CampaignCreated(campaignId, msg.sender, _goal, block.timestamp + _duration);
    }

    /**
     * @notice Contribute ETH to a campaign before its deadline.
     * @param _campaignId Campaign id.
     */
    function fund(uint256 _campaignId)
        external
        payable
        nonReentrant
        campaignExists(_campaignId)
    {
        if (msg.value == 0) revert ZeroContribution();

        Campaign storage c = campaigns[_campaignId];
        if (block.timestamp >= c.deadline) revert CampaignEnded();

        c.totalRaised += msg.value;
        contributions[_campaignId][msg.sender] += msg.value;

        emit Funded(_campaignId, msg.sender, msg.value, c.totalRaised);
    }

    /**
     * @notice Creator withdraws funds after a successful campaign.
     * @param _campaignId Campaign id.
     */
    function withdraw(uint256 _campaignId)
        external
        nonReentrant
        campaignExists(_campaignId)
    {
        Campaign storage c = campaigns[_campaignId];

        if (msg.sender != c.creator) revert NotCreator();
        if (block.timestamp < c.deadline) revert CampaignNotEnded();
        if (c.totalRaised < c.goal) revert GoalNotReached();
        if (c.withdrawn) revert AlreadyWithdrawn();

        uint256 amount = c.totalRaised;

        // Effects
        c.withdrawn = true;

        // Interactions
        (bool ok, ) = payable(c.creator).call{value: amount}("");
        if (!ok) revert TransferFailed();

        emit Withdrawn(_campaignId, c.creator, amount);
    }

    /**
     * @notice Contributor refund when a campaign fails to reach its goal by deadline.
     * @param _campaignId Campaign id.
     */
    function refund(uint256 _campaignId)
        external
        nonReentrant
        campaignExists(_campaignId)
    {
        Campaign storage c = campaigns[_campaignId];

        if (block.timestamp < c.deadline) revert CampaignNotEnded();
        if (c.totalRaised >= c.goal) revert GoalReached();

        uint256 contributed = contributions[_campaignId][msg.sender];
        if (contributed == 0) revert NothingToRefund();

        // Effects
        contributions[_campaignId][msg.sender] = 0;
        c.totalRaised -= contributed;

        // Interactions
        (bool ok, ) = payable(msg.sender).call{value: contributed}("");
        if (!ok) revert TransferFailed();

        emit Refunded(_campaignId, msg.sender, contributed);
    }

    /**
     * @notice View helper to read a campaign struct.
     */
    function getCampaign(uint256 _campaignId)
        external
        view
        campaignExists(_campaignId)
        returns (Campaign memory)
    {
        return campaigns[_campaignId];
    }

    /**
     * @notice View a contributor's contribution to a campaign.
     */
    function getContribution(uint256 _campaignId, address _contributor)
        external
        view
        returns (uint256)
    {
        return contributions[_campaignId][_contributor];
    }
}
