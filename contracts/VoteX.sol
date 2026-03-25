// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract VoteX {

    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    Candidate[] public candidates;

    mapping(address => bool) public hasVoted;

    constructor() {
        candidates.push(Candidate(0, "Alice", 0));
        candidates.push(Candidate(1, "Bob", 0));
    }

    function vote(uint _candidateId) public {
        require(!hasVoted[msg.sender], "You have already voted");
        require(_candidateId < candidates.length, "Invalid candidate");

        candidates[_candidateId].voteCount += 1;
        hasVoted[msg.sender] = true;
    }

    function getCandidates() public view returns (Candidate[] memory) {
        return candidates;
    }
}
