import './App.scss';
import {
  Route,
  Routes
} from 'react-router-dom';
import 'aos/dist/aos.css';
import "@rainbow-me/rainbowkit/styles.css";
import { ToastContainer } from 'react-toastify';
import {
  getDefaultWallets,
  RainbowKitProvider, 
  darkTheme 
} from '@rainbow-me/rainbowkit';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { goerli, gnosis, polygonMumbai } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import "react-toastify/dist/ReactToastify.css";
import 'boxicons';
import Bg from './components/Bg_creator/Bg';
import Header from './components/Header/Header';
import CreateTransaction from './pages/CreateTransaction'
import CreateData from './pages/createData';
import Home from './pages/Home';
import IDS from './pages/ids';
import Past from './pages/pastTransactions';

const { chains, provider } = configureChains(
  [goerli,polygonMumbai],
  [alchemyProvider({ apiKey: process.env.ALCHEMY_ID }), publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

function App() {

  return (
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains} theme={darkTheme({
          accentColor: '#3F00FF',
          accentColorForeground: 'white',
          borderRadius: 'medium'
        })}>
          
          <Header />
          <div className="App"> 
            <Routes>

              <Route exact path="/" element={<Home />} />
              <Route exact path="/createData" element={<CreateData />} />
              <Route exact path="/seeIds" element={<IDS />} />
              <Route exact path="/stream" element={<CreateTransaction />} />
              <Route exact path="/pastTransactions" element={<Past />} />


            </Routes>                    
          </div>    
          {/* <Bg /> */}

          {/* <a style={{"background":"white"}} href="https://app.safe.global/home?safe=gor:0x0fA560f99F6EA34ECA0933d2969d47d98e2176Ea&showCreationModal=true">create safe</a> */}

          <ToastContainer autoClose={4000} />
        </RainbowKitProvider>
      </WagmiConfig> 
  );
}

export default App;
