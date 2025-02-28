import { useState } from "react";
import { Zap, Trash2 } from "lucide-react";

const TransferAmount = () => {
  const [token, setToken] = useState("");
  const [receivers, setReceivers] = useState([{ address: "", amount: "" }]);

  const handleAddReceiver = () => {
    setReceivers([...receivers, { address: "", amount: "" }]);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { name, value } = event.target;
    const newReceivers = [...receivers];
    newReceivers[index][name] = value;
    setReceivers(newReceivers);
  };

  const handleDeleteReceiver = (index: number) => {
    setReceivers(receivers.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-4">
      <div className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-xl">

        {/* Header with Logo */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <Zap className="w-6 h-6 text-cyan-400" />
          <h2 className="text-xl font-semibold">RapidDistro - Transfer Amount</h2>
        </div>

        {/* Token Address Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-neutral-400 mb-2">
            Token Address
          </label>
          <input
            type="text"
            className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="Enter token address"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
        </div>

        {/* Receivers List */}
        <div className="space-y-4">
          {receivers.map((receiver, index) => (
            <div key={index} className="flex flex-wrap gap-3 items-center">
              {/* Address Input */}
              <input
                type="text"
                name="address"
                placeholder="Receiver Address"
                value={receiver.address}
                onChange={(e) => handleChange(e, index)}
                className="flex-1 p-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-cyan-500"
              />

              {/* Amount Input */}
              <input
                type="number"
                name="amount"
                placeholder="Amount"
                value={receiver.amount}
                onChange={(e) => handleChange(e, index)}
                className="w-24 p-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-cyan-500"
              />

              {/* Delete Button */}
              {receivers.length > 1 && (
                <button
                  onClick={() => handleDeleteReceiver(index)}
                  className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add Receiver Button */}
        <button
          onClick={handleAddReceiver}
          className="mt-6 w-full py-3 bg-cyan-600 text-black font-medium rounded-lg hover:bg-cyan-500 transition"
        >
          + Add Receiver
        </button>
      </div>
    </div>
  );
};

export default TransferAmount;