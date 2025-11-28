"use client"

import { useEffect, useState } from "react"
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { contractABI, contractAddress } from "@/lib/contract"

export interface AttendanceRecord {
  user: string
  time: bigint
}

export interface ContractData {
  totalRecords: number
  records: AttendanceRecord[]
}

export interface ContractState {
  isLoading: boolean
  isPending: boolean
  isConfirming: boolean
  isConfirmed: boolean
  hash: `0x${string}` | undefined
  error: Error | null
}

export interface ContractActions {
  checkIn: () => Promise<void>
}

export const useGymContract = () => {
  const { address } = useAccount()
  const [isLoading, setIsLoading] = useState(false)
  const [records, setRecords] = useState<AttendanceRecord[]>([])

  const { data: totalRecords, refetch: refetchTotal } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: "getTotalRecords",
  })

  const { writeContractAsync, data: hash, error, isPending } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  useEffect(() => {
    if (isConfirmed) {
      refetchTotal()
    }
  }, [isConfirmed, refetchTotal])

  const checkIn = async () => {
    if (!address) return

    try {
      setIsLoading(true)
      await writeContractAsync({
        address: contractAddress,
        abi: contractABI,
        functionName: "checkIn",
      })
    } catch (err) {
      console.error("Error checking in:", err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const data: ContractData = {
    totalRecords: totalRecords ? Number(totalRecords as bigint) : 0,
    records,
  }

  const actions: ContractActions = {
    checkIn,
  }

  const state: ContractState = {
    isLoading: isLoading || isPending || isConfirming,
    isPending,
    isConfirming,
    isConfirmed,
    hash,
    error,
  }

  return {
    data,
    actions,
    state,
  }
}
