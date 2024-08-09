// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

contract VotingContract {
    using Counters for Counters.Counter;

    Counters.Counter public _voterId;
    Counters.Counter public _candidateId;

    address public votingOrganizer;

    struct Candidate {
        uint256 candidateId;
        string age;
        string name;
        string image;
        uint256 voteCount;
        address _address;
        string ipfs;
    }

    event CandidateCreate (
        uint256 indexed candidateId,
        string age,
        string name,
        string image,
        uint256 voteCount,
        address _address,
        string ipfs
    );

    address[] public candidateAddress;

    mapping(address => Candidate) public candidates;

    
    struct Voter {
        uint256 voter_voterId;
        string voter_name;
        string voter_image;
        address voter_address;
        uint256 voter_allowed;
        bool voter_voted;
        uint256 voter_vote;
        string voter_ipfs;
    }

    event VoterCreate(
        uint256 indexed voter_voterId,
        string voter_name,
        string voter_image,
        address voter_address,
        uint256 voter_allowed,
        bool voter_voted,
        uint256 voter_vote,
        string voter_ipfs
    );

    address[] public votedVoters;
    address[] public votersAddress;
    mapping(address => Voter) public voters;

    
    
    
    
    
    
    
    constructor() {
        votingOrganizer = msg.sender;
    }

    function setCandidate(address _address, string memory _age, string memory _name, string memory _image, string memory _ipfs) public {
        require(votingOrganizer == msg.sender, "You need to be the organizer to create a candidate");
        _candidateId.increment();

        uint256 idnumber = _candidateId.current();
        Candidate storage candidate = candidates[_address];
        candidate.age = _age;
        candidate.name = _name;
        candidate.candidateId = idnumber;
        candidate.image = _image;
        candidate.voteCount = 0;
        candidate._address = _address;
        candidate.ipfs = _ipfs;
        

        candidateAddress.push(_address);
        emit CandidateCreate(idnumber, _age, _name, _image, candidate.voteCount, _address, _ipfs);
    }

    function getCandidate() public view returns(address[] memory) {
        return candidateAddress;
    }

    function getCandidateLength() public view returns(uint256) {
        return candidateAddress.length;
    }

    function getCandidatedata(address _address) public view returns(string memory, string memory, uint256, string memory, uint256, string memory, address) {
        return (
            candidates[_address].age,
            candidates[_address].name,
            candidates[_address].candidateId,
            candidates[_address].image,
            candidates[_address].voteCount,
            candidates[_address].ipfs,
            candidates[_address]._address
        );
    }

    function voterRight(address _address, string memory _name, string memory _image, string memory _ipfs) public {
    require(votingOrganizer == msg.sender, "You need to be the organizer to create a voter");
    _voterId.increment();
    uint256 idnumber = _voterId.current();
    Voter storage voter = voters[_address];

    require(voter.voter_allowed == 0, "Voter already exists");

    voter.voter_allowed = 1;
    voter.voter_name = _name;
    voter.voter_image = _image;
    voter.voter_address = _address;
    voter.voter_voterId = idnumber;
    voter.voter_vote = 1000;
    voter.voter_voted = false;
    voter.voter_ipfs = _ipfs;

    votersAddress.push(_address);

    emit VoterCreate(idnumber, _name, _image, _address, voter.voter_allowed, voter.voter_voted, voter.voter_vote, _ipfs);
}


    function vote(address _candidateAddress, uint256 _candidateVoteId) external {
        Voter storage voter = voters[msg.sender];
        
        require(voters[msg.sender].voter_allowed == 1, "You are not allowed to vote");
        require(voters[msg.sender].voter_voted == false, "You have already voted");

        voter.voter_voted = true;
        voter.voter_vote = _candidateVoteId;

        candidates[_candidateAddress].voteCount += 1;
        votedVoters.push(msg.sender);
    }

    function getVoterLength() public view returns(uint256) {
        return votersAddress.length;
    }

    function getVoterData(address _address) public view returns(uint256, string memory, string memory, address, string memory, uint256, bool) {
        return (
            voters[_address].voter_voterId,
            voters[_address].voter_name,
            voters[_address].voter_image,
            voters[_address].voter_address,
            voters[_address].voter_ipfs,
            voters[_address].voter_allowed,
            voters[_address].voter_voted
        );
    }

    function getVotedVoterList() public view returns (address[] memory){
        return votedVoters;
    }




    function getAllVoterData() public view returns (Voter[] memory) {
        Voter[] memory allVoters = new Voter[](votersAddress.length);
        for (uint i = 0; i < votersAddress.length; i++) {
            allVoters[i] = voters[votersAddress[i]];
        }
        return allVoters;
    }

    function getVotedVoters() public view returns(address[] memory) {
        return votedVoters;
    }

    function getVoterList() public view returns(address[] memory) {
        return votersAddress;
    }
}
