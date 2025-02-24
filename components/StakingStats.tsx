import { useEffect, useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  useColorMode,
  SimpleGrid,
  CircularProgress,
  CircularProgressLabel,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

export default function StakingStats() {
  const { colorMode } = useColorMode();
  const [totalStaked, setTotalStaked] = useState(0);
  const [stakingAPY, setStakingAPY] = useState(0);
  const [totalRewards, setTotalRewards] = useState(0);
  const [stakersCount, setStakersCount] = useState(0);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setTotalStaked(1234567);
      setStakingAPY(15);
      setTotalRewards(98765);
      setStakersCount(456);
    }, 1000);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <MotionBox
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        <MotionBox
          variants={itemVariants}
          p={6}
          borderRadius="xl"
          bg={colorMode === 'dark' ? 'whiteAlpha.100' : 'white'}
          boxShadow="xl"
          border="1px solid"
          borderColor={colorMode === 'dark' ? 'whiteAlpha.200' : 'gray.200'}
        >
          <VStack spacing={4} align="stretch">
            <Text fontSize="lg" fontWeight="bold">Total Value Locked</Text>
            <HStack justify="space-between" align="center">
              <Stat>
                <StatNumber
                  fontSize="3xl"
                  bgGradient="linear(to-r, neon.blue, neon.purple)"
                  bgClip="text"
                >
                  ${totalStaked.toLocaleString()}
                </StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  23.36%
                </StatHelpText>
              </Stat>
              <CircularProgress
                value={75}
                color="neon.blue"
                thickness="12px"
                size="80px"
              >
                <CircularProgressLabel>75%</CircularProgressLabel>
              </CircularProgress>
            </HStack>
          </VStack>
        </MotionBox>

        <MotionBox
          variants={itemVariants}
          p={6}
          borderRadius="xl"
          bg={colorMode === 'dark' ? 'whiteAlpha.100' : 'white'}
          boxShadow="xl"
          border="1px solid"
          borderColor={colorMode === 'dark' ? 'whiteAlpha.200' : 'gray.200'}
        >
          <VStack spacing={4} align="stretch">
            <Text fontSize="lg" fontWeight="bold">Current APY</Text>
            <HStack justify="space-between" align="center">
              <Stat>
                <StatNumber
                  fontSize="3xl"
                  bgGradient="linear(to-r, neon.green, neon.blue)"
                  bgClip="text"
                >
                  {stakingAPY}%
                </StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  5.25%
                </StatHelpText>
              </Stat>
              <CircularProgress
                value={stakingAPY}
                color="neon.green"
                thickness="12px"
                size="80px"
              >
                <CircularProgressLabel>{stakingAPY}%</CircularProgressLabel>
              </CircularProgress>
            </HStack>
          </VStack>
        </MotionBox>

        <MotionBox
          variants={itemVariants}
          p={6}
          borderRadius="xl"
          bg={colorMode === 'dark' ? 'whiteAlpha.100' : 'white'}
          boxShadow="xl"
          border="1px solid"
          borderColor={colorMode === 'dark' ? 'whiteAlpha.200' : 'gray.200'}
        >
          <VStack spacing={4} align="stretch">
            <Text fontSize="lg" fontWeight="bold">Total Rewards Distributed</Text>
            <HStack justify="space-between" align="center">
              <Stat>
                <StatNumber
                  fontSize="3xl"
                  bgGradient="linear(to-r, neon.purple, neon.pink)"
                  bgClip="text"
                >
                  ${totalRewards.toLocaleString()}
                </StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  12.45%
                </StatHelpText>
              </Stat>
              <CircularProgress
                value={85}
                color="neon.purple"
                thickness="12px"
                size="80px"
              >
                <CircularProgressLabel>85%</CircularProgressLabel>
              </CircularProgress>
            </HStack>
          </VStack>
        </MotionBox>

        <MotionBox
          variants={itemVariants}
          p={6}
          borderRadius="xl"
          bg={colorMode === 'dark' ? 'whiteAlpha.100' : 'white'}
          boxShadow="xl"
          border="1px solid"
          borderColor={colorMode === 'dark' ? 'whiteAlpha.200' : 'gray.200'}
        >
          <VStack spacing={4} align="stretch">
            <Text fontSize="lg" fontWeight="bold">Total Stakers</Text>
            <HStack justify="space-between" align="center">
              <Stat>
                <StatNumber
                  fontSize="3xl"
                  bgGradient="linear(to-r, neon.pink, neon.blue)"
                  bgClip="text"
                >
                  {stakersCount.toLocaleString()}
                </StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  8.87%
                </StatHelpText>
              </Stat>
              <CircularProgress
                value={60}
                color="neon.pink"
                thickness="12px"
                size="80px"
              >
                <CircularProgressLabel>60%</CircularProgressLabel>
              </CircularProgress>
            </HStack>
          </VStack>
        </MotionBox>
      </SimpleGrid>
    </MotionBox>
  );
} 