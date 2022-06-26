import { useMoralis } from "react-moralis";
import { useEffect } from "react";

export  function ManualHeader(){
    const {enableWeb3, isWeb3Enabled, account, Moralis, deactivateWeb3, isWeb3EnableLoading} = useMoralis();

    useEffect(()=>{
        if (isWeb3Enabled){
            return};

            if (typeof window !=="undefined"){
                if (window.localStorage.getItem("connected")){
                    enableWeb3();
                }
            };
        console.log("Web3 is %s",isWeb3Enabled);
    },[isWeb3Enabled])

    useEffect(()=>{Moralis.onAccountChanged((account)=>{
        if (account == null){
            window.localStorage.removeItem("connected");   
            deactivateWeb3();   
        }
    }
    )},[isWeb3Enabled])

    return (
        account ? (<p>Connected to {account.slice(0,6)}...{account.slice(account.length - 4)}</p>):(<button onClick={async()=>{
            await enableWeb3();
            if (typeof window !=="undefined"){
            window.localStorage.setItem("connected","injected")
        }
        
        }} 
        disabled={isWeb3EnableLoading}>Connect</button>)
    
    )
}