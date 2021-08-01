/**
 * Created by A on 7/18/17.
 */
"use strict";

let systemStatus = {
  all: true,
  liveGame: true,
  deposit: true,
  transfer: true,
  withdraw: true,
  signup: true
}

//Maintain button for		ALL WEB
async function maintainAll(enable){
  console.log(systemStatus);
  if(enable === true){
    systemStatus.all = true
  }else{
    systemStatus.all = false
  }
}

//Maintain button for		Live Game
async function maintainLiveGame(enable){
  if(enable === true){
    systemStatus.liveGame = true
  }else{
    systemStatus.liveGame = false
  }
  console.log(systemStatus);
}

//Maintain button for		Deposit
async function maintainDeposit(enable){
  if(enable === true){
    systemStatus.deposit = true
  }else{
    systemStatus.deposit = false
  }
  console.log(systemStatus);
}

//Maintain button for		Transfer Deposit / Withdraw
async function maintainTransfer(enable){
  if(enable === true){
    systemStatus.transfer = true
  }else{
    systemStatus.transfer = false
  }
  console.log(systemStatus);
}

//Maintain button for		Withdraw
async function maintainWithdraw(enable){
  if(enable === true){
    systemStatus.withdraw = true
  }else{
    systemStatus.withdraw = false
  }
  console.log(systemStatus);
}

//Maintain button for		Signup New USER
async function maintainSignup(enable){
  if(enable === true){
    systemStatus.signup = true
  }else{
    systemStatus.signup = false
  }
  console.log(systemStatus);
}

module.exports = {
  maintainAll,
  maintainDeposit,
  maintainLiveGame,
  maintainTransfer,
  maintainWithdraw,
  maintainSignup,
  systemStatus: systemStatus
};
