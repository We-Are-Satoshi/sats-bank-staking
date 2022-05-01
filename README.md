# Satoshi Bank Staking

This contract provides staking rewards for staking SATS token. The reward token can be any token.

## How to deploy

Deploy Stake.sol with the following parameters:  
- Owner address
- Staking token address
- Reward token address
- Staking duration (in days)

## How to fund

By default, the staking contract is enabled on deploy. However, the contract needs to be funded to pay out rewards.

First, approve the contract to spend the reward token.  
Next, call fundContract function and pass the amount of rewards. The contract will pull funds from the caller address and set up rewards. The fundContract function can be called at any time. It will reset the rewardsDuration each time.