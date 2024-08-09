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
  const [candidateLength, setCandidateLength] = useState('');
  const pushCandidate = [];
  const candidateIndex = [];
  const [candidateArray, setCandidateArray] = useState(pushCandidate);
  const [error, setError] = useState('');
  const highestVote = [];
  const pushVoter = [];
  const [voterArray, setVoterArray] = useState(pushVoter);
  const [voterLength, setVoterLength] = useState('');
  const [voters, setVoters] = useState([]);

  // Add this line:
  const [voterAddress, setVoterAddress] = useState([]);

  const checkIfWalletIsConnected = async () => {
    if (!window.ethereum) {
      setError('Please install MetaMask to protect your privacy.');
      return;
    }

    const account = await window.ethereum.request({ method: 'eth_accounts' });

    if (account.length && account[0] !== currentAccount) {  
      setCurrentAccount(account[0]);
    } else {
      setError('Please install MetaMask and connect your wallet. After that, refresh the page.');
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      return setError('Please install MetaMask to protect your privacy.');
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

  const uploadToIPFSCandidate = async (file) => {
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

  const getAllVoterData = async () => {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);
  
      const voterListData = await contract.getVoterList();
      setVoterAddress(voterListData);
  
      // Log immediately after setting the state
      console.log("Voter Addresses:", voterListData);
  
      voterListData.map(async (el) => {
        const singleVoterData = await contract.getVoterData(el);
        pushVoter.push(singleVoterData);
      });
  
      const voterList = await contract.getVoterLength();
      setVoterLength(voterList.toNumber());

      console.log("Voter List Length:", voterList.toNumber());
    } catch (error) {
      setError('Error fetching voter data:', error);
    }
  };
  
  useEffect(() => {
    getAllVoterData();
  }, []);


  const giveVote = async(id) => {
    try{
      const voterAddress = id.address;
      const voterId = id.id;
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer)
      
      const votedList = await contract.vote(voterAddress, voterId)
    }catch (error) {
      console.error('Error giving vote: ', error);
    }
  }
  


  const setCandidate = async (candidateForm, fileUrl, router) => {
    try {
      const { name, address, age } = candidateForm;
      if (!name || !address || !age) {
        return setError("Input data is missing");
      }
  
      // Ensure address is in the correct format
      if (!ethers.utils.isAddress(address)) {
        console.error("Invalid Ethereum address");
        return;
      }
  
      console.log(name, address, age, fileUrl);
  
      // Connect to MetaMask
      const web3modal = new Web3Modal();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);
  
      // Prepare data for IPFS
      const data = JSON.stringify({ name, address, image: fileUrl, age });
      console.log('Data to IPFS:', data);
  
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
      
      const ipfs = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
      console.log('IPFS URL:', ipfs);
  
      // Interact with the contract
      console.log('Calling setCandidate with:', address, age, name, fileUrl, ipfs);
      const candidateTx = await contract.setCandidate(address, age, name, fileUrl, ipfs);
      console.log('Transaction:', candidateTx);
  
      // Wait for the transaction to be mined
      await candidateTx.wait();
      console.log('Transaction mined:', candidateTx);
  
      // Navigate after successful transaction
      router.push('/');
    } catch (error) {
      console.error('Error setting candidate:', error);
    }
  };
  
  

  const getNewCandidate = async () => {
    try{
      const web3modal = new Web3Modal();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);

      const allCandidates = await contract.getCandidate();
      console.log('All Candidates: ', allCandidates);

      allCandidates.map(async (el) => {
        const singleCandidateData = await contract.getCandidatedata(el);
        pushCandidate.push(singleCandidateData);
        candidateIndex.push(singleCandidateData[2].toNumber());
        console.log('Candidate Index:', singleCandidateData);
      });

      const allCandidateLength = await contract.getCandidateLength();     
      setCandidateLength(allCandidateLength.toNumber());
    }catch (error) {
      console.log('Error getting new candidate: ', error);
    }
  }
  useEffect(() => {
    getNewCandidate();
  }, []);

  return (
    <VotingContext.Provider value={{ votingTitle, checkIfWalletIsConnected, connectWallet, uploadToIPFS, createVoter, getAllVoterData, giveVote, setCandidate, getNewCandidate, error, voterArray, voterLength, voterAddress, currentAccount, candidateLength, candidateArray, uploadToIPFSCandidate}}>
      {children}
    </VotingContext.Provider>
  );
};
