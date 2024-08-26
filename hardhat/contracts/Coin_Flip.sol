// SPDX-License-Identifier: IIT-K
pragma solidity 0.8.26;

contract Coin_Flip{

    address payable public owner;
    address payable public player;

    uint amount_bet;

    constructor(address payable _owner,address payable _player) {
            owner = _owner;
            player = _player;
        }
    
     function setPlayer(address payable _player) public {
        require(player == address(0), "Player has already been set.");
        player = _player;
    }
    
    /* Generates a random number from 0 to 99 based on the last block hash */
    function randomGen(uint seed) public view returns (uint) {
        uint256 randnum =  uint(keccak256(abi.encodePacked(blockhash(block.number - 1), seed))) % 100;
        if(randnum < 49){
            return 0;
        }
        else{
            return 1;
        }
    }

    function place_bet(uint _amount) public{
        require(_amount > 1 ether, "Bet must be greater than $1"); //require that amount is greater than $1.
        require(_amount < msg.sender.balance, "You must be able to pay the bet");
        amount_bet =_amount;
    }

    function coinFlip(uint coin_flip_guess) public payable{
        uint random_number = randomGen(1);

        if(coin_flip_guess == random_number){
            //He wins show that message in front end.
            owner.transfer(amount_bet); //transfers the amount to the owner.
        }
        else{
            //He lost show that message in front end.
            if(amount_bet < owner.balance){
                player.transfer(amount_bet);
            }
            else{
                // Say that we don't have that much money. We will be sending all we have
                owner.transfer(owner.balance);
            }
        }

    }
}