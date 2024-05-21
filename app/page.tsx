import React from "react";
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative px-4 sm:px-6 lg:px-8">
      <div>
        <div className="flex flex-col items-center sm:flex-row sm:items-center">
          <p className="font-light text-left text-[40px] sm:text-[60px] md:text-[80px] lg:text-[100px]">Welcome to</p>
          <img className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20" src="/coin.png" alt="coin" />
        </div>
        <div className="mt-4 sm:mt-0 sm:-mt-8 md:-mt-10 lg:-mt-14">
          <p className="font-bold text-left text-[40px] sm:text-[60px] md:text-[80px] lg:text-[100px]">Neobase Coding</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 items-center sm:items-center mt-4 sm:mt-0 sm:-mt-8 md:-mt-10 lg:-mt-14">
          <p className="font-bold text-left text-[40px] sm:text-[60px] md:text-[80px] lg:text-[100px]">Round</p>
          <Link href="/transfer">
            <button className="px-4 py-2 sm:px-5 sm:py-2 h-10 mt-4 sm:mt-16 font-bold text-white bg-gradient-to-r from-[#0029FF] to-black rounded-full flex gap-3 items-center hover:transition duration-200 hover:duration-200 ease-in-out hover:bg-gradient-to-r hover:from-black hover:to-[#0029FF]">
              <img src="/wallet.svg" alt="wallet" className="h-6 w-6" />
              Get Started
            </button>
          </Link>
        </div>
        <img className="hidden sm:block absolute h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 top-[45%] left-1/2 transform -translate-x-1/2 -translate-y-1/2" src="/dollar_coin.png" alt="dollar_coin" />
        <img className="hidden sm:block absolute top-[60%] left-[25%] h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 lg:h-32 lg:w-32" src="/trust.png" alt="trust" />
        <img className="block sm:hidden absolute top-4 left-4 h-12 w-12" src="/dollar_coin.png" alt="dollar_coin" />
        <img className="block sm:hidden absolute bottom-4 right-4 h-12 w-12" src="/trust.png" alt="trust" />
      </div>
    </div>
  );
}
