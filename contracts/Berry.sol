pragma solidity ^0.5.16;


import "./libraries/SafeMath.sol";
import "./libraries/BerryStorage.sol";
import "./libraries/BerryTransfer.sol";
import "./libraries/BerryDispute.sol";
import "./libraries/BerryStake.sol";
import "./libraries/BerryLibrary.sol";

/**
 * @title Berry Oracle System
 * @dev Oracle contract where miners can submit the proof of work along with the value.
 * The logic for this contract is in BerryLibrary.sol, BerryDispute.sol, BerryStake.sol,
 * and BerryTransfer.sol
 */
contract Berry {
    using SafeMath for uint256;

    using BerryDispute for BerryStorage.BerryStorageStruct;
    using BerryLibrary for BerryStorage.BerryStorageStruct;
    using BerryStake for BerryStorage.BerryStorageStruct;
    using BerryTransfer for BerryStorage.BerryStorageStruct;

    BerryStorage.BerryStorageStruct berry;

    /*Functions*/

    /**
    * @dev Helps initialize a dispute by assigning it a disputeId
    * when a miner returns a false on the validate array(in Berry.ProofOfWork) it sends the
    * invalidated value information to POS voting
    * @param _requestId being disputed
    * @param _timestamp being disputed
    * @param _minerIndex the index of the miner that submitted the value being disputed. Since each official value
    * requires 5 miners to submit a value.
    */
    function beginDispute(uint256 _requestId, uint256 _timestamp, uint256 _minerIndex) external {
        berry.beginDispute(_requestId, _timestamp, _minerIndex);
    }

    /**
    * @dev Allows token holders to vote
    * @param _disputeId is the dispute id
    * @param _supportsDispute is the vote (true=the dispute has basis false = vote against dispute)
    */
    function vote(uint256 _disputeId, bool _supportsDispute) external {
        berry.vote(_disputeId, _supportsDispute);
    }

    /**
    * @dev tallies the votes.
    * @param _disputeId is the dispute id
    */
    function tallyVotes(uint256 _disputeId) external {
        berry.tallyVotes(_disputeId);
    }

    /**
    * @dev Allows for a fork to be proposed
    * @param _propNewBerryAddress address for new proposed Berry
    */
    function proposeFork(address _propNewBerryAddress) external {
        berry.proposeFork(_propNewBerryAddress);
    }

    /**
    * @dev mark address as white list address or not
    * @param _markAddr is the marked address
    * @param _white is white or not
    */
    function markAddress(address _markAddr, bool _white) external {
        berry.markAddress(_markAddr, _white);
    }


    /**
    * @dev set yield pool info
    * @param _address is the yield pool address
    * @param _percent is the ratio to set
    */
    function setYieldInfo(address _address, uint256 _percent) public {
        berry.setYieldInfo(_address, _percent);
    }

    /**
    * @dev set burn pool info
    * @param _address is the burn pool address
    * @param _percent is the ratio to set
    */
    function setBurnInfo(address _address, uint256 _percent) public {
        berry.setBurnInfo(_address, _percent);
    }

    /**
    * @dev set needed miner num
    * @param _num the needed num
    *
    */
    function setNeededMinerNum(uint256 _num) public {
        berry.setNeededMinerNum(_num);
    }


    /**
    * @dev Add tip to Request value from oracle
    * @param _requestId being requested to be mined
    * @param _tip amount the requester is willing to pay to be get on queue. Miners
    * mine the onDeckQueryHash, or the api with the highest payout pool
    */
    function addTip(uint256 _requestId, uint256 _tip) external {
        berry.addTip(_requestId, _tip);
    }

    /**
    * @dev This is called by the miner when they submit the PoW solution (proof of work and value)
    * @param _nonce uint submitted by miner
    * @param _requestId is the array of the 5 PSR's being mined
    * @param _value is an array of 5 values
    */
    function submitMiningSolution(string calldata _nonce,uint256[5] calldata _requestId, uint256[5] calldata _value) external {
        berry.submitMiningSolution(_nonce,_requestId, _value);
    }


    /**
    * @dev Allows the current owner to propose transfer control of the contract to a
    * newOwner and the ownership is pending until the new owner calls the claimOwnership
    * function
    * @param _pendingOwner The address to transfer ownership to.
    */
    function proposeOwnership(address payable _pendingOwner) external {
        berry.proposeOwnership(_pendingOwner);
    }

    /**
    * @dev Allows the new owner to claim control of the contract
    */
    function claimOwnership() external {
        berry.claimOwnership();
    }

    /**
    * @dev This function allows miners to deposit their stake.
    */
    function depositStake() external {
        berry.depositStake();
    }

    /**
    * @dev This function allows stakers to request to withdraw their stake (no longer stake)
    * once they lock for withdraw(stakes.currentStatus = 2) they are locked for 7 days before they
    * can withdraw the stake
    */
    function requestStakingWithdraw() external {
        berry.requestStakingWithdraw();
    }

    /**
    * @dev This function allows users to withdraw their stake after a 7 day waiting period from request
    */
    function withdrawStake() external {
        berry.withdrawStake();
    }

    /**
    * @dev This function approves a _spender an _amount of tokens to use
    * @param _spender address
    * @param _amount amount the spender is being approved for
    * @return true if spender appproved successfully
    */
    function approve(address _spender, uint256 _amount) external returns (bool) {
        return berry.approve(_spender, _amount);
    }

    /**
    * @dev Allows for a transfer of tokens to _to
    * @param _to The address to send tokens to
    * @param _amount The amount of tokens to send
    * @return true if transfer is successful
    */
    function transfer(address _to, uint256 _amount) external returns (bool) {
        return berry.transfer(_to, _amount);
    }

    /**
    * @dev Sends _amount tokens to _to from _from on the condition it
    * is approved by _from
    * @param _from The address holding the tokens being transferred
    * @param _to The address of the recipient
    * @param _amount The amount of tokens to be transferred
    * @return True if the transfer was successful
    */
    function transferFrom(address _from, address _to, uint256 _amount) external returns (bool) {
        return berry.transferFrom(_from, _to, _amount);
    }

    /**
    * @dev Allows users to access the token's name
    */
    function name() external pure returns (string memory) {
        return "Berry Tributes";
    }

    /**
    * @dev Allows users to access the token's symbol
    */
    function symbol() external pure returns (string memory) {
        return "BRY";
    }

    /**
    * @dev Allows users to access the number of decimals
    */
    function decimals() external pure returns (uint8) {
        return 18;
    }

    /**
    * @dev Getter for the current variables that include the 5 requests Id's
    * @return the challenge, 5 requestsId, difficulty and tip
    */
    function getNewCurrentVariables() external view returns(bytes32 _challenge,uint[5] memory _requestIds,uint256 _difficutly, uint256 _tip){
        return berry.getNewCurrentVariables();
    }

    /**
    * @dev Getter for the top tipped 5 requests Id's
    * @return the 5 requestsId
    */
    function getTopRequestIDs() external view returns(uint256[5] memory _requestIds){
        return berry.getTopRequestIDs();
    }

    /**
    * @dev Getter for the 5 requests Id's next in line to get mined
    * @return the 5 requestsId
    */
    function getNewVariablesOnDeck() external view returns (uint256[5] memory idsOnDeck, uint256[5] memory tipsOnDeck) {
        return berry.getNewVariablesOnDeck();
    }

    /**
    * @dev Updates the Berry address after a proposed fork has 
    * passed the vote and day has gone by without a dispute
    * @param _disputeId the disputeId for the proposed fork
    */
     function updateBerry(uint _disputeId) external{
        return berry.updateBerry(_disputeId);
    }

    /**
    * @dev Allows disputer to unlock the dispute fee
    * @param _disputeId to unlock fee from
    */
     function unlockDisputeFee (uint _disputeId) external{
        return berry.unlockDisputeFee(_disputeId);
    }

 }
