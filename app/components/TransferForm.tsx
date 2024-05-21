"use client"
import React, { useState } from "react";
import Web3 from "web3";
import CONFIG from "../../config";

declare global {
  interface Window {
    ethereum: any;
  }
}

interface TransferFormProps {
  addTransaction: (id: string, amount: string) => void;
}

const TransferForm: React.FC<TransferFormProps> = ({ addTransaction }) => {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [network, setNetwork] = useState<'polygon' | 'arbitrum'>('polygon');
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

  const handleTransfer = async () => {
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
      const networkConfig = CONFIG[network];

      const currentChainId = await web3.eth.getChainId();
      if (currentChainId !== networkConfig.chainId) {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: Web3.utils.toHex(networkConfig.chainId) }],
          });
        } catch (switchError: any) {
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [
                  {
                    chainId: Web3.utils.toHex(networkConfig.chainId),
                    rpcUrls: [networkConfig.rpcUrl],
                    chainName: network === "polygon" ? "Polygon Mainnet" : "Arbitrum Mainnet",
                    nativeCurrency: {
                      name: network === "polygon" ? "MATIC" : "ETH",
                      symbol: network === "polygon" ? "MATIC" : "ETH",
                      decimals: 18,
                    },
                    blockExplorerUrls: [network === "polygon" ? "https://polygonscan.com/" : "https://arbiscan.io/"],
                  },
                ],
              });
            } catch (addError) {
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
              {
                name: "to",
                type: "address",
              },
              {
                name: "value",
                type: "uint256",
              },
            ],
            name: "transfer",
            outputs: [
              {
                name: "",
                type: "bool",
              },
            ],
            payable: false,
            stateMutability: "nonpayable",
            type: "function",
          },
        ],
        networkConfig.oftContract
      );

      const accounts = await web3.eth.getAccounts();
      const amountInWei = web3.utils.toWei(amount, "ether");

      const tx = await contract.methods.transfer(recipient, amountInWei).send({ from: accounts[0] });

      addTransaction(tx.transactionHash, amount);
      setSuccess("Transfer successful!");
    } catch (err: any) {
      setError("Transfer failed: " + (err.message || err));
    }

    setLoading(false);
  };

  return (
    <div className="rounded-[40px] bg-black w-[70vh] shadow-2xl" style={{ boxShadow: "0px 40px 60px rgba(0, 41, 255, 0.3)" }}>
      <p className="text-white font-bold mt-10 ml-10">Transfer</p>

      <div className="mx-10 mt-5">
        <div className="relative p-1 rounded-md" style={gradientBorderStyle}>
          <div className="w-full bg-gray-800 rounded-md ">
            <p className="text-[#535353] text-sm p-3">Total Amount to transfer</p>
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

      <div className="mx-10 mt-5">
        <div className="relative p-1 rounded-md" style={gradientBorderStyle}>
          <div className="w-full bg-gray-800 rounded-md ">
            <p className="text-[#535353] text-sm p-3">User Address</p>
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
          onClick={handleTransfer}
          className="w-full px-4 py-2 font-bold text-white bg-gradient-to-r from-[#0029FF] to-black rounded-full flex items-center justify-center gap-3 transition duration-300 ease-in-out hover:bg-gradient-to-r hover:from-black hover:to-[#0029FF]"
          disabled={loading}
        >
          {loading ? (
            <span>Loading...</span>
          ) : (
            <>
              <img src="/wallet.svg" alt="wallet" className="h-6 w-6" />
              Transfer
            </>
          )}
        </button>
      </div>
      <div className="flex justify-center">
        {error && <p className="text-red-500 mx-10 mb-4 lg:text-sm text-xs">{error}</p>}
        {success && <p className="text-green-500 mt-4 mb-4">{success}</p>}
      </div>
    </div>
  );
};

export default TransferForm;
