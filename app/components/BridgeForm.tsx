"use client"
import Image from "next/image";
import React, { useState, useEffect } from "react";
import Web3 from "web3";
import CONFIG from "../../config";

declare global {
    interface Window {
        ethereum: any;
    }
}

interface BridgeFormProps {
    addTransaction: (id: string, amount: string) => void;
}

const BridgeForm: React.FC<BridgeFormProps> = ({ addTransaction }) => {
    const [recipient, setRecipient] = useState("");
    const [amount, setAmount] = useState("");
    const [polygonBalance, setPolygonBalance] = useState("0");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const gradientBorderStyle = {
        background: "linear-gradient(90deg, #0029FF, #FF00E1)",
        borderRadius: "8px",
        padding: "2px",
        display: "inline-block",
        width: "100%",
    };

    useEffect(() => {
        const fetchPolygonBalance = async () => {
            if (!window.ethereum) {
                setError("MetaMask is not installed");
                return;
            }

            try {
                const web3 = new Web3(window.ethereum);
                const accounts = await web3.eth.getAccounts();
                if (accounts.length > 0) {
                    const balance = await web3.eth.getBalance(accounts[0]);
                    setPolygonBalance(web3.utils.fromWei(balance, "ether"));
                }
            } catch (err) {
                //@ts-ignore
                setError("Failed to fetch Polygon balance: " + (err?.message || err));
            }
        };

        fetchPolygonBalance();
    }, []);

    const handleBridge = async () => {
        if (!window.ethereum) {
            setError("MetaMask is not installed");
            return;
        }

        if (!Web3.utils.isAddress(recipient)) {
            setError("Invalid recipient address");
            return;
        }

        if (amount === "" || parseFloat(amount) <= 0) {
            setError("Transfer amount must be greater than zero");
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            await window.ethereum.request({ method: "eth_requestAccounts" });

            const web3 = new Web3(window.ethereum);
            const polygonConfig = CONFIG.polygon;
            const arbitrumConfig = CONFIG.arbitrum;

            const currentChainId = await web3.eth.getChainId();
            if (currentChainId !== BigInt(polygonConfig.chainId)) {
                try {
                    await window.ethereum.request({
                        method: "wallet_switchEthereumChain",
                        params: [{ chainId: Web3.utils.toHex(polygonConfig.chainId) }],
                    });
                } catch (switchError: any) {
                    if (switchError.code === 4902) {
                        try {
                            await window.ethereum.request({
                                method: "wallet_addEthereumChain",
                                params: [
                                    {
                                        chainId: Web3.utils.toHex(polygonConfig.chainId),
                                        rpcUrls: [polygonConfig.rpcUrl],
                                        chainName: "Polygon Mainnet",
                                        nativeCurrency: {
                                            name: "MATIC",
                                            symbol: "MATIC",
                                            decimals: 18,
                                        },
                                        blockExplorerUrls: ["https://polygonscan.com/"],
                                    },
                                ],
                            });
                        } catch (addError) {
                            //@ts-ignore
                            setError("Failed to add the network to MetaMask: " + (addError.message || addError));
                            setLoading(false);
                            return;
                        }
                    } else {
                        setError("Failed to switch the network: " + (switchError.message || switchError));
                        setLoading(false);
                        return;
                    }
                }
            }

            const contract = new web3.eth.Contract(
                [
                    {
                        constant: false,
                        inputs: [
                            { name: "from", type: "address" },
                            { name: "dstChainId", type: "uint16" },
                            { name: "to", type: "bytes" },
                            { name: "amount", type: "uint256" },
                            { name: "refundAddress", type: "address" },
                            { name: "zroPaymentAddress", type: "address" },
                            { name: "adapterParams", type: "bytes" },
                        ],
                        name: "sendFrom",
                        outputs: [],
                        payable: true,
                        stateMutability: "payable",
                        type: "function",
                    },
                ],
                polygonConfig.oftContract
            );

            const accounts = await web3.eth.getAccounts();
            const amountInWei = web3.utils.toWei(amount, "ether");
            //@ts-ignore
            const dstChainId = arbitrumConfig.layerZeroChainId;
            const toAddress = Web3.utils.toChecksumAddress(recipient);
            const toAddressBytes = web3.utils.padLeft(toAddress, 64);

            const tx = await contract.methods
                .sendFrom(
                    accounts[0],
                    dstChainId,
                    toAddressBytes,
                    amountInWei,
                    accounts[0],
                    '0x0000000000000000000000000000000000000000',
                    '0x'
                )
                .send({ from: accounts[0], value: web3.utils.toWei('0.01', 'ether') });

            addTransaction(tx.transactionHash, amount);
            setSuccess("Bridge successful!");
        } catch (err: any) {
            setError("Bridge failed: " + (err.message || err));
        }

        setLoading(false);
    };

    return (
        <div className="rounded-[40px] bg-black w-[70vh] shadow-2xl" style={{ boxShadow: "0px 40px 60px rgba(0, 41, 255, 0.3)" }}>
            <p className="text-white font-bold mt-10 ml-10">Bridge</p>

            <div className="mx-10 mt-5">
                <div className="relative p-1 rounded-md" style={gradientBorderStyle}>
                    <div className="w-full bg-gray-800 rounded-md ">
                        <div className="flex items-center gap-0">
                            <p className="text-[#535353] text-sm p-3">From</p>
                            <div className="px-3 py-1 bg-black rounded-full">
                                <p className="text-white text-xs">Polygon</p>
                            </div>
                        </div>
                        <input
                            type="text"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="text-white font-bold bg-transparent ml-5 focus:outline-none text-2xl mb-3"
                            placeholder="0"
                        />
                    </div>
                </div>
            </div>
            <div className="my-2 mx-10 mt-5 mb-5">
                <p className="text-white font-bold text-sm">Balance: {polygonBalance} MATIC</p>
            </div>
            <div className="w-full flex justify-center mt-4">
                <Image src="/arrow_down.svg" height={20} width={20} alt="arrow_down" />
            </div>

            <div className="mx-10 mt-5">
                <div className="relative p-1 rounded-md" style={gradientBorderStyle}>
                    <div className="w-full bg-gray-800 rounded-md ">
                        <div className="flex items-center gap-0">
                            <p className="text-[#535353] text-sm p-3">To</p>
                            <div className="px-3 py-1 bg-black rounded-full">
                                <p className="text-white text-xs">Arbitrum</p>
                            </div>
                        </div>
                        <input
                            type="text"
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            className="text-white font-bold bg-transparent ml-5 focus:outline-none text-2xl mb-3 w-[90%]"
                            placeholder="0"
                        />
                    </div>
                </div>
            </div>

            <div className="mt-8 mx-10 mb-10 w-auto">
                <button
                    onClick={handleBridge}
                    className="w-full px-4 py-2 font-bold text-white bg-gradient-to-r from-[#0029FF] to-black rounded-full flex items-center justify-center gap-3 transition duration-300 ease-in-out hover:bg-gradient-to-r hover:from-black hover:to-[#0029FF]"
                    disabled={loading}
                >
                    {loading ? (
                        <span>Loading...</span>
                    ) : (
                        <>
                            <img src="/wallet.svg" alt="wallet" className="h-6 w-6" />
                            Bridge
                        </>
                    )}
                </button>
            </div>
            <div className="flex justify-center">
                {error && <p className="text-red-500 mb-4">{error}</p>}
                {success && <p className="text-green-500 mt-4 mb-4">{success}</p>}
            </div>
        </div>
    );
};

export default BridgeForm
