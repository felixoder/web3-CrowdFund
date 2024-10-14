import React, { useState } from 'react';
import { ethers } from 'ethers';
import { contractAddress, contractABI } from "@/app/lib/contractInfo";

const FundForm: React.FC<{ loadFunders: () => void }> = ({ loadFunders }) => {
  const [ethAmount, setEthAmount] = useState('');

  const handleFund = async () => {
    if (!ethAmount) {
      alert("Please enter an amount to fund.");
      return;
    }
  
    // Connect to Ethereum
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.BrowserProvider(window.ethereum); // For v6
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
  
      console.log('Funding amount:', ethAmount); // Debugging line
  
      try {
        const transaction = await contract.fund({
          value: ethers.parseEther(ethAmount), // Updated for v6
          gasLimit: 300000 // Optional: Set a gas limit
        });
        await transaction.wait(); // This will revert if the contract's conditions aren't met
  
        // Save funder details to MongoDB
        const signerAddress = await signer.getAddress();
        await fetch("/api/funders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            address: signerAddress,
            amount: ethAmount,
          }),
        });
  
        alert("Funded successfully!");
        setEthAmount('')
        loadFunders();
      } catch (error) {
        console.error('Funding Error:', error); // Log detailed error information
        if (error instanceof Error) {
          // If the transaction failed, this will give the revert reason
          alert("Funding failed: " + error.message);
        } else {
          alert("Funding failed: Unknown error occurred.");
        }
      }
    } else {
      alert("Please install MetaMask!");
    }
  };
  

  return (
    <div>
      <h2 className='font-bold'>Fund the Contract</h2>
      <input
        type="text"
        value={ethAmount}
        onChange={(e) => setEthAmount(e.target.value)}
        placeholder="Amount in ETH"
      />
      <button onClick={handleFund}>Fund</button>
    </div>
  );
};

export default FundForm;
