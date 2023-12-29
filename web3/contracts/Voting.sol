// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Voting {
  struct Candidate {
        string name;
        uint256 voteCount;
    }

    Candidate[] public candidates;
    address admin;

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin {
        require(msg.sender == admin);
        _;
    }

    function addCandidate(string memory _name) public {
        candidates.push(Candidate({
                name: _name,
                voteCount: 0
        }));
    }
    
    function removeCandidate(string memory _name) public {
        for (uint i = 0; i < candidates.length; i++) {
            if (keccak256(bytes(candidates[i].name)) == keccak256(bytes(_name))) {
                // Found the candidate to remove
                if (i < candidates.length - 1) {
                    candidates[i] = candidates[candidates.length - 1];
                }
                // Remove the last element
                candidates.pop();
                return;
            }
        }
    }

    function voteAccept(uint256 _candidateIndex) public {
        require(_candidateIndex < candidates.length, "Invalid candidate index.");

        candidates[_candidateIndex].voteCount++;
    }
    
    function voteDeny(uint256 _candidateIndex) public {
        require(_candidateIndex < candidates.length, "Invalid candidate index.");

        candidates[_candidateIndex].voteCount--;
    }

    function getAllVotesOfCandiates() public view returns (Candidate[] memory){
        return candidates;
    }
}