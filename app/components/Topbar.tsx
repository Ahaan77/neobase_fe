"use client"
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { usePathname } from 'next/navigation';

declare global {
    interface Window {
        ethereum: any;
    }
}

const Topbar: React.FC = () => {
    const [walletAddress, setWalletAddress] = useState("");
    const [error, setError] = useState("");
    const pathname = usePathname();

    const connectWallet = async () => {
        console.log("yes")
        if (!window.ethereum) {
            setError("MetaMask is not installed");
            return;
        }

        try {
            await window.ethereum.request({ method: "eth_requestAccounts" });
            const web3 = new Web3(window.ethereum);
            const accounts = await web3.eth.getAccounts();
            if (accounts.length > 0) {
                setWalletAddress(accounts[0]);
            }
        } catch (err: any) {
            setError("Failed to connect wallet: " + (err.message || err));
        }
    };

    useEffect(() => {
        const checkConnection = async () => {
            if (window.ethereum) {
                const web3 = new Web3(window.ethereum);
                const accounts = await web3.eth.getAccounts();
                if (accounts.length > 0) {
                    setWalletAddress(accounts[0]);
                }
            }
        };
        checkConnection();
    }, []);

    if (pathname !== "/transfer" && pathname !== "/bridge") {
        return null;
    }

    return (
        <div className="w-full fixed top-5 h-20 ">
            <div className="w-full px-10 h-full flex items-center justify-between">
                <span className="-ml-28">
                    <Image src="/neobase_logo.svg" width={300} height={300} alt="neobase_logo" />
                </span>
                <button
                    onClick={connectWallet}
                    className="px-4 py-2 font-bold text-white bg-gradient-to-r from-[#0029FF] to-black rounded-full flex gap-3 items-center transition duration-300 ease-in-out hover:bg-gradient-to-r hover:from-black hover:to-[#0029FF]"
                >
                    {walletAddress ? (
                        <>
                            <span className="h-3 w-3 bg-[#FF00E1] rounded-full"></span>
                            <span>{`${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`}</span>
                        </>
                    ) : (
                        <>
                            <img src="/wallet.svg" alt="wallet" />
                            Connect Wallet
                        </>
                    )}
                </button>
            </div>
            {error && <div className="w-full flex justify-center"><p className="text-red-500">{error}</p></div>}
        </div>
    );
};

export default Topbar;
