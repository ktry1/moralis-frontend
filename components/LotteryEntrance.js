import { useWeb3Contract } from "react-moralis";
import {abi,contractAddresses} from "../constants/constants";
import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import {ethers} from "ethers";
import { useNotification } from "web3uikit";
import { allowedStatusCodes } from "next/dist/lib/load-custom-routes";
import { resolveHref } from "next/dist/shared/lib/router/router";


export function LotteryEntrance(){
const {chainId: chainIdHex, isWeb3Enabled} = useMoralis();
const chainId = parseInt(chainIdHex);
const raffleAddress = chainId in contractAddresses ? (contractAddresses[chainId][0]) : (null);
const [entranceFee,setEntranceFee] = useState("0");
const [recentWinner, setRecentWinner] = useState("0");
const [numOfPlayers, setNumOfPlayers] = useState("0");
const dispatch = useNotification();








 const {runContractFunction: enterRaffle} = useWeb3Contract({
     abi:abi,
     contractAddress:raffleAddress,
     functionName: "enterRaffle",
     params: [],
     msgValue: entranceFee
   });
     

const {runContractFunction: getEnteringFee} = useWeb3Contract({
    abi:abi,
    contractAddress:raffleAddress,
    functionName: "getEnteringFee",
    params: []
  });

  const {runContractFunction: getNumOfPlayers} = useWeb3Contract({
    abi:abi,
    contractAddress:raffleAddress,
    functionName: "getNumberOfPlayers",
    params: []
  });

  const {runContractFunction: getRecentWinner} = useWeb3Contract({
    abi:abi,
    contractAddress:raffleAddress,
    functionName: "getRecentWinner",
    params: []
  });

  async function updateUI(){
    const numOfPlayers_ = (await getNumOfPlayers()).toString();
    const entranceFee_ = (await getEnteringFee()).toString();
    const recentWinner_ = (await getRecentWinner()).toString();
    setNumOfPlayers(numOfPlayers_);
    setEntranceFee(entranceFee_);
    setRecentWinner(recentWinner_);
    
    }


    async function startListening(){
        const provider = new ethers.providers.Web3Provider(web3.currentProvider);
        console.log("Started listening...");
        const contract = new ethers.Contract(contractAddresses[chainId],abi,provider);
        contract.on( "WinnerPicked" ,async () => {
        await updateUI();
        console.log("Found event!")
        resolve()
        });
        
    }

  useEffect(()=>{
    if(isWeb3Enabled){
        updateUI();
        startListening();
        
    }
},[isWeb3Enabled])

const handleSuccess = async (tx) => {
    await tx.wait(1);
    handleNewNotification(tx);
    updateUI();
}

const handleNewNotification = function(){
    dispatch({
        type: "info",
        message: "transaction compelete!",
        title: "Tx Notification",
        position: "topR",
        icon: "bell"
})
}

const handleFailure = async (error) => {
    handleNewError(error);
}

const handleNewError = function(){
    dispatch({
        type: "error",
        message: "Transaction Failed",
        title: "Error",
        position: "topR",
        icon: "bell"
})
}

 return (
     <div>
         Hi from entrance fee! 
         {raffleAddress ? 
         (<div>
            <button onClick={async ()=> {await enterRaffle(
                {onSuccess: handleSuccess,
                onError: (error) => {console.log(error),
                handleFailure}
                })}}>Enter Raffle</button>
                <hr/>
            Entrance fee is {ethers.utils.formatUnits(entranceFee, "ether")} ETH
            <br/>
            Recent Winner is {recentWinner}
            <br/>
            Number of players is {numOfPlayers}
            </div>)
         :(<div>No Raffle Address detected on this network</div>)}
         
     </div>
 )
}