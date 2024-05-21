import React from "react";

interface Transaction {
  id: string;
  amount: string;
  time: string;
}

interface TransactionTableProps {
  transactions: Transaction[];
}

const TransactionTable: React.FC<TransactionTableProps> = ({ transactions }) => {
  return (
    <div className="w-full max-w-4xl bg-black bg-opacity-80 rounded-lg p-6">
      <h2 className="text-xl text-white mb-4 font-bold">Transaction</h2>
      <table className="w-full text-left text-white">
        <thead>
          <tr>
            <th className="px-4 py-2 text-[#0029FF]">TRANSACTION ID</th>
            <th className="px-4 py-2 text-[#0029FF]">TRANSFER AMOUNT</th>
            <th className="px-4 py-2 text-[#0029FF]">TIME</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <React.Fragment key={transaction.id}>
              <tr className="bg-black bg-opacity-50 rounded-md">
                <td className="px-4 py-2">{transaction.id}</td>
                <td className="px-4 py-2">{transaction.amount}</td>
                <td className="px-4 py-2">{transaction.time}</td>
              </tr>
              {index < transactions.length - 1 && <tr className="h-2"></tr>} 
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
