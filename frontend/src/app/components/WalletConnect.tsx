'use client';

interface WalletConnectProps {
  walletAddress: string;
  onConnect: () => void;
  onDisconnect: () => void;
  loading?: boolean;
}

export default function WalletConnect({
  walletAddress,
  onConnect,
  onDisconnect,
  loading = false,
}: WalletConnectProps) {
  const shortAddress = walletAddress
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : '';

  return (
    <div className="flex items-center gap-3">
      {!walletAddress ? (
        <button
          onClick={onConnect}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium transition"
        >
          {loading ? 'Connecting...' : 'Connect MetaMask'}
        </button>
      ) : (
        <div className="flex items-center gap-2">
          <div className="px-4 py-2 bg-green-100 text-green-800 rounded-lg font-mono text-sm font-medium">
            {shortAddress}
          </div>
          <button
            onClick={onDisconnect}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm font-medium transition"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
