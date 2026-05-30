'use client';

import { Candidate } from '../hooks/useVoteX';

interface CandidateCardProps {
  candidate: Candidate;
  onVote: (id: number) => void;
  disabled?: boolean;
  loading?: boolean;
  hasVoted?: boolean;
}

export default function CandidateCard({
  candidate,
  onVote,
  disabled = false,
  loading = false,
  hasVoted = false,
}: CandidateCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-md hover:shadow-lg transition">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-800">{candidate.name}</h3>
        <p className="text-gray-500 text-sm mt-1">Candidate #{Number(candidate.id)}</p>
      </div>

      <div className="mb-6">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-blue-600">
            {Number(candidate.voteCount)}
          </span>
          <span className="text-gray-600">votes</span>
        </div>
        {Number(candidate.voteCount) > 0 && (
          <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{
                width: `${Math.min(100, (Number(candidate.voteCount) * 20) % 100)}%`,
              }}
            />
          </div>
        )}
      </div>

      <button
        onClick={() => onVote(Number(candidate.id))}
        disabled={disabled || loading || hasVoted}
        className={`w-full py-2 px-4 rounded-lg font-medium transition ${
          hasVoted
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : disabled
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700'
        }`}
      >
        {loading ? 'Voting...' : hasVoted ? 'Already Voted' : 'Vote'}
      </button>
    </div>
  );
}
