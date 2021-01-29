# Berry Oracle

Berry Oracle is based on Tellor Oracle version 2.0.0, improves token economics, and deployed on Binance Smart Chain. It provides one price feed solution on Binance Smart Chain for Peer to Peer Mode. User can request price feed by add tip, and Berry miner will provide data to Berry decentrialized oracle. Tellor works as bitcoin's POW, but its token does not work as Bitcoin, it is unlimited. Berry follows Bitcoin period halfing token supply rule.


### Instructions for quick start with Truffle Deployment <a name="Quick-Deployment"> </a> 
Follow the steps below to launch the Oracle contracts using Truffle. 

1. Open two terminals.

2. On one terminal run:
    Clone the repo, cd into it, and then run:
```
    $ npm install
    $ truffle compile
    $ truffle migrate
```
#### Testing through Truffle<a name="testing"> </a>


3. On the second termial run:
```solidity
  $ ganache-cli -m "nick lucian brenda kevin sam fiscal patch fly damp ocean produce wish"
```
4. On the first terminal run: 
```solidity
  $ truffle test
```
5. And wait for the message 'START MINING RIG!!'
6. Kick off the python miner file [./miner/testMinerB.py](./miner/testMinerB.py).


Production and test python miners are available under the miner subdirectory [here](./miner/). You will need to get at least 5 miners running.

Step by step instructions on setting up a Berry Oracle without truffle are available here: [Detailed documentation for self setup](./SetupDocumentation.md)


## Overview <a name="overview"> </a>  
Ethereum smart contracts cannot access off-chain data. If your smart contract relies on off-chain (e.g. internet) data to evaluate or execute a function, you either have to manually feed the data to your contract, incentivize users to do it, or rely on a centralized party to provide the data.

<b>The Berry oracle</b> is a decentralized oracle. It provides an option for contracts to securely interact with and obtain data from off-chain.

Berry implements a staked PoW where miners have to deposit Berry Tributes (berry's native token) to be able to mine and along with the PoW solution they also provide an off-chain data point. The first five miners to provide the PoW and off-chain data point are rewarded and the median is selected as the official value. Once validated and processed the value is available for on-chain contracts to use. The value can be disputed by anyone holding berry tributes within one day after being mined for a fee. After the value goes to dispute, anyone holding tributes can vote on it's validity. If the vote determines the value was invalid the reporting party gets awarded the miner's stake, otherwise the wrongly accused miner gets the dispute fee. 

<p align="center">
<img src="./public/ProcessFlow.png" width="400" height="200" alt = "How it works">
</p>

A deep dive in methodology is available here: [In-Depth Overview](./InDepthOverview.md)


### Useful links <a name="useful-links"> </a>
High level inspiration from [EIP918 Mineable Token](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-918.md).

Why we need a decentralized option? Checkout: ["Trusted third parties are security holes" ~ Nick Szabo, 2001](https://nakamotoinstitute.org/trusted-third-parties/)

Metamask - www.metamask.io 

Truffle - http://truffleframework.com/


#### How to Contribute<a name="how2contribute"> </a>  

Check out or issues log here on Github or contribute to our future plans to build a better miner and more examples of data secured by Berry. 


#### Contributors<a name="contributors"> </a>

This repository is maintained by the Berry team - [www.berrydata.co](https://berrydata.co)

