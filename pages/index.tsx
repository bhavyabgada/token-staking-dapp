import { useState, useEffect, Suspense } from 'react';
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
  useColorMode,
  IconButton,
  Flex,
  Tooltip,
  Badge,
  Progress,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { useAccount, useConnect, useContractRead, useContractWrite, useWaitForTransaction } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { parseEther, formatEther } from 'viem';
import { STAKING_TOKEN_ABI, STAKING_CONTRACT_ABI } from '../constants/abis';
import {
  STAKING_TOKEN_ADDRESS,
  STAKING_CONTRACT_ADDRESS,
} from '../constants/addresses';
import { RepeatIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import dynamic from 'next/dynamic';

// Dynamic import of 3D components
const TokenModel = dynamic(() => import('../components/3d/TokenModel'), { ssr: false });
const StakingStats = dynamic(() => import('../components/StakingStats'), { ssr: false });

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 }
  }
};

export default function Home() {
  const [amount, setAmount] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('0');
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();

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
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
      >
        {/* Header Section */}
        <Flex justify="space-between" align="center" w="full">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Heading 
              bgGradient="linear(to-r, neon.blue, neon.purple)" 
              bgClip="text"
              fontSize="4xl"
            >
              Token Staking DApp
            </Heading>
          </motion.div>
          
          <Flex gap={4} align="center">
            <IconButton
              aria-label="Toggle color mode"
              icon={colorMode === 'dark' ? <SunIcon /> : <MoonIcon />}
              onClick={toggleColorMode}
              variant="ghost"
              _hover={{
                bg: colorMode === 'dark' ? 'whiteAlpha.200' : 'blackAlpha.200'
              }}
            />
            
            {!isConnected ? (
              <Button
                as={motion.button}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                colorScheme="blue"
                onClick={() => connect()}
                bgGradient="linear(to-r, neon.blue, neon.purple)"
                color="white"
              >
                Connect MetaMask
              </Button>
            ) : (
              <Badge
                p={2}
                borderRadius="full"
                variant="solid"
                colorScheme="green"
              >
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </Badge>
            )}
          </Flex>
        </Flex>

        {isConnected && (
          <>
            {/* 3D Token Visualization */}
            <motion.div variants={itemVariants}>
              <Box
                h="300px"
                borderRadius="xl"
                overflow="hidden"
                position="relative"
              >
                <Canvas>
                  <Suspense fallback={null}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} />
                    <Stars />
                    <TokenModel />
                    <OrbitControls enableZoom={false} />
                  </Suspense>
                </Canvas>
              </Box>
            </motion.div>

            {/* Staking Stats */}
            <motion.div variants={itemVariants}>
              <Box
                p={6}
                borderRadius="xl"
                bg={colorMode === 'dark' ? 'whiteAlpha.100' : 'white'}
                boxShadow="xl"
                backdropFilter="blur(10px)"
                border="1px solid"
                borderColor={colorMode === 'dark' ? 'whiteAlpha.200' : 'gray.200'}
              >
                <VStack spacing={4} align="stretch">
                  <Flex justify="space-between" align="center">
                    <Heading size="md">Your Balances</Heading>
                    <Button
                      leftIcon={<RepeatIcon />}
                      onClick={handleRefreshBalance}
                      size="sm"
                      variant="ghost"
                      _hover={{
                        bg: colorMode === 'dark' ? 'whiteAlpha.200' : 'blackAlpha.100'
                      }}
                    >
                      Refresh
                    </Button>
                  </Flex>

                  <StatGroup>
                    <Stat>
                      <StatLabel>Available to Stake</StatLabel>
                      <StatNumber
                        fontSize="3xl"
                        bgGradient="linear(to-r, neon.blue, neon.purple)"
                        bgClip="text"
                      >
                        {stakingBalance ? formatEther(stakingBalance) : '0'} STK
                      </StatNumber>
                      <StatLabel>≈ ${stakingBalance ? (Number(formatEther(stakingBalance)) * 1).toFixed(2) : '0.00'}</StatLabel>
                    </Stat>
                  </StatGroup>
                </VStack>
              </Box>
            </motion.div>

            {/* Staking Form */}
            <motion.div variants={itemVariants}>
              <Box
                p={6}
                borderRadius="xl"
                bg={colorMode === 'dark' ? 'whiteAlpha.100' : 'white'}
                boxShadow="xl"
                backdropFilter="blur(10px)"
                border="1px solid"
                borderColor={colorMode === 'dark' ? 'whiteAlpha.200' : 'gray.200'}
              >
                <VStack spacing={4}>
                  <Heading size="md">Stake Tokens</Heading>
                  <Input
                    placeholder="Amount to stake"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    type="number"
                    bg={colorMode === 'dark' ? 'whiteAlpha.100' : 'white'}
                    border="1px solid"
                    borderColor={colorMode === 'dark' ? 'whiteAlpha.300' : 'gray.200'}
                    _hover={{
                      borderColor: 'neon.blue'
                    }}
                    _focus={{
                      borderColor: 'neon.purple',
                      boxShadow: '0 0 0 1px var(--chakra-colors-neon-purple)'
                    }}
                  />
                  
                  <Select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    bg={colorMode === 'dark' ? 'whiteAlpha.100' : 'white'}
                  >
                    <option value="0">30 Days (10% APY)</option>
                    <option value="1">90 Days (15% APY)</option>
                    <option value="2">180 Days (20% APY)</option>
                    <option value="3">365 Days (30% APY)</option>
                  </Select>

                  {amount && (
                    <Box w="full">
                      <Text fontSize="sm" mb={2}>Estimated Rewards</Text>
                      <Progress
                        value={Number(selectedPeriod) * 25 + 25}
                        size="sm"
                        colorScheme="purple"
                        borderRadius="full"
                        bg={colorMode === 'dark' ? 'whiteAlpha.100' : 'gray.100'}
                      />
                      <Text
                        fontSize="sm"
                        color={colorMode === 'dark' ? 'neon.blue' : 'blue.500'}
                        mt={2}
                      >
                        {(Number(amount) * 0.1 * 
                          (selectedPeriod === '0' ? 1 : 
                           selectedPeriod === '1' ? 1.5 : 
                           selectedPeriod === '2' ? 2 : 3) * 
                          (selectedPeriod === '0' ? 30/365 : 
                           selectedPeriod === '1' ? 90/365 : 
                           selectedPeriod === '2' ? 180/365 : 1)).toFixed(2)
                        } Reward Tokens
                      </Text>
                    </Box>
                  )}

                  <Button
                    as={motion.button}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleStake}
                    width="full"
                    bgGradient="linear(to-r, neon.blue, neon.purple)"
                    color="white"
                    _hover={{
                      bgGradient: "linear(to-r, neon.purple, neon.blue)"
                    }}
                    isDisabled={!amount || Number(amount) <= 0 || (stakingBalance ? Number(formatEther(stakingBalance)) < Number(amount) : false)}
                  >
                    Stake Tokens
                  </Button>
                </VStack>
              </Box>
            </motion.div>

            {/* Active Stakes */}
            {stakes && stakes.length > 0 && (
              <motion.div variants={itemVariants}>
                <Heading size="md" mb={4}>Your Stakes</Heading>
                <Grid
                  templateColumns="repeat(auto-fill, minmax(300px, 1fr))"
                  gap={6}
                >
                  {stakes.map((stake: any, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Box
                        p={4}
                        borderRadius="xl"
                        bg={colorMode === 'dark' ? 
                          stake.active ? 'rgba(0, 255, 157, 0.1)' : 'whiteAlpha.100' :
                          stake.active ? 'green.50' : 'gray.50'
                        }
                        border="1px solid"
                        borderColor={stake.active ? 'neon.green' : 'transparent'}
                        boxShadow="xl"
                        _hover={{
                          transform: 'translateY(-2px)',
                          boxShadow: '2xl'
                        }}
                        transition="all 0.2s"
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
                    </motion.div>
                  ))}
                </Grid>
              </motion.div>
            )}
          </>
        )}
      </motion.div>

      {/* Stats Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent
          bg={colorMode === 'dark' ? 'gray.800' : 'white'}
          borderRadius="xl"
        >
          <ModalHeader>Staking Statistics</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <StakingStats />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
} 