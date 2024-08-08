//import React, { useState, useEffect, createContext } from "react";
// import Web3Modal from "web3modal";
// import { ethers } from "ethers";
// import { create as ipfsHttpClient } from "ipfs-http-client";
// import axios from "axios";
// import { useRouter } from "next/router";

// import { VotingAddress, VotingAbi } from "./constants";

// const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');

// const fetchContract = (signerProvider) => new ethers.Contract(VotingAddress, VotingAbi, signerProvider);

// export const VotingContext = createContext();

// export const VotingProvider = ({ children }) => {
//   const votingTitle = "Ashesi Judicial Voting for the 2024 Academic Year";
//   const router = useRouter();

//   const [currentAccount, setCurrentAccount] = useState('');
//   const [error, setError] = useState('');

//   const checkIfWalletIsConnected = async () => {
//     if (!window.ethereum) {
//       setError('Please install MetaMask to protect your privacy.');
//       return;
//     }

//     const account = await window.ethereum.request({ method: 'eth_accounts' });

//     if (account.length) {
//       setCurrentAccount(account[0]);
//     } else {
//       setError('Please install MetaMask and connect your wallet. After that, refresh the page.');
//     }
//   };

//   const connectWallet = async () => {
//     if (!window.ethereum) {
//       setError('Please install MetaMask to protect your privacy.');
//       return;
//     }

//     const account = await window.ethereum.request({ method: 'eth_requestAccounts' });

//     setCurrentAccount(account[0]);
//   };

//   const uploadToIPFS = async (file) => {
//     if (file) {
//       try {
//         const formData = new FormData();
//         formData.append("file", file);

//         const response = await axios({
//           method: 'post',
//           url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
//           data: formData,
//           headers: {
//             pinata_api_key: `121d46341ce2aa5d112b`,
//           pinata_secret_api_key: `bc474b63199b734442bd459a802a5de348d99f7ec5da2175e2f7d0a19a81581e`,
//             "Content-Type": "multipart/form-data",
//           },
//         });
//         const ImgHash = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
//         return ImgHash;
//       } catch (error) {
//         console.log("Unable to upload the image to IPFS: ", error);
//       }
//     }
//   };

//   const createVoter = async (formInput, fileUrl) => {
//     try {
//       const { name, address, position } = formInput;
//       if (!name || !address || !position) {
//         console.log("Please fill in all fields");
//         return;
//       }

//       const web3modal = new Web3Modal();
//       const connection = await web3modal.connect();
//       const provider = new ethers.providers.Web3Provider(connection);
//       const signer = provider.getSigner();
//       const contract = fetchContract(signer);

//       const data = JSON.stringify({ name, address, position, image: fileUrl });
//       console.log('The data: ', data);
//       const response = await axios({
//         method: "POST",
//         url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
//         data: data,
//         headers: {
//           pinata_api_key: `121d46341ce2aa5d112b`,
//           pinata_secret_api_key: `bc474b63199b734442bd459a802a5de348d99f7ec5da2175e2f7d0a19a81581e`,
//           "Content-Type": "application/json",
//         },
//       });
//       const url = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
//       const voter = await contract.voterRight(address, name, position, url);
//       await voter.wait();
//       router.push('/voterList');
//     } catch (error) {
//       console.error('Error creating voter: ', error);
//     }
//   };

//   return (
//     <VotingContext.Provider value={{ votingTitle, checkIfWalletIsConnected, connectWallet, uploadToIPFS, createVoter }}>
//       {children}
//     </VotingContext.Provider>
//   );
// };

import React, { useState, useEffect, createContext } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { create as ipfsHttpClient } from "ipfs-http-client";
import axios from "axios";
import { useRouter } from "next/router";

import { VotingAddress, VotingAbi } from "./constants";

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');

const fetchContract = (signerProvider) => new ethers.Contract(VotingAddress, VotingAbi, signerProvider);

export const VotingContext = createContext();

export const VotingProvider = ({ children }) => {
  const votingTitle = "Ashesi Judicial Voting for the 2024 Academic Year";
  const router = useRouter();

  const [currentAccount, setCurrentAccount] = useState('');
  const [error, setError] = useState('');
  const [voters, setVoters] = useState([]);

  const checkIfWalletIsConnected = async () => {
    if (!window.ethereum) {
      setError('Please install MetaMask to protect your privacy.');
      return;
    }

    const account = await window.ethereum.request({ method: 'eth_accounts' });

    if (account.length) {
      setCurrentAccount(account[0]);
    } else {
      setError('Please install MetaMask and connect your wallet. After that, refresh the page.');
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      setError('Please install MetaMask to protect your privacy.');
      return;
    }

    const account = await window.ethereum.request({ method: 'eth_requestAccounts' });

    setCurrentAccount(account[0]);
  };

  const uploadToIPFS = async (file) => {
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await axios({
          method: 'post',
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: `121d46341ce2aa5d112b`,
            pinata_secret_api_key: `bc474b63199b734442bd459a802a5de348d99f7ec5da2175e2f7d0a19a81581e`,
            "Content-Type": "multipart/form-data",
          },
        });
        const ImgHash = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
        return ImgHash;
      } catch (error) {
        console.log("Unable to upload the image to IPFS: ", error);
      }
    }
  };

  const createVoter = async (formInput, fileUrl) => {
    try {
      const { name, address, position } = formInput;
      if (!name || !address || !position) {
        console.log("Please fill in all fields");
        return;
      }
  
      // Ensure address is in the correct format
      if (!ethers.utils.isAddress(address)) {
        console.error("Invalid Ethereum address");
        return;
      }
  
      const web3modal = new Web3Modal();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);
  
      const data = JSON.stringify({ name, address, position, image: fileUrl });
      console.log('The data: ', data);
      const response = await axios({
        method: "POST",
        url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        data: data,
        headers: {
          pinata_api_key: `121d46341ce2aa5d112b`,
          pinata_secret_api_key: `bc474b63199b734442bd459a802a5de348d99f7ec5da2175e2f7d0a19a81581e`,
          "Content-Type": "application/json",
        },
      });
      const url = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
      console.log('IPFS URL: ', url);
  
      console.log('Contract: ', contract);
      console.log('Signer: ', signer);
  
      console.log('Calling voterRight with:', address, name, fileUrl, url);
      const voterTx = await contract.voterRight(address, name, fileUrl, url);
      console.log('Transaction: ', voterTx);
  
      await voterTx.wait();
      console.log('Transaction mined: ', voterTx);
      router.push('/voterList');
    } catch (error) {
      console.error('Error creating voter: ', error);
    }
  };
  

  const fetchAllVoterData = async () => {
    try {
      const web3modal = new Web3Modal();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);

      const voters = await contract.getAllVoterData();
      setVoters(voters);
      console.log('All voters: ', voters);
    } catch (error) {
      console.error('Error fetching voters: ', error);
    }
  };

  return (
    <VotingContext.Provider value={{ votingTitle, checkIfWalletIsConnected, connectWallet, uploadToIPFS, createVoter, fetchAllVoterData, voters }}>
      {children}
    </VotingContext.Provider>
  );
};
