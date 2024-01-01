// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract CrowdFunding {
    struct Campaign {
        address producer;
        string title;
        string description;
        uint256 target;
        uint256 amountCollected;
        string image;
        address[] donators;
        uint256[] donations;
    }

    struct DistributionAgreement {
        // Distribution Agreement
        address broadcaster;
        uint256 priceDA;
        uint256 startDate;
        uint256 deadline;
        string[] countries;
        bool isDASet;
        // get access right info set by Distributor
        address distributor;
        bool isPricePaid;
        // Royalties remuniration
        uint256 numberOfUsers;
        uint256 subscriptionFee;
        uint256 shareOfRevenue;
        uint256[] royalties;
        bool isRoyaltiesRemunerated;
    }

    mapping(uint256 => Campaign) public campaigns;
    mapping(uint256 => DistributionAgreement) public daMap;

    uint256 public numberOfCampaigns = 0;

    function createCampaign(address _producer, string memory _title, string memory _description, uint256 _target, string memory _image) public returns (uint256) {
        Campaign storage campaign = campaigns[numberOfCampaigns];

        campaign.producer = _producer;
        campaign.title = _title;
        campaign.description = _description;
        campaign.target = _target;
        campaign.amountCollected = 0;
        campaign.image = _image;

        numberOfCampaigns++;

        return numberOfCampaigns - 1;
    }

    function donateToCampaign(uint256 _id) public payable {
        uint256 amount = msg.value;

        Campaign storage campaign = campaigns[_id];

        campaign.donators.push(msg.sender);
        campaign.donations.push(amount);

        (bool sent,) = payable(campaign.producer).call{value: amount}("");

        if(sent) {
            campaign.amountCollected = campaign.amountCollected + amount;
        }
    }

    function getDonators(uint256 _id) view public returns (address[] memory, uint256[] memory) {
        return (campaigns[_id].donators, campaigns[_id].donations);
    }

    function getCampaigns() public view returns (Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](numberOfCampaigns);

        for(uint i = 0; i < numberOfCampaigns; i++) {
            Campaign storage item = campaigns[i];

            allCampaigns[i] = item;
        }

        return allCampaigns;
    }

    ////////////////////// Distribution agreement ///////////////////////

    // function called by Broadcaster
    function setDistributionAggrement(uint256 _id, uint256 _price, uint256 _startDate, uint256 _deadline, string[] memory _countries) public {
        require(_countries.length > 0, "No countries provided");
        require(_price > 0, "No price provided");

        DistributionAgreement storage campaign = daMap[_id];

        require(!campaign.isDASet, "Distribution agreement is already set");

        campaign.broadcaster = msg.sender;
        campaign.priceDA = _price;
        campaign.startDate = _startDate;
        campaign.deadline = _deadline;
        // update countries list by creating new array
        string[] memory updatedCountries = new string[](_countries.length);

        for (uint256 i = 0; i < _countries.length; i++) {
            updatedCountries[i] = _countries[i];
        }

        campaign.countries = updatedCountries;
        campaign.isDASet = true;
    }

     // function called by Distributor and send Price to _broadcaster
    function buyStreamingRights(uint256 _id) public payable{
        uint256 amount = msg.value;
        DistributionAgreement storage campaign = daMap[_id];
        require(campaign.isDASet, "Distribution Agrement is not set yet");
        require(address(this).balance >= amount, "Insufficient balance");

        (bool sent,) = payable(campaign.broadcaster).call{value: amount}("");

        if(sent) {
            campaign.distributor = msg.sender;
            campaign.isPricePaid = true;
        }

    }

    // function called by Distributor to renumirate royalties to Buyers; called 
    function remunerateRoyalties(uint256 _id, uint256 _numberOfUsers, uint256 _subscriptionFee, uint256 _shareOfRevenue) public payable {
        require(_numberOfUsers > 0, "Number of users is not provided");
        require(_subscriptionFee > 0, "Subscription Fee is not provided");

        Campaign storage campaign = campaigns[_id];
        DistributionAgreement storage daInfo = daMap[_id];

        require(daInfo.isPricePaid, "You don't have right to this movie, therefore can't remunirate royalties");
        uint256 totalEth = msg.value;

        daInfo.numberOfUsers = _numberOfUsers;
        for (uint256 i = 0; i < campaign.donators.length; i++) {
            uint256 individualRoyalty = totalEth * campaign.donations[i] / campaign.target;
            daInfo.royalties.push(individualRoyalty);
        }
        daInfo.subscriptionFee = _subscriptionFee;
        daInfo.shareOfRevenue = _shareOfRevenue;
        
        // send the specified amount of Royalties to the donator
        for(uint i = 0; i < campaign.donators.length; i++) {
            if(campaign.donators[i] != address(0) && daInfo.royalties[i] > 0) {
                payable(campaign.donators[i]).transfer(daInfo.royalties[i]);
            }
        }
        daInfo.isRoyaltiesRemunerated = true;
    }

    ////////////////////////////////// read DA functions ///////////////////

    // read function to render Time window and Country list on Distributor UI
    function getTimeWindow(uint256 _id) view public returns (uint256, uint256) {
        return (daMap[_id].startDate, daMap[_id].deadline);
    }

    function getCountryList(uint256 _id) view public returns (string[] memory) {
        return (daMap[_id].countries);
    }

    // read function to get royalties
    function getRoyalties(uint256 _id) view public returns (uint256[] memory) {
        return (daMap[_id].royalties);
    }

    // read function to get all info
    function getDistributionAggrements() public view returns (DistributionAgreement[] memory) {
        DistributionAgreement[] memory allCampaigns = new DistributionAgreement[](numberOfCampaigns);

        for(uint i = 0; i < numberOfCampaigns; i++) {
            DistributionAgreement storage item = daMap[i];

            allCampaigns[i] = item;
        }

        return allCampaigns;
    }

    // helper functions
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    // Function to get the balance of a specific address
    function getAddressBalance(address account) external view returns (uint256) {
        return account.balance;
    }
}