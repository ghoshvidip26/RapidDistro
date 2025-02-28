import { useSendTransaction } from "@privy-io/react-auth";
import { useState } from "react";
import { Zap } from "lucide-react";

export default function SendTransactionCard() {
  const { sendTransaction } = useSendTransaction();

  const [toAddress, setToAddress] = useState("0x5B5BfDA80cD063B65a2D2D5864e9c032dFB6e27A"); // You can change this
  const [amount, setAmount] = useState("0.01"); // In BNB
  const [txHash, setTxHash] = useState(null);

  const handleSendTransaction = async () => {
    const valueInWei = (BigInt(Math.floor(Number(amount) * 1e18))).toString(16); // Convert BNB to wei (hex)

    const unsignedTx = {
      to: toAddress,
      chainId: 97, // BSC Testnet Chain ID
      value: `0x${valueInWei}`, // must be hex string
    };

    const uiOptions = {
      header: "Confirm Transfer",
      description: `You are about to send ${amount} BNB to ${toAddress}`,
      buttonText: "Send Transaction",
      successHeader: "Transaction Sent!",
      successDescription: "Your BNB is on its way.",
      transactionInfo: {
        title: "Transaction Details",
        action: "Send BNB",
        contractInfo: {
          name: "Binance Smart Chain Testnet",
          url: `https://testnet.bscscan.com/address/${toAddress}`,
          imgUrl: "https://cryptologos.cc/logos/binance-coin-bnb-logo.png",
          imgSize: "sm",
        },
      },
    };

    try {
      const { hash } = await sendTransaction(unsignedTx, { uiOptions });
      setTxHash(hash);
    } catch (error) {
      console.error("Transaction failed", error);
      alert("Transaction failed - check console for details");
    }
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl text-white w-full max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <Zap className="w-6 h-6 text-cyan-400" />
        <h2 className="text-lg font-semibold">Send BNB (BSC Testnet)</h2>
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
          <label className="block text-sm text-neutral-400">Amount (BNB)</label>
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
              href={`https://testnet.bscscan.com/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 underline ml-1"
            >
              View on BscScan
            </a>
          </div>
        )}
      </div>
    </div>
  );
}