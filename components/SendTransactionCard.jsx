import { useWallets } from "@privy-io/react-auth";
import { getAddress, isAddress, parseUnits } from "ethers"; // No need for getAddress()
import { Zap } from "lucide-react";
import { useState } from "react";
import { encodeFunctionData } from "viem";
import { RUSDCABI } from "../contracts/abis/RUSDC";

export default function SendTransactionCard() {
  const CONTRACT_ADDRESS = "0xEbB3b2176FD8DA36047D077aeEE200eb9E3F229F".trim().toLowerCase();
  const { wallets } = useWallets();
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("1");
  const [txHash, setTxHash] = useState(null);

  const handleSendTransaction = async () => {
    try {
      if (!wallets || wallets.length === 0) {
        throw new Error("No wallets available");
      }

      const wallet = wallets[0];
      const provider = await wallet?.getEthereumProvider();
      if (!provider) {
        throw new Error("No provider available");
      }

      console.log("Contract Address:", CONTRACT_ADDRESS);
      if (!isAddress(getAddress(CONTRACT_ADDRESS))) {
        throw new Error("Invalid contract address: " + CONTRACT_ADDRESS);
      }

      const trimmedToAddress = toAddress.trim();
      if (!isAddress(trimmedToAddress)) {
        throw new Error("Invalid recipient address: " + trimmedToAddress);
      }

      const parsedAmount = parseUnits(amount, 6);

      const data = encodeFunctionData({
        abi: RUSDCABI,
        functionName: "sendPayment",
        args: [trimmedToAddress, parsedAmount],
      });

      const transactionRequest = {
        from: wallet?.address,
        to: getAddress(CONTRACT_ADDRESS),
        data: data,
      };

      const transactionHash = await provider?.request({
        method: "eth_sendTransaction",
        params: [transactionRequest],
      });

      setTxHash(transactionHash);
    } catch (error) {
      console.error("Transaction failed", error);
    }
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl text-white w-full max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <Zap className="w-6 h-6 text-cyan-400" />
        <h2 className="text-lg font-semibold">Send USDC (Base Sepolia Testnet)</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-neutral-400">Recipient Address</label>
          <input
            type="text"
            value={toAddress}
            onChange={(e) => setToAddress(e.target.value)}
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>

        <div>
          <label className="block text-sm text-neutral-400">Amount (USDC)</label>
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>

        <button
          onClick={handleSendTransaction}
          className="w-full bg-cyan-600 hover:bg-cyan-500 text-black font-medium py-3 rounded-lg transition"
        >
          Send Transaction
        </button>

        {txHash && (
          <div className="mt-4 p-4 bg-neutral-800 rounded-lg text-sm">
            ✅ Transaction sent!
            <a
              href={`https://base-sepolia.blockscout.com/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 underline ml-1"
            >
              View on Base Sepolia Blockscout
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
