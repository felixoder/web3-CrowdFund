"use client";

import React, { useEffect, useState } from 'react';
import FundForm from '@/app/components/FundForm';
import { ethers } from 'ethers';
import { contractAddress, contractABI } from "@/app/lib/contractInfo"; // Update with your actual import

const Home: React.FC = () => {
  const [funders, setFunders] = useState<any[]>([]);

  const loadFunders = async () => {
    try {
      const response = await fetch("/api/funders");
      if (!response.ok) {
        throw new Error('Failed to fetch funders');
      }
      const data = await response.json();
      setFunders(data);
    } catch (error) {
      console.error('Error loading funders:', error);
    }
  };

  const handleWithdraw = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.BrowserProvider(window.ethereum); // For ethers v6
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      try {
        const transaction = await contract.withdraw();
        await transaction.wait();
        alert("Funds withdrawn successfully!");
        loadFunders(); // Reload funders if needed
      } catch (error) {
        console.error('Withdrawal Error:', error);
        alert("Withdrawal failed: " );
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  useEffect(() => {
    loadFunders();
  }, []);

  return (
    <div className="p-6 bg-gray-100 rounded-lg">
      <h1 className="text-3xl font-bold mb-4 text-center">Buy me a Beer 🍺</h1>
      <FundForm loadFunders={loadFunders} />
      <h2 className="text-2xl font-semibold mt-6">Funders</h2>
      <table className="min-w-full border-collapse border border-gray-200 mt-2">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">Address</th>
            <th className="border border-gray-300 p-2">Amount (ETH)</th>
          </tr>
        </thead>
        <tbody>
          {funders.map((funder, index) => (
            <tr key={index}>
              <td className="border border-gray-300 p-2">{funder.address}</td>
              <td className="border border-gray-300 p-2">{funder.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={handleWithdraw}
      >
        Withdraw Funds
      </button>
    </div>
  );
};

export default Home;
