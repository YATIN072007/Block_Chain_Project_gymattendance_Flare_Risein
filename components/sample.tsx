"use client"

import { useAccount } from "wagmi"
import { useGymContract } from "@/hooks/useContract"

const SampleIntregation = () => {
  const { isConnected } = useAccount()
  const { data, actions, state } = useGymContract()

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <h2 className="text-2xl font-bold text-foreground mb-3">Gym Attendance</h2>
          <p className="text-muted-foreground">Please connect your wallet to use the gym attendance system.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Gym Attendance</h1>
          <p className="text-muted-foreground text-sm mt-1">Mark your decentralized gym check-ins</p>
        </div>

        {/* Stats */}
        <div className="bg-card border border-border rounded-lg p-4 mb-8">
          <p className="text-muted-foreground text-xs uppercase tracking-wide mb-2">Total Check-ins</p>
          <p className="text-2xl font-semibold text-foreground">{data.totalRecords}</p>
        </div>

        {/* Check In Button */}
        <button
          onClick={actions.checkIn}
          disabled={state.isLoading}
          className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
        >
          {state.isLoading ? "Checking In..." : "Check In"}
        </button>

        {/* Status */}
        {state.hash && (
          <div className="mt-6 p-4 bg-card border border-border rounded-lg">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Transaction Hash</p>
            <p className="text-sm font-mono text-foreground break-all mb-3">{state.hash}</p>
            {state.isConfirming && <p className="text-sm text-primary">Waiting for confirmation...</p>}
            {state.isConfirmed && <p className="text-sm text-green-500">Check-in confirmed!</p>}
          </div>
        )}

        {state.error && (
          <div className="mt-6 p-4 bg-card border border-destructive rounded-lg">
            <p className="text-sm text-destructive-foreground">Error: {state.error.message}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SampleIntregation
