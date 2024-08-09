import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useRouter } from 'next/router';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';

import { VotingContext } from "../context/Voter";
import Style from "../styles/allowedVoters.module.css";
import images from "../assets";
import Button from "../components/Button/Button";
import Input from "../components/Input/Input";

const candidateRegistration = () => {
  const [fileUrl, setFileUrl] = useState(null);
  const [candidateForm, setCandidateForm] = useState({
    name: '',
    address: '',
    age: '',
  });

  const router = useRouter();
  const { setCandidate, uploadToIPFSCandidate, candidateArray, getNewCandidate } = useContext(VotingContext);

  const onDrop = useCallback(async (acceptedFiles) => {
    const url = await uploadToIPFSCandidate(acceptedFiles[0]);
    setFileUrl(url);
  });

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
    maxSize: 5000000,
  });

  useEffect(() => {
    getNewCandidate();
  }, []);

  return (
    <div className={Style.createVoter}>
      <div>
        {fileUrl ? (
          <div className={Style.voterInfo}>
            <img src={fileUrl} alt="Voter Image" />
            <div className={Style.voterInfo_paragraph}>
              <p>Name: <span>{candidateForm.name}</span></p>
              <p>Address: <span>{candidateForm.address.slice(0, 20)}</span></p>
              <p>Age: <span>{candidateForm.age}</span></p>
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
              {candidateArray.map((el, i) => (
                <div key={i + 1} className={Style.card_box}>
                  <div className={Style.image}>
                    <img src={el[3]} alt="Voter Image" />
                  </div>
                  <div className={Style.card_info}>
                    <p>{el[1]} #{el[2].toNumber()}</p>
                    <p>{el[0]}</p>
                    <p>Address: {el[6].slice(0, 10)}..</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className={Style.voter}>
        <div className={Style.voter_container}>
          <h1>Create A New Candidate for the voting process</h1>
          <div className={Style.voter_container_box}>
            <div className={Style.voter_container_box_div}>
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <div className={Style.voter_container_box_div_info}>
                  <p>Upload File: JPG, PNG, GIF, WEBM Max 10MB</p>
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
            handleClick={(e) => setCandidateForm({ ...candidateForm, name: e.target.value })}
          />
          <Input
            inputType="text"
            title="Address"
            placeholder="Voter's Address"
            handleClick={(e) => setCandidateForm({ ...candidateForm, address: e.target.value })}
          />
          <Input
            inputType="text"
            title="Age"
            placeholder="Voter's Age"
            handleClick={(e) => setCandidateForm({ ...candidateForm, age: e.target.value })}
          />

          <div className={Style.Button}>
            <Button btnName="Authorize Candidate" handleClick={() => setCandidate(candidateForm, fileUrl, router)} />
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

export default candidateRegistration;
