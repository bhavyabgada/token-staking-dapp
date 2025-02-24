import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from 'next/app';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { hardhat } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from 'next-themes';

// Custom theme configuration
const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  styles: {
    global: (props: any) => ({
      body: {
        bg: props.colorMode === 'dark' ? 'gray.900' : 'white',
        color: props.colorMode === 'dark' ? 'white' : 'gray.900',
      },
    }),
  },
  colors: {
    neon: {
      blue: '#00f3ff',
      purple: '#7928CA',
      pink: '#FF0080',
      green: '#00FF9D',
    },
  },
  components: {
    Button: {
      baseStyle: {
        _hover: {
          transform: 'translateY(-2px)',
          boxShadow: '0 0 15px',
        },
        transition: 'all 0.2s ease-in-out',
      },
    },
    Box: {
      baseStyle: {
        transition: 'all 0.2s ease-in-out',
      },
    },
  },
});

const { chains, publicClient } = configureChains(
  [hardhat],
  [publicProvider()]
);

const config = createConfig({
  autoConnect: true,
  connectors: [
    new InjectedConnector({
      chains,
      options: {
        name: 'MetaMask',
        shimDisconnect: true,
      },
    }),
  ],
  publicClient,
});

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <WagmiConfig config={config}>
        <QueryClientProvider client={queryClient}>
          <ChakraProvider theme={theme}>
            <AnimatePresence mode="wait">
              <Component {...pageProps} />
            </AnimatePresence>
          </ChakraProvider>
        </QueryClientProvider>
      </WagmiConfig>
    </ThemeProvider>
  );
}

export default MyApp; 