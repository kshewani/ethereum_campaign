// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

contract CampaignFactory {
    address[] public deployedCampaigns;
    
    function createCampaign(uint minimum) public {
        Campaign newCampaign = new Campaign(minimum, msg.sender);
        address newCampaignAddress = address(newCampaign);
        deployedCampaigns.push(newCampaignAddress);
    }
    
    function getDeployedCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint value;
        address payable recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }
    
    mapping(address => bool) public approvers;
    address public manager;
    uint public minimumContribution;
    uint256 constant NULL = 0;
    uint requestsCount;
    mapping (uint => Request) public requests;
    uint public approversCount;
    
    modifier restrictToManager() {
        require(msg.sender == manager);
        _;
    }
  
    constructor(uint minimum, address creater) {
        manager = creater;
        minimumContribution = minimum;
    }
    
    function setMinimumContribution() public restrictToManager payable{
        minimumContribution = msg.value;
    }
    
    function approveRequest(uint index) public {
        Request storage request = requests[index];
        require(approvers[msg.sender]);
        require(!request.approvals[msg.sender]);
        
        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }
    
    function contribute() public payable {
        require(msg.value >= minimumContribution);
        approvers[msg.sender] = true;
        approversCount++;
    }
    
    function createRequest(string memory description, uint value, address payable recipient) public {            
        Request storage r = requests[requestsCount++];
        r.description = description;
        r.value = value;
        r.recipient = recipient;
        r.complete = false;
        r.approvalCount = 0;
    }
    
    function finalizeRequest(uint index) public restrictToManager {
        Request storage request = requests[index];
        require(!request.complete);
        require(request.approvalCount > (approversCount / 2));

        request.recipient.transfer(request.value);
        request.complete = true;
    }

    function getSummary() public view returns (uint, uint, uint, uint, address) {
        return (
            minimumContribution,
            address (this).balance,
            requestsCount,
            approversCount,
            manager
        );
    }

    function getRequestsCount() public view returns (uint) {
        return requestsCount;
    }
}