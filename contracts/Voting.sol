// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Voting {
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    mapping(uint => Candidate) public candidates;
    mapping(address => bool) public voters;
    uint public candidatesCount;
    uint public totalVotes;
    address public owner;
    bool public votingActive;

    event Voted(address indexed voter, uint indexed candidateId, uint timestamp);
    event VotingStarted(uint timestamp);
    event VotingEnded(uint timestamp);
    event CandidateAdded(uint indexed candidateId, string name, uint timestamp);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier votingIsActive() {
        require(votingActive, "Voting is not active");
        _;
    }

    constructor() {
        owner = msg.sender;
        votingActive = true;
        addCandidate("Candidate 1");
        addCandidate("Candidate 2");
        emit VotingStarted(block.timestamp);
    }

    function addCandidate(string memory _name) public onlyOwner {
        require(bytes(_name).length > 0, "Candidate name cannot be empty");
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
        emit CandidateAdded(candidatesCount, _name, block.timestamp);
    }

    function vote(uint _candidateId) public votingIsActive {
        require(!voters[msg.sender], "Already voted");
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate");

        voters[msg.sender] = true;
        candidates[_candidateId].voteCount++;
        totalVotes++;

        emit Voted(msg.sender, _candidateId, block.timestamp);
    }

    function getCandidates() public view returns (Candidate[] memory) {
        Candidate[] memory _candidates = new Candidate[](candidatesCount);
        for (uint i = 1; i <= candidatesCount; i++) {
            _candidates[i-1] = candidates[i];
        }
        return _candidates;
    }

    function getVotingStatus() public view returns (bool active, uint totalVoteCount, uint candidateCount) {
        return (votingActive, totalVotes, candidatesCount);
    }

    function endVoting() public onlyOwner votingIsActive {
        votingActive = false;
        emit VotingEnded(block.timestamp);
    }

    function startVoting() public onlyOwner {
        require(!votingActive, "Voting is already active");
        votingActive = true;
        emit VotingStarted(block.timestamp);
    }

    function hasVoted(address _voter) public view returns (bool) {
        return voters[_voter];
    }
}