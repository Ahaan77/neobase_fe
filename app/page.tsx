import Image from "next/image";
import React, { useState } from "react";
import Web3 from 'web3';
import CLIENT from "../config"
import Link from 'next/link'


declare global {
  interface Window {
    ethereum: any;
  }
}

export default function Home() {

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative">
      <div className="">
        <div className="flex items-center">
          <p className="font-light text-left text-[100px]">Welcome to</p>
          <img className="h-20 w-20" src="/coin.png" alt="coin" />
        </div>
        <div className="-mt-14">
          <p className="font-bold text-left text-[100px]">Neobase Coding</p>
        </div>
        <div className="flex gap-20 items center -mt-14">
          <p className="font-bold text-left text-[100px]">Round</p>
          <Link href="/transfer"><button
            className="px-5 py-2 h-10 mt-16 font-bold text-white bg-gradient-to-r from-[#0029FF] to-black rounded-full flex gap-3 items-center hover:transition duration-200 hover:duration-200 ease-in-out hover:bg-gradient-to-r hover:from-black hover:to-[#0029FF]"
          >
            <img src="/wallet.svg" alt="wallet" />
            Get Started
          </button>
          </Link>
        </div>
        <img className="absolute h-16 w-16 top-[45%] left-1/2 transform -translate-x-1/2 -translate-y-1/2" src="/dollar_coin.png" alt="dollar_coin" />
        <img className="absolute top-[60%] left-[25%] h-32 w-32" src="/trust.png" alt="trust" />
      </div>
    </div>


  );
}
