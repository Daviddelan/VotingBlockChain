import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useRouter } from 'next/router';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';

import { VotingContext } from "../context/Voter";
import Style from "../styles/allowedVoters.module.css";
import images from "../assets";
import Button from "../components/Button/Button";
import Input from "../components/Input/Input";

const allowedVoters = () => {
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, setFormInput] = useState({
    name: '',
    address: '',
    position: '',
  });

  const router = useRouter();
  const { uploadToIPFS, createVoter, voterArray, getAllVoterData } = useContext(VotingContext);

  const onDrop = useCallback(async (acceptedFiles) => {
    const url = await uploadToIPFS(acceptedFiles[0]);
    setFileUrl(url);
  });

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
    maxSize: 5000000,
  });

  useEffect(() => {
    getAllVoterData(); 
  }, []);

  return (
    <div className={Style.createVoter}>
      <div>
        {fileUrl ? (
          <div className={Style.voterInfo}>
            <img src={fileUrl} alt="Voter Image" />
            <div className={Style.voterInfo_paragraph}>
              <p>Name: <span>{formInput.name}</span></p>
              <p>Address: <span>{formInput.address.slice(0, 20)}</span></p>
              <p>Position: <span>{formInput.position}</span></p>
            </div>
          </div>
        ) : (
          <div className={Style.sideInfo}>
            <div className={Style.sideInfo_box}>
              <h4>Create candidate For the Voting Process</h4>
              <p>JES Developers is a community of developers who are passionate about building Ethereum ecosystems.</p>
              <p className={Style.sideInfo_para}>Contract Candidate</p>
            </div>
            <div className={Style.card}>
              {voterArray.map((el, i) => (
                <div key={i + 1} className={Style.card_box}>
                  <div className={Style.image}>
                    <img src={el[4]} alt="Voter Image" />
                  </div>
                  <div className={Style.card_info}>
                    <p>{el[1]}</p>
                    <p>Address: {el[3].slice(0, 10)}...</p>

                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className={Style.voter}>
        <div className={Style.voter_container}>
          <h1>Create A New Voter for the voting process</h1>
          <div className={Style.voter_container_box}>
            <div className={Style.voter_container_box_div}>
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <div className={Style.voter_container_box_div_info}>
                  <p>Upload File: JPG, PNG, GIF, WEBM Max 10MB </p>
                  <div className={Style.voter_container_box_div_image}>
                    <Image src={images.upload} width={150} height={150} objectFit="contain" alt="File Upload" />
                  </div>
                  <p>Drag & Drop the File Here</p>
                  <p>Or browse Locally for a picture on your device</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={Style.input_container}>
          <Input
            inputType="text"
            title="Name"
            placeholder="Voter's Name"
            handleClick={(e) => setFormInput({ ...formInput, name: e.target.value })}
          />
          <Input
            inputType="text"
            title="Address"
            placeholder="Voter's Address"
            handleClick={(e) => setFormInput({ ...formInput, address: e.target.value })}
          />
          <Input
            inputType="text"
            title="Position"
            placeholder="Voter's Position"
            handleClick={(e) => setFormInput({ ...formInput, position: e.target.value })}
          />

          <div className={Style.Button}>
            <Button btnName="Authorize Voter" handleClick={() => createVoter(formInput, fileUrl)} />
          </div>
        </div>
      </div>
      <div className={Style.createdVoter}>
        <div className={Style.createdVoter_info}>
          <Image src={images.creator} alt="User Photo" />
          <p>Notice for User</p>
          <p>Organizer <span>0x9999009....</span></p>
          <p>Only the organizer of the Voting process can create a voter</p>
        </div>
      </div>
    </div>
  );
};

export default allowedVoters;
