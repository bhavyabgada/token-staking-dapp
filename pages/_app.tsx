import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { hardhat } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { QueryClient, QueryClientProvider } from 'react-query';

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
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider>
          <Component {...pageProps} />
        </ChakraProvider>
      </QueryClientProvider>
    </WagmiConfig>
  );
}

export default MyApp; 