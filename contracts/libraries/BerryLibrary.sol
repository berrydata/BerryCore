pragma solidity ^0.5.16;


import "./SafeMath.sol";
import "./Utilities.sol";
import "./BerryStorage.sol";
import "./BerryTransfer.sol";
import "./BerryDispute.sol";
import "./BerryStake.sol";
import "./BerryGettersLibrary.sol";

/**
 * @title Berry Oracle System Library
 * @dev Contains the functions' logic for the Berry contract where miners can submit the proof of work
 * along with the value and smart contracts can requestData and tip miners.
 */
library BerryLibrary {
    using SafeMath for uint256;

    bytes32 public constant requestCount = 0x05de9147d05477c0a5dc675aeea733157f5092f82add148cf39d579cafe3dc98; //keccak256("requestCount")
    bytes32 public constant totalTip = 0x2a9e355a92978430eca9c1aa3a9ba590094bac282594bccf82de16b83046e2c3; //keccak256("totalTip")
    bytes32 public constant _tBlock = 0x969ea04b74d02bb4d9e6e8e57236e1b9ca31627139ae9f0e465249932e824502; //keccak256("_tBlock")
    bytes32 public constant timeOfLastNewValue = 0x97e6eb29f6a85471f7cc9b57f9e4c3deaf398cfc9798673160d7798baf0b13a4; //keccak256("timeOfLastNewValue")
    bytes32 public constant difficulty = 0xb12aff7664b16cb99339be399b863feecd64d14817be7e1f042f97e3f358e64e; //keccak256("difficulty")
    bytes32 public constant timeTarget = 0xad16221efc80aaf1b7e69bd3ecb61ba5ffa539adf129c3b4ffff769c9b5bbc33; //keccak256("timeTarget")
    bytes32 public constant runningTips = 0xdb21f0c4accc4f2f5f1045353763a9ffe7091ceaf0fcceb5831858d96cf84631; //keccak256("runningTips")
    bytes32 public constant total_supply = 0xb1557182e4359a1f0c6301278e8f5b35a776ab58d39892581e357578fb287836; //keccak256("total_supply")
    bytes32 public constant devShare = 0x8fe9ded8d7c08f720cf0340699024f83522ea66b2bbfb8f557851cb9ee63b54c; //keccak256("devShare")
    bytes32 public constant _owner =  0x9dbc393ddc18fd27b1d9b1b129059925688d2f2d5818a5ec3ebb750b7c286ea6; //keccak256("_owner")
    bytes32 public constant requestQPosition = 0x1e344bd070f05f1c5b3f0b1266f4f20d837a0a8190a3a2da8b0375eac2ba86ea; //keccak256("requestQPosition")
    bytes32 public constant currentTotalTips = 0xd26d9834adf5a73309c4974bf654850bb699df8505e70d4cfde365c417b19dfc; //keccak256("currentTotalTips")
    bytes32 public constant slotProgress =0x6c505cb2db6644f57b42d87bd9407b0f66788b07d0617a2bc1356a0e69e66f9a; //keccak256("slotProgress")
    bytes32 public constant pending_owner = 0x44b2657a0f8a90ed8e62f4c4cceca06eacaa9b4b25751ae1ebca9280a70abd68; //keccak256("pending_owner")
    bytes32 public constant currentRequestId = 0x7584d7d8701714da9c117f5bf30af73b0b88aca5338a84a21eb28de2fe0d93b8; //keccak256("currentRequestId")


    event TipAdded(address indexed _sender, uint256 indexed _requestId, uint256 _tip, uint256 _totalTips);
    //emits when a new challenge is created (either on mined block or when a new request is pushed forward on waiting system)
    event NewChallenge(
        bytes32 indexed _currentChallenge,
        uint256[5] _currentRequestId,
        uint256 _difficulty,
        uint256 _totalTips
    );
    //Emits upon a successful Mine, indicates the blocktime at point of the mine and the value mined
    event NewValue(uint256[5] _requestId, uint256 _time, uint256[5] _value, uint256 _totalTips, bytes32 indexed _currentChallenge);
    //Emits upon each mine (5 total) and shows the miner, nonce, and value submitted
    event NonceSubmitted(address indexed _miner, string _nonce, uint256[5] _requestId, uint256[5] _value, bytes32 indexed _currentChallenge);
    event OwnershipTransferred(address indexed _previousOwner, address indexed _newOwner);
    event OwnershipProposed(address indexed _previousOwner, address indexed _newOwner);

    /*Functions*/
    /**
    * @dev Add tip to Request value from oracle
    * @param _requestId being requested to be mined
    * @param _tip amount the requester is willing to pay to be get on queue. Miners
    * mine the onDeckQueryHash, or the api with the highest payout pool
    */
    function addTip(BerryStorage.BerryStorageStruct storage self, uint256 _requestId, uint256 _tip) public {
        require(_requestId != 0, "RequestId is 0");
        require(_tip != 0, "Tip should be greater than 0");
        uint256 _count =self.uintVars[requestCount] + 1;
        if(_requestId == _count){
            self.uintVars[requestCount] = _count;
        }
        else{
            require(_requestId < _count, "RequestId is not less than count");
        }
        BerryTransfer.doTransfer(self, msg.sender, address(this), _tip);
        //Update the information for the request that should be mined next based on the tip submitted
        updateOnDeck(self, _requestId, _tip);
        emit TipAdded(msg.sender, _requestId, _tip, self.requestDetails[_requestId].apiUintVars[totalTip]);

        // for init
        if (self.uintVars[_tBlock] == 0 && self.uintVars[requestCount] >= 5) {
            self.uintVars[timeTarget] = 180;
            self.uintVars[_tBlock] = 1e18;
            self.uintVars[difficulty] = 1;
            for(uint i = 0; i< 5;i++){
                self.currentMiners[i].value = i+1;
                self.requestQ[self.requestDetails[i+1].apiUintVars[requestQPosition]] = 0;
                self.uintVars[currentTotalTips] += self.requestDetails[i+1].apiUintVars[totalTip];
            }
            self.currentChallenge = keccak256(abi.encode(1, self.currentChallenge, blockhash(block.number - 1))); // Save hash for next proof
        }
    }

   /**
    * @dev This function is called by submitMiningSolution and adjusts the difficulty, sorts and stores the first
    * 5 values received, pays the miners, the dev share and assigns a new challenge
    * @param _nonce or solution for the PoW  for the requestId
    * @param _requestId for the current request being mined
    */
    function newBlock(BerryStorage.BerryStorageStruct storage self, string memory _nonce, uint256[5] memory _requestId) public {
        BerryStorage.Request storage _tblock = self.requestDetails[self.uintVars[_tBlock]];
        // If the difference between the timeTarget and how long it takes to solve the challenge this updates the challenge
        //difficulty up or donw by the difference between the target time and how long it took to solve the previous challenge
        //otherwise it sets it to 1
        int256 _change = int256(SafeMath.min(1200, (now - self.uintVars[timeOfLastNewValue])));
        int256 _diff = int256(self.uintVars[difficulty]);
        _change = (_diff * (int256(self.uintVars[timeTarget]) - _change)) / 4000;
        if (_change == 0) {
                _change = 1;
            }
        self.uintVars[difficulty]  = uint256(SafeMath.max(_diff + _change,1));
        //Sets time of value submission rounded to 1 minute
        bytes32 _currChallenge = self.currentChallenge;
        uint256 _timeOfLastNewValue = now - (now % 1 minutes);
        self.uintVars[timeOfLastNewValue] = _timeOfLastNewValue;
        address[5] memory b;
        for (uint k = 0; k < 5; k++) {
            b[k] = _tblock.minersByValue[1][k];
            require(b[k] != address(0), "b is 0 address");
        }

        uint[5] memory a;
        for (uint k = 0; k < 5; k++) {
            for (uint i = 1; i < 5; i++) {
                uint256 temp = _tblock.valuesByTimestamp[k][i];
                address temp2 = _tblock.minersByValue[k][i];
                uint256 j = i;
                while (j > 0 && temp < _tblock.valuesByTimestamp[k][j - 1]) {
                    _tblock.valuesByTimestamp[k][j] = _tblock.valuesByTimestamp[k][j - 1];
                    _tblock.minersByValue[k][j] = _tblock.minersByValue[k][j - 1];
                    j--;
                }
                if (j < i) {
                    _tblock.valuesByTimestamp[k][j] = temp;
                    _tblock.minersByValue[k][j] = temp2;
                }
            }
            BerryStorage.Request storage _request = self.requestDetails[_requestId[k]];
            //Save the official(finalValue), timestamp of it, 5 miners and their submitted values for it, and its block number
            a = _tblock.valuesByTimestamp[k];
            _request.finalValues[_timeOfLastNewValue] = a[2];
            _request.minersByValue[_timeOfLastNewValue] = _tblock.minersByValue[k];
            _request.valuesByTimestamp[_timeOfLastNewValue] = _tblock.valuesByTimestamp[k];
            delete _tblock.minersByValue[k];
            delete _tblock.valuesByTimestamp[k];
            _request.requestTimestamps.push(_timeOfLastNewValue);
            _request.minedBlockNum[_timeOfLastNewValue] = block.number;
            _request.apiUintVars[totalTip] = 0;
        }
        emit NewValue(
            _requestId,
            _timeOfLastNewValue,
            a,
            self.uintVars[runningTips],
            _currChallenge
        );
        //map the timeOfLastValue to the requestId that was just mined
        self.requestIdByTimestamp[_timeOfLastNewValue] = _requestId[0];
        //add timeOfLastValue to the newValueTimestamps array
        self.newValueTimestamps.push(_timeOfLastNewValue);

        //pay reward to miners
        _payReward(self, b);

        self.uintVars[_tBlock] ++;
        self.uintVars[currentTotalTips] = 0;

        // for next round
        uint256[5] memory _topId = BerryStake.getTopRequestIDs(self);
        for(uint i = 0; i< 5;i++){
            self.currentMiners[i].value = _topId[i];
            self.requestQ[self.requestDetails[_topId[i]].apiUintVars[requestQPosition]] = 0;
            self.uintVars[currentTotalTips] += self.requestDetails[_topId[i]].apiUintVars[totalTip];
        }
        //Issue the the next challenge
       
        _currChallenge = keccak256(abi.encode(_nonce, _currChallenge, blockhash(block.number - 1)));
        self.currentChallenge = _currChallenge; // Save hash for next proof
        emit NewChallenge(
            _currChallenge,
            _topId,
            self.uintVars[difficulty],
            self.uintVars[currentTotalTips]
        );
    }

    /**
    * @dev Proof of work is called by the miner when they submit the solution (proof of work and value)
    * @param _nonce uint submitted by miner
    * @param _requestId is the array of the 5 PSR's being mined
    * @param _value is an array of 5 values
    */
    function submitMiningSolution(BerryStorage.BerryStorageStruct storage self, string calldata _nonce,uint256[5] calldata _requestId, uint256[5] calldata _value)
        external
    {
        //Verifying Miner Eligibility
        bytes32 _hashMsgSender = keccak256(abi.encode(msg.sender));
        require(self.stakerDetails[msg.sender].currentStatus == 1, "Miner status is not staker");
        //require(now - self.uintVars[_hashMsgSender] > 2 minutes, "Miner can only win rewards once per 2 min");
        require(_requestId[0] ==  self.currentMiners[0].value,"Request ID is wrong");
        require(_requestId[1] ==  self.currentMiners[1].value,"Request ID is wrong");
        require(_requestId[2] ==  self.currentMiners[2].value,"Request ID is wrong");
        require(_requestId[3] ==  self.currentMiners[3].value,"Request ID is wrong");
        require(_requestId[4] ==  self.currentMiners[4].value,"Request ID is wrong");
        self.uintVars[_hashMsgSender] = now;

        
        bytes32 _currChallenge = self.currentChallenge;
        uint256 _slotProgress = self.uintVars[slotProgress]; 
        //Saving the challenge information as unique by using the msg.sender
        require(uint256(
                sha256(abi.encodePacked(ripemd160(abi.encodePacked(keccak256(abi.encodePacked(_currChallenge, msg.sender, _nonce))))))
            ) %
                self.uintVars[difficulty] == 0
                || (now - (now % 1 minutes)) - self.uintVars[timeOfLastNewValue] >= 15 minutes,
            "Incorrect nonce for current challenge"
        );

        //Checking and updating Miner Status
        require(self.minersByChallenge[_currChallenge][msg.sender] == false, "Miner already submitted the value");
        //Update the miner status to true once they submit a value so they don't submit more than once
        self.minersByChallenge[_currChallenge][msg.sender] = true;

        //Updating Request
        BerryStorage.Request storage _tblock = self.requestDetails[self.uintVars[_tBlock]];
        _tblock.minersByValue[1][_slotProgress]= msg.sender; 
        //Assigng directly is cheaper than using a for loop
        _tblock.valuesByTimestamp[0][_slotProgress] = _value[0];
        _tblock.valuesByTimestamp[1][_slotProgress] = _value[1];
        _tblock.valuesByTimestamp[2][_slotProgress] = _value[2];
        _tblock.valuesByTimestamp[3][_slotProgress] = _value[3];
        _tblock.valuesByTimestamp[4][_slotProgress] = _value[4];
        _tblock.minersByValue[0][self.uintVars[slotProgress]]= msg.sender;
        _tblock.minersByValue[1][self.uintVars[slotProgress]]= msg.sender;
        _tblock.minersByValue[2][self.uintVars[slotProgress]]= msg.sender;
        _tblock.minersByValue[3][self.uintVars[slotProgress]]= msg.sender;
        _tblock.minersByValue[4][self.uintVars[slotProgress]]= msg.sender;

        self.uintVars[slotProgress]++;

        //If 5 values have been received, adjust the difficulty otherwise sort the values until 5 are received         
        if (_slotProgress + 1 == 5) { //slotProgress has been incremented, but we're using the variable on stack to save gas
            newBlock(self, _nonce, _requestId);
            self.uintVars[slotProgress] = 0;
        }
        emit NonceSubmitted(msg.sender, _nonce, _requestId, _value, _currChallenge);
    }

    /**
    * @dev Internal function to calculate and pay rewards to miners
    */
    function _payReward(BerryStorage.BerryStorageStruct storage self, address[5] memory a) internal {
        //update height
        self.uintVars[keccak256("height")] += 1;
        uint256 reward;
        if (self.uintVars[keccak256("height")] > 518400) {
            reward = 0;
        } else {
	    reward = 9645061728395060000;
        }

        //pay the miners
        for (uint i = 0; i < 5; i++) {
            BerryTransfer.doTransfer(self, address(this), a[i], (reward + self.uintVars[currentTotalTips]) / 5);
        }

        //update the total supply
        self.uintVars[keccak256("total_supply")] += reward;
    }



    /**
    * @dev Allows the current owner to propose transfer control of the contract to a
    * newOwner and the ownership is pending until the new owner calls the claimOwnership
    * function
    * @param _pendingOwner The address to transfer ownership to.
    */
    function proposeOwnership(BerryStorage.BerryStorageStruct storage self, address payable _pendingOwner) public {
        require(msg.sender == self.addressVars[_owner], "Sender is not owner");
        emit OwnershipProposed(self.addressVars[_owner], _pendingOwner);
        self.addressVars[pending_owner] = _pendingOwner;
    }

    /**
    * @dev Allows the new owner to claim control of the contract
    */
    function claimOwnership(BerryStorage.BerryStorageStruct storage self) public {
        require(msg.sender == self.addressVars[pending_owner], "Sender is not pending owner");
        emit OwnershipTransferred(self.addressVars[_owner], self.addressVars[pending_owner]);
        self.addressVars[_owner] = self.addressVars[pending_owner];
    }

    /**
    * @dev This function updates APIonQ and the requestQ when requestData or addTip are ran
    * @param _requestId being requested
    * @param _tip is the tip to add
    */
    function updateOnDeck(BerryStorage.BerryStorageStruct storage self, uint256 _requestId, uint256 _tip) public {
        BerryStorage.Request storage _request = self.requestDetails[_requestId];
        _request.apiUintVars[totalTip] = _request.apiUintVars[totalTip].add(_tip);
        if(self.currentMiners[0].value == _requestId || self.currentMiners[1].value== _requestId ||self.currentMiners[2].value == _requestId||self.currentMiners[3].value== _requestId || self.currentMiners[4].value== _requestId ){
            self.uintVars[currentTotalTips] += _tip;
        }
        else {
            //if the request is not part of the requestQ[51] array
            //then add to the requestQ[51] only if the _payout/tip is greater than the minimum(tip) in the requestQ[51] array
            if (_request.apiUintVars[requestQPosition] == 0) {
                uint256 _min;
                uint256 _index;
                (_min, _index) = Utilities.getMin(self.requestQ);
                //we have to zero out the oldOne
                //if the _payout is greater than the current minimum payout in the requestQ[51] or if the minimum is zero
                //then add it to the requestQ array aand map its index information to the requestId and the apiUintvars
                if (_request.apiUintVars[totalTip] > _min || _min == 0) {
                    self.requestQ[_index] = _request.apiUintVars[totalTip];
                    self.requestDetails[self.requestIdByRequestQIndex[_index]].apiUintVars[requestQPosition] = 0;
                    self.requestIdByRequestQIndex[_index] = _requestId;
                    _request.apiUintVars[requestQPosition] = _index;
                }
                // else if the requestid is part of the requestQ[51] then update the tip for it
            } else{
                self.requestQ[_request.apiUintVars[requestQPosition]] += _tip;
            }
        }
    }


/**********************CHEAT Functions for Testing******************************/
/**********************CHEAT Functions for Testing******************************/
/**********************CHEAT Functions for Testing--No Nonce******************************/


    // /*This is a cheat for demo purposes, will delete upon actual launch*/
    // function theLazyCoon(BerryStorage.BerryStorageStruct storage self,address _address, uint _amount) public {
    //     self.uintVars[total_supply] += _amount;
    //     BerryTransfer.updateBalanceAtNow(self.balances[_address],_amount);
    // } 

    // /**
    // * @dev Proof of work is called by the miner when they submit the solution (proof of work and value)
    // * @param _nonce uint submitted by miner
    // * @param _requestId the apiId being mined
    // * @param _value of api query
    // ** OLD!!!!!!!!
    // */
    // function testSubmitMiningSolution(BerryStorage.BerryStorageStruct storage self, string memory _nonce, uint256 _requestId, uint256 _value)
    //     public
    // {
    //     require (self.uintVars[timeTarget] == 600, "Contract has upgraded, call new function");
    //     //require miner is staked
    //     require(self.stakerDetails[msg.sender].currentStatus == 1, "Miner status is not staker");
    //     //Check the miner is submitting the pow for the current request Id
    //     require(_requestId == self.uintVars[currentRequestId], "RequestId is wrong");
    //     //Saving the challenge information as unique by using the msg.sender
    //     // require(
    //     //     uint256(
    //     //         sha256(abi.encodePacked(ripemd160(abi.encodePacked(keccak256(abi.encodePacked(self.currentChallenge, msg.sender, _nonce))))))
    //     //     ) %
    //     //         self.uintVars[difficulty] ==
    //     //         0,
    //     //     "Incorrect nonce for current challenge"
    //     // );
    //     //Make sure the miner does not submit a value more than once
    //     require(self.minersByChallenge[self.currentChallenge][msg.sender] == false, "Miner already submitted the value");
    //     //Save the miner and value received
    //     uint256 _slotProgress = self.uintVars[slotProgress]; 
    //     self.currentMiners[_slotProgress].value = _value;
    //     self.currentMiners[_slotProgress].miner = msg.sender;
    //     //Add to the count how many values have been submitted, since only 5 are taken per request
    //     self.uintVars[slotProgress]++;
    //     //Update the miner status to true once they submit a value so they don't submit more than once
    //     self.minersByChallenge[self.currentChallenge][msg.sender] = true;
    //     //If 5 values have been received, adjust the difficulty otherwise sort the values until 5 are received
    //     if (_slotProgress + 1 == 5) {
    //         newBlock(self, _nonce, _requestId);
    //     }
    // }

    // /**
    // * @dev Proof of work is called by the miner when they submit the solution (proof of work and value)
    // * @param _nonce uint submitted by miner
    // * @param _requestId is the array of the 5 PSR's being mined
    // * @param _value is an array of 5 values
    // */
    // function testSubmitMiningSolution(BerryStorage.BerryStorageStruct storage self, string memory _nonce,uint256[5] memory _requestId, uint256[5] memory _value)
    //     public
    // {
    //     bytes32 _hashMsgSender = keccak256(abi.encode(msg.sender));
    //     require(self.stakerDetails[msg.sender].currentStatus == 1, "Miner status is not staker");
    //     //require(now - self.uintVars[_hashMsgSender] > 15 minutes, "Miner can only win rewards once per 15 min");
    //     require(_requestId[0] ==  self.currentMiners[0].value,"Request ID is wrong");
    //     require(_requestId[1] ==  self.currentMiners[1].value,"Request ID is wrong");
    //     require(_requestId[2] ==  self.currentMiners[2].value,"Request ID is wrong");
    //     require(_requestId[3] ==  self.currentMiners[3].value,"Request ID is wrong");
    //     require(_requestId[4] ==  self.currentMiners[4].value,"Request ID is wrong");
    //     self.uintVars[_hashMsgSender] = now;

    //     bytes32 _currChallenge = self.currentChallenge;
    //     uint256 _slotProgress = self.uintVars[slotProgress];

    //     //Saving the challenge information as unique by using the msg.sender
    //     // require(uint256(
    //     //         sha256(abi.encodePacked(ripemd160(abi.encodePacked(keccak256(abi.encodePacked(self.currentChallenge, msg.sender, _nonce))))))
    //     //     ) %
    //     //         self.uintVars[difficulty] == 0
    //     //         || (now - (now % 1 minutes)) - self.uintVars[timeOfLastNewValue] >= 15 minutes,
    //     //     "Incorrect nonce for current challenge"
    //     // );

    //     //Checking and updating Miner Status
    //     require(self.minersByChallenge[_currChallenge][msg.sender] == false, "Miner already submitted the value");
    //     //Update the miner status to true once they submit a value so they don't submit more than once
    //     self.minersByChallenge[_currChallenge][msg.sender] = true;

    //     //Updating Request
    //     BerryStorage.Request storage _tblock = self.requestDetails[self.uintVars[_tBlock]];
    //     _tblock.minersByValue[1][_slotProgress]= msg.sender; 
    //     //this will fill the currentMiners array
    //     _tblock.valuesByTimestamp[0][_slotProgress] = _value[0];
    //     _tblock.valuesByTimestamp[1][_slotProgress] = _value[1];
    //     _tblock.valuesByTimestamp[2][_slotProgress] = _value[2];
    //     _tblock.valuesByTimestamp[3][_slotProgress] = _value[3];
    //     _tblock.valuesByTimestamp[4][_slotProgress] = _value[4];
    //     //Save the miner and value received
    //     _tblock.minersByValue[0][self.uintVars[slotProgress]]= msg.sender;
    //     _tblock.minersByValue[1][self.uintVars[slotProgress]]= msg.sender;
    //     _tblock.minersByValue[2][self.uintVars[slotProgress]]= msg.sender;
    //     _tblock.minersByValue[3][self.uintVars[slotProgress]]= msg.sender;
    //     _tblock.minersByValue[4][self.uintVars[slotProgress]]= msg.sender;
      

    //     //Internal Function Added to allow for more stack variables
    //     _payReward(self, _slotProgress);
    //     self.uintVars[slotProgress]++;

    //     //If 5 values have been received, adjust the difficulty otherwise sort the values until 5 are received 
    //     if (_slotProgress + 1 == 5) { //slotProgress has been incremented, but we're using the variable on stack to save gas
    //         newBlock(self, _nonce, _requestId);
    //         self.uintVars[slotProgress] = 0;
    //     }

    //     emit NonceSubmitted(msg.sender, _nonce, _requestId, _value, _currChallenge);
       
    // }
}
