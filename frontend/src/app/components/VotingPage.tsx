'use client';

import { useEffect, useState } from 'react';
import { useVoteX } from '../hooks/useVoteX';
import WalletConnect from './WalletConnect';
import CandidateCard from './CandidateCard';

export default function VotingPage() {
  const {
    walletAddress,
    candidates,
    hasVoted,
    loading,
    error,
    connectWallet,
    disconnectWallet,
    submitVote,
    refreshCandidates,
  } = useVoteX();

  const [votingCandidateId, setVotingCandidateId] = useState<number | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Auto-refresh candidates every 5 seconds
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      refreshCandidates();
    }, 5000);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshCandidates]);

  const handleVote = async (candidateId: number) => {
    setVotingCandidateId(candidateId);
    await submitVote(candidateId);
    setVotingCandidateId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">🗳️ VoteX</h1>
            <p className="text-gray-600 text-sm mt-1">Decentralized Voting System</p>
          </div>
          <WalletConnect
            walletAddress={walletAddress}
            onConnect={connectWallet}
            onDisconnect={disconnectWallet}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <p className="font-semibold">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Not Connected State */}
        {!walletAddress ? (
          <div className="text-center py-20">
            <div className="inline-block p-8 bg-white rounded-lg shadow-lg">
              <div className="text-5xl mb-4">👛</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Connect Your Wallet</h2>
              <p className="text-gray-600 mb-6 max-w-sm">
                Please connect your MetaMask wallet to participate in voting.
              </p>
              <button
                onClick={connectWallet}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition"
              >
                Connect MetaMask
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-gray-600 text-sm">Total Candidates</p>
                <p className="text-3xl font-bold text-blue-600">{candidates.length}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-gray-600 text-sm">Total Votes</p>
                <p className="text-3xl font-bold text-green-600">
                  {candidates.reduce((sum, c) => sum + Number(c.voteCount), 0)}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-gray-600 text-sm">Your Status</p>
                <p className={`text-3xl font-bold ${hasVoted ? 'text-green-600' : 'text-orange-600'}`}>
                  {hasVoted ? '✓ Voted' : 'Ready'}
                </p>
              </div>
            </div>

            {/* Voting Status */}
            {hasVoted && (
              <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                <p className="font-semibold">✓ Your vote has been recorded</p>
                <p className="text-sm">You have already voted and cannot vote again.</p>
              </div>
            )}

            {/* Controls */}
            <div className="mb-6 flex gap-2">
              <button
                onClick={refreshCandidates}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium transition"
              >
                🔄 Refresh Results
              </button>
              <label className="flex items-center gap-2 ml-auto">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">Auto-refresh every 5s</span>
              </label>
            </div>

            {/* Candidates Grid */}
            {candidates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {candidates.map((candidate) => (
                  <CandidateCard
                    key={Number(candidate.id)}
                    candidate={candidate}
                    onVote={handleVote}
                    disabled={!walletAddress || loading}
                    loading={votingCandidateId === Number(candidate.id) && loading}
                    hasVoted={hasVoted}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-lg">
                <p className="text-gray-600">No candidates available</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-6xl mx-auto px-6 py-6 text-center text-gray-600 text-sm">
          <p>Built on blockchain • Transparent • Tamper-proof</p>
        </div>
      </footer>
    </div>
  );
}
