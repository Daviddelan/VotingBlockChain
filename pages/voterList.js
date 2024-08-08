import React, { useContext, useEffect } from 'react';
import { VotingContext } from "../context/Voter";

const VoterList = () => {
  const { fetchAllVoterData, voters } = useContext(VotingContext);

  useEffect(() => {
    fetchAllVoterData();
  }, []);

  return (
    <div>
      <h1>Voter List</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Image</th>
            <th>Address</th>
            <th>IPFS</th>
            <th>Allowed</th>
            <th>Voted</th>
          </tr>
        </thead>
        <tbody>
          {voters.map((voter, index) => (
            <tr key={index}>
              <td>{voter.voter_voterId.toString()}</td>
              <td>{voter.voter_name}</td>
              <td><img src={voter.voter_image} alt={voter.voter_name} width="50" height="50" /></td>
              <td>{voter.voter_address}</td>
              <td>{voter.voter_ipfs}</td>
              <td>{voter.voter_allowed.toString()}</td>
              <td>{voter.voter_voted.toString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VoterList;
