// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract RoyaltiesRemuneration {

    struct DistributionAgreementInfo {
        // Distribution Aggrement set by Broadcaseter
        string title;
        address broadcaster;
        uint256 price;
        uint256 startDate;
        uint256 deadline;
        string[] countries;
        bool isDASet;
        // get access right info set by Distributor
        address distributorName;
        bool isPricePaid;
        // Royalties info set by Distributor
        uint256 numberOfUsers;
        address[] buyers;
        uint256[] donations;
        uint256 totalRevenue;
        uint256[] royalties;
        bool isRoyaltiesRemunerated;
    }

    mapping(uint256 => DistributionAgreementInfo) public distributionAgreementMap;

    uint256 public numberOfCampaigns = 0;


    ////////////////////////////////// Write functions ///////////////////


    // function called by Broadcaster
    function setDistributionAggrement(string memory _title, uint256 _price, uint256 _startDate, uint256 _deadline, string[] memory _countries) public returns (uint256) {
        require(_countries.length > 0, "No countries provided");
        require(_price > 0, "No price provided");

        DistributionAgreementInfo storage campaign = distributionAgreementMap[numberOfCampaigns];
        require(!campaign.isDASet, "Distribution agreement is already set");

        campaign.title = _title;
        campaign.broadcaster = msg.sender;
        campaign.price = _price;
        campaign.startDate = _startDate;
        campaign.deadline = _deadline;
        // update countries list by creating new array
        string[] memory updatedCountries = new string[](_countries.length);

        for (uint256 i = 0; i < _countries.length; i++) {
            updatedCountries[i] = _countries[i];
        }

        campaign.countries = updatedCountries;

        numberOfCampaigns++;
        campaign.isDASet = true;

        return numberOfCampaigns - 1;
    }

    // function called by Distributor and send Price to _broadcaster
    function buyStreamingRights(uint256 _id) public payable{
        uint256 amount = msg.value;
        DistributionAgreementInfo storage campaign = distributionAgreementMap[_id];
        require(campaign.isDASet, "Distribution Agrement is not set yet");
        require(address(this).balance >= amount, "Insufficient balance");

        (bool sent,) = payable(campaign.broadcaster).call{value: amount}("");

        if(sent) {
            campaign.distributorName = msg.sender;
            campaign.isPricePaid = true;
        }

    }
    
    // function called by Distributor to renumirate royalties to Buyers; called 
    function remunerateRoyalties(uint256 _id, uint256 _numberOfUsers, address payable[] memory _buyers, uint256[] memory _donations, uint256 _target, uint256 _totalRevenue) public payable {
        require(_numberOfUsers > 0, "Number of users is not provided");

        DistributionAgreementInfo storage campaign = distributionAgreementMap[_id];

        require(campaign.isPricePaid, "You don't have right to this movie and can't remunirate royalties");

        campaign.numberOfUsers = _numberOfUsers;
        for (uint256 i = 0; i < _buyers.length; i++) {
            campaign.buyers.push(_buyers[i]);
            campaign.donations.push(_donations[i]);
        }
        campaign.totalRevenue = _totalRevenue;
        
        for (uint256 i = 0; i < campaign.buyers.length; i++) {
            uint256 individualRoyalty = (campaign.totalRevenue * campaign.donations[i]) / _target;
            require(address(this).balance >= individualRoyalty, "Insufficient balance");
            (bool sent,) = payable(campaign.buyers[i]).call{value: individualRoyalty}("");

            if(sent) {
                campaign.royalties.push(individualRoyalty);
            }
        }
        campaign.isRoyaltiesRemunerated = true;
    }

    ////////////////////////////////// read functions ///////////////////


    // read function to render Time window and Country list on Distributor UI
    function getTimeWindow(uint256 _id) view public returns (uint256, uint256) {
        return (distributionAgreementMap[_id].startDate, distributionAgreementMap[_id].deadline);
    }

    function getCountryList(uint256 _id) view public returns (string[] memory) {
        return (distributionAgreementMap[_id].countries);
    }

    // read function to get royalties
    function getRoyalties(uint256 _id) view public returns (uint256[] memory) {
        return (distributionAgreementMap[_id].royalties);
    }
    
    // read function to get all info
    function getDistributionAggrements() public view returns (DistributionAgreementInfo[] memory) {
        DistributionAgreementInfo[] memory allCampaigns = new DistributionAgreementInfo[](numberOfCampaigns);

        for(uint i = 0; i < numberOfCampaigns; i++) {
            DistributionAgreementInfo storage item = distributionAgreementMap[i];

            allCampaigns[i] = item;
        }

        return allCampaigns;
    }

}