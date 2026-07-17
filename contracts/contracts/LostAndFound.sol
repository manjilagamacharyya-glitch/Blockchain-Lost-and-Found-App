// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract LostAndFound {
    enum Status { Lost, Found, Claimed, Resolved }

    struct Item {
        uint id;
        address reporter;
        string itemName;
        string description;
        string ipfsHash;
        string location;
        uint timestamp;
        Status status;
        address claimant;
        string claimProof;
    }

    uint public itemCount;
    mapping(uint => Item) public items;

    event ItemReported(uint id, address reporter, Status status);
    event ClaimSubmitted(uint id, address claimant);
    event ItemResolved(uint id, address resolvedTo);

    function reportItem(
        string memory _name,
        string memory _description,
        string memory _ipfsHash,
        string memory _location,
        Status _status
    ) external {
        itemCount++;
        items[itemCount] = Item(
            itemCount,
            msg.sender,
            _name,
            _description,
            _ipfsHash,
            _location,
            block.timestamp,
            _status,
            address(0),
            ""
        );
        emit ItemReported(itemCount, msg.sender, _status);
    }

    function submitClaim(uint _id, string memory _proof) external {
        require(items[_id].status == Status.Found, "Not claimable");
        items[_id].claimant = msg.sender;
        items[_id].claimProof = _proof;
        items[_id].status = Status.Claimed;
        emit ClaimSubmitted(_id, msg.sender);
    }

    function resolveClaim(uint _id, bool approve) external {
        Item storage it = items[_id];
        require(msg.sender == it.reporter, "Only reporter can resolve");
        require(it.status == Status.Claimed, "No claim pending");

        if (approve) {
            it.status = Status.Resolved;
            emit ItemResolved(_id, it.claimant);
        } else {
            it.status = Status.Found;
            it.claimant = address(0);
            it.claimProof = "";
        }
    }

    function getItem(uint _id) external view returns (Item memory) {
        return items[_id];
    }
}