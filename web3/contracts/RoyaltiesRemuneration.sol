// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract RoyaltiesRemuneration {

    struct DistributionAgreementInfo {
        // Distribution Aggrement set by Broadcaseter
        string title;
        uint256 price;
        uint256 startDate;
        uint256 deadline;
        string[] countries;
        bool isDASet;
        // get access right info set by Distributor
        address distributorName;
        address[] buyers;
        uint256[] donations;
        uint256[] amountPaidToBuyers;
        bool isPricePaid;
        // Royalties info set by Distributor
        uint256 numberOfUsers;
        uint256 monthlySubscriptionFee;
        uint256 shareOfRevenue;
        uint256 totalAmountPaidAsRoyalty;
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
        campaign.price = _price;
        campaign.startDate = _startDate;
        campaign.deadline = _deadline;
        // update countries list
        string[] memory updatedCountries = new string[](_countries.length);

        for (uint256 i = 0; i < _countries.length; i++) {
            updatedCountries[i] = _countries[i];
        }

        campaign.countries = updatedCountries;
        // campaign.countries = _countries; -> error


        numberOfCampaigns++;
        campaign.isDASet = true;

        return numberOfCampaigns - 1;
    }

    // function called by Distributor and send Price to _buyers
    function buyRight(uint256 _id, address payable[] memory _buyers, uint256[] memory _donations, uint256 _target) public payable {
        require(_buyers.length > 0, "No buyers provided");
        require(msg.value > 0, "Price should be more than 0");

        DistributionAgreementInfo storage campaign = distributionAgreementMap[_id];

        if (msg.value == campaign.price) {
            for (uint256 i = 0; i < _buyers.length; i++) {
                require(campaign.isDASet, "Distribution Agrement is not set yet");
                uint256 individualShare = (campaign.price * _donations[i]) / _target;
                require(address(this).balance >= individualShare, "Insufficient balance");
                (bool sent,) = payable(_buyers[i]).call{value: individualShare}("");

                if(sent) {
                    campaign.buyers.push(_buyers[i]);
                    campaign.donations.push(_donations[i]);
                    campaign.amountPaidToBuyers.push(individualShare);
                }
            }         
        }

        campaign.distributorName = msg.sender;
        campaign.isPricePaid = true;
    }

    // function called by Distributor to renumirate royalties to Buyers; called 
    function remunerateRoyalties(uint256 _id, uint256 _numberOfUsers, uint256 _target, uint256 _monthlySubscriptionFee, uint256 _shareOfRevenue) public payable {
        require(_numberOfUsers > 0, "Number of users is not provided");
        require(_monthlySubscriptionFee > 0, "Subscription fee is not provided");
        require(_shareOfRevenue > 0, "Share of revenue is not provided");

        DistributionAgreementInfo storage campaign = distributionAgreementMap[_id];

        require(campaign.isPricePaid, "You don't have right to this movie and can't remunirate royalties");

        campaign.numberOfUsers = _numberOfUsers;
        campaign.monthlySubscriptionFee = _monthlySubscriptionFee;
        campaign.shareOfRevenue = _shareOfRevenue;
        
        uint256 totalRevenue = campaign.numberOfUsers * campaign.monthlySubscriptionFee;
        uint256 _totalAmountPaidAsRoyalty = totalRevenue * campaign.shareOfRevenue;

        campaign.totalAmountPaidAsRoyalty = _totalAmountPaidAsRoyalty;
        
        for (uint256 i = 0; i < campaign.buyers.length; i++) {
            uint256 individualRoyalty = (campaign.totalAmountPaidAsRoyalty * campaign.donations[i]) / _target;
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
    function getTimeCountryList(uint256 _id) view public returns (uint256, uint256, string[] memory) {
        DistributionAgreementInfo storage campaign = distributionAgreementMap[_id];
        require(campaign.isDASet, "Distribution Agreement is not set yet");

        return (distributionAgreementMap[_id].startDate, distributionAgreementMap[_id].deadline, distributionAgreementMap[_id].countries);
    }

    // read function to render Distributor name and Price on Broadcaster UI
    function getDistributorNamePrice(uint256 _id) view public returns (address, uint256) {
        DistributionAgreementInfo storage campaign = distributionAgreementMap[_id];
        require(campaign.isPricePaid, "No distributor information");

        return (distributionAgreementMap[_id].distributorName, distributionAgreementMap[_id].price);
    }

    // read function to get royalties
    function getRoyalties(uint256 _id) view public returns (uint256[] memory) {
        DistributionAgreementInfo storage campaign = distributionAgreementMap[_id];
        require(campaign.isRoyaltiesRemunerated, "No royalties information");

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