"use client"

import React, { useState } from "react";
import TransferForm from "../components/TransferForm";
import TransactionTable from "../components/TransactionTable";

interface Transaction {
    id: string;
    amount: string;
    time: string;
}

const Home: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    const addTransaction = (id: string, amount: string) => {
        const newTransaction: Transaction = {
            id,
            amount,
            time: new Date().toLocaleString(),
        };
        setTransactions((prev) => [newTransaction, ...prev]);
    };

    return (
        <div className="relative">
            
            <div className="mt-16 flex justify-center">
                <TransferForm addTransaction={addTransaction} />
            </div>

            <div className="mt-20 flex items-center justify-center mb-20">
                <TransactionTable transactions={transactions} />
            </div>
        </div>
    );
};

export default Home;
