import { ConnectButton } from "web3uikit";

export  function Header(){
    return (
        <div>
        <h1>Decentralized lottery</h1>
        <hr/>
        <ConnectButton moralisAuth={false}/>
        </div>
    )
}