// import {ConnectButton} from "web3uikit"
import { ConnectButton } from '@web3uikit/web3';
import { useWeb3Contract } from 'react-moralis';
import {abi, contractAddresses} from "../constants";
import  { useMoralis } from "react-moralis";
import  { useEffect, useState } from "react";
import {ethers} from  "ethers";
import { useNotification } from '@web3uikit/core';
 
export default function LotteryEntrance() {
    const {chainId: chainIdHex, enableWeb3, account, isWeb3Enabled, Moralis, deactivateWeb3, isWeb3EnableLoading} = useMoralis()
    console.log(parseInt(chainIdHex))
    const chainId = parseInt(chainIdHex)
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null
    const [entranceFee, setEntranceFee] = useState("0")
    const [numberOfPlayers, setNumberOfPlayers] = useState("0")
    const [recentWinner, setRecentWinner] = useState("0")
    const dispatch = useNotification()
    
     
    const {runContractFunction: enterRaffle, isLoading, isFetching} = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        params: {},
        msgValue: entranceFee
    })

    const {runContractFunction: getEntranceFee} = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getEntranceFee",
        params: {},
    })

    

    const {runContractFunction: getNumberOfPlayers} = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getNumberOfPlayers",
        params: {},
    })

    const {runContractFunction: getRecentWinner} = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getRecentWinner",
        params: {},
    })

    useEffect(() => {
        if (isWeb3Enabled) {
            async function updateUI() {
                const entranceFeeFromCall = (await getEntranceFee()).toString()
                const numPlayersFromCall = (await getNumberOfPlayers()).toString()
                const recentWinnerFromCall = await getRecentWinner()
                setEntranceFee(entranceFeeFromCall)
                setNumberOfPlayers(numPlayersFromCall)
                setRecentWinner(recentWinnerFromCall)
            }
            updateUI()
        }
    }, [isWeb3Enabled])

    const handleSuccess = async function (tx) {
        await tx.wait(1)
        handleNewNotification(tx)
    }

    const handleNewNotification = function () {
        dispatch({
            type: "info",
            message: "Transaction complete",
            title: "Tx Notification",
            position: "topR",
            icon: "bell",
        })
    }

    return (
        <div className="p-5">
            Hi from Lottery 
            { 
                raffleAddress 
                ? 
                <div>
                    <button 
                    className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto'
                    disabled={isLoading || isFetching}
                    onClick={async function(){
                        await enterRaffle({
                            onSuccess: handleSuccess,
                            onError: (error) => console.log(error)
                        })
                    }}> Enter Raffle </button>
                        <br />
                    Entrance fee: {ethers.utils.formatUnits(entranceFee)} ETH
                        <br />
                    Number of Players: {numberOfPlayers}
                        <br />
                    Recent Winner: {recentWinner}
                </div>
                :
                <div>No Raffle Address detected</div>
            }
        </div>
    )
}
