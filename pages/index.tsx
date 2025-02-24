import { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  VStack,
  Text,
  Button,
  Input,
  Select,
  useToast,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  Grid,
} from '@chakra-ui/react';
import { useAccount, useConnect, useContractRead, useContractWrite, useWaitForTransaction } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { parseEther, formatEther } from 'viem';
import { STAKING_TOKEN_ABI, STAKING_CONTRACT_ABI } from '../constants/abis';
import {
  STAKING_TOKEN_ADDRESS,
  STAKING_CONTRACT_ADDRESS,
} from '../constants/addresses';
import { RepeatIcon } from '@chakra-ui/icons';

export default function Home() {
  const [amount, setAmount] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('0');
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const toast = useToast();

  // Read contract data
  const { data: stakingBalance, refetch: refetchBalance } = useContractRead({
    address: STAKING_TOKEN_ADDRESS,
    abi: STAKING_TOKEN_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    enabled: !!address,
    watch: true,
  });

  const { data: stakes } = useContractRead({
    address: STAKING_CONTRACT_ADDRESS,
    abi: STAKING_CONTRACT_ABI,
    functionName: 'getStakes',
    args: address ? [address] : undefined,
    enabled: !!address,
    watch: true,
  });

  // Write contract functions
  const { write: approve, data: approveData } = useContractWrite({
    address: STAKING_TOKEN_ADDRESS,
    abi: STAKING_TOKEN_ABI,
    functionName: 'approve',
  });

  const { write: stake, data: stakeData } = useContractWrite({
    address: STAKING_CONTRACT_ADDRESS,
    abi: STAKING_CONTRACT_ABI,
    functionName: 'stake',
  });

  const { write: unstake } = useContractWrite({
    address: STAKING_CONTRACT_ADDRESS,
    abi: STAKING_CONTRACT_ABI,
    functionName: 'unstake',
  });

  // Transaction notifications
  useWaitForTransaction({
    hash: approveData?.hash,
    onSuccess: () => {
      toast({
        title: 'Approval Successful',
        description: 'You can now stake your tokens',
        status: 'success',
      });
      // Proceed with staking
      stake({
        args: [parseEther(amount), BigInt(selectedPeriod)],
      });
    },
  });

  useWaitForTransaction({
    hash: stakeData?.hash,
    onSuccess: () => {
      toast({
        title: 'Staking Successful',
        description: 'Your tokens have been staked',
        status: 'success',
      });
      setAmount('');
    },
  });

  const handleRefreshBalance = async () => {
    await refetchBalance();
    toast({
      title: 'Balance Updated',
      description: 'Your balance has been refreshed',
      status: 'success',
      duration: 2000,
    });
  };

  const handleStake = async () => {
    if (!amount || !selectedPeriod) {
      toast({
        title: 'Error',
        description: 'Please enter an amount and select a staking period',
        status: 'error',
      });
      return;
    }

    try {
      // First approve the token transfer
      approve({
        args: [STAKING_CONTRACT_ADDRESS, parseEther(amount)],
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to approve token transfer',
        status: 'error',
      });
    }
  };

  const handleUnstake = async (stakeIndex: number) => {
    try {
      unstake({
        args: [BigInt(stakeIndex)],
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to unstake tokens',
        status: 'error',
      });
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Heading>Token Staking DApp</Heading>
          {!isConnected ? (
            <Button colorScheme="blue" onClick={() => connect()}>
              Connect MetaMask
            </Button>
          ) : (
            <Text>Connected: {address?.slice(0, 6)}...{address?.slice(-4)}</Text>
          )}
        </Box>

        {isConnected && (
          <>
            <Box p={6} borderWidth={1} borderRadius="lg" bg="white">
              <VStack spacing={4} align="stretch">
                <Heading size="md">Your Balances</Heading>
                <StatGroup>
                  <Stat>
                    <StatLabel>Available to Stake</StatLabel>
                    <StatNumber>
                      {stakingBalance ? formatEther(stakingBalance) : '0'} STK
                    </StatNumber>
                    <StatLabel>≈ ${stakingBalance ? (Number(formatEther(stakingBalance)) * 1).toFixed(2) : '0.00'}</StatLabel>
                  </Stat>
                </StatGroup>
                <Button 
                  leftIcon={<RepeatIcon />} 
                  onClick={handleRefreshBalance}
                  size="sm"
                  variant="outline"
                >
                  Refresh Balance
                </Button>
              </VStack>
            </Box>

            <Box p={6} borderWidth={1} borderRadius="lg">
              <VStack spacing={4}>
                <Heading size="md">Stake Tokens</Heading>
                <Input
                  placeholder="Amount to stake"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  type="number"
                />
                <Select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                >
                  <option value="0">30 Days (10% APY)</option>
                  <option value="1">90 Days (15% APY)</option>
                  <option value="2">180 Days (20% APY)</option>
                  <option value="3">365 Days (30% APY)</option>
                </Select>
                {amount && (
                  <Text fontSize="sm" color="gray.600">
                    Estimated reward after {selectedPeriod === '0' ? '30' : 
                      selectedPeriod === '1' ? '90' : 
                      selectedPeriod === '2' ? '180' : '365'} days: 
                    {' '}
                    {(Number(amount) * 0.1 * 
                      (selectedPeriod === '0' ? 1 : 
                       selectedPeriod === '1' ? 1.5 : 
                       selectedPeriod === '2' ? 2 : 3) * 
                      (selectedPeriod === '0' ? 30/365 : 
                       selectedPeriod === '1' ? 90/365 : 
                       selectedPeriod === '2' ? 180/365 : 1)).toFixed(2)
                    } Reward Tokens
                  </Text>
                )}
                <Button 
                  colorScheme="blue" 
                  onClick={handleStake} 
                  width="full"
                  isDisabled={!amount || Number(amount) <= 0 || (stakingBalance ? Number(formatEther(stakingBalance)) < Number(amount) : false)}
                >
                  Stake Tokens
                </Button>
              </VStack>
            </Box>

            {stakes && stakes.length > 0 && (
              <Box>
                <Heading size="md" mb={4}>
                  Your Stakes
                </Heading>
                <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={6}>
                  {stakes.map((stake: any, index: number) => (
                    <Box
                      key={index}
                      p={4}
                      borderWidth={1}
                      borderRadius="lg"
                      bg={stake.active ? 'green.50' : 'gray.50'}
                    >
                      <VStack align="stretch" spacing={2}>
                        <Text>
                          Amount: {formatEther(stake.amount)} STK
                        </Text>
                        <Text>
                          Staked: {new Date(Number(stake.timestamp) * 1000).toLocaleDateString()}
                        </Text>
                        <Text>
                          Status: {stake.active ? 'Active' : 'Withdrawn'}
                        </Text>
                        {stake.active && (
                          <Button
                            colorScheme="red"
                            size="sm"
                            onClick={() => handleUnstake(index)}
                          >
                            Unstake
                          </Button>
                        )}
                      </VStack>
                    </Box>
                  ))}
                </Grid>
              </Box>
            )}
          </>
        )}
      </VStack>
    </Container>
  );
} 