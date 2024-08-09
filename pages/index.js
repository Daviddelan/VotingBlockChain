// import React, { useState, useEffect, useContext } from 'react';
// import Image from 'next/image';
// import Countdown from 'react-countdown';

// import { VotingContext } from '../context/Voter';
// // import Style from '../styles/index.module.css';
// import Card from '../components/Card/Card';
// import image from "../assets/hero.png";

// const index = () => {
//   const {
//     getNewCandidate,
//     candidateArray,
//     giveVote,
//     currentAccount,
//     checkIfWalletIsConnected,
//     candidateLength,
//     voterLength,
//     getAllVoterData,
//   } = useContext(VotingContext);

//   useEffect(() => {
//     //checkIfWalletIsConnected();
//     getAllVoterData();
//   }, []);  // Only run once on component mount

//   return (
//     <div className={Style.home}>
//       {currentAccount && (
//         <div className={Style.winner}>
//           <div className={Style.winner_info}>
//             <div className={Style.candidate_list}>
//               <p>
//                 No. Candidates: <span>{candidateLength}</span>
//               </p>
//             </div>
//             <div className={Style.candidate_list}>
//               <p>
//                 No. Voters: <span>{voterLength}</span>
//               </p>
//             </div>
//           </div>
//           <div style={Style.winner_message}>
//             <small style={Style.winner_message_small}>
//               <Countdown date={Date.now() + 100000000} />
//             </small>
//           </div>
//         </div>
//       )}
//       <Card candidateArray={candidateArray} giveVote={giveVote} />
//     </div>
//   );
// };

// const Style = {
//   home: {
//     width: '70%',
//     margin: '0 auto',
//     marginBlock: '2rem',
//   },
//   winner: {
//     marginBlock: '3rem',
//     display: 'grid',
//     gridTemplateColumns: 'repeat(2, 1fr)',
//     gap: '2rem',
//   },
//   winner_info: {
//     backgroundColor: '#231e39',
//     padding: '1rem',
//     borderRadius: '0.2rem',
//     display: 'grid',
//     gridTemplateColumns: 'repeat(2, 1fr)',
//     gap: '1rem',
//     alignItems: 'center',
//   },
//   winner_message: {
//     backgroundColor: '#231e39',
//     padding: '2rem',
//     borderRadius: '0.2rem',
//     fontSize: '1.5rem',
//     color: '#b3b8cd',
//     lineHeight: 0,
//     position: 'relative',
//   },
//   winner_message_small: {
//     fontSize: '5rem',
//     top: '43%',
//     left: '50%',
//     transform: 'translate(-50%, -50%)',
//     position: 'absolute',
//   },
//   candidate_list: {
//     backgroundColor: '#9a02ac',
//     fontSize: '1rem',
//     padding: '0.1rem 1rem',
//   },
//   candidate_list_p: {
//     fontWeight: 600,
//   },
//   candidate_list_samp: {
//     backgroundColor: '#231E39',
//     padding: '0.5rem',
//     marginLeft: '0.5rem',
//     color: '#b3b8cd',
//     borderRadius: '0.2rem',
//   },
//   '@media screen and (max-width: 35em)': {
//     home: {
//       width: '90%',
//     },
//     winner: {
//       gridTemplateColumns: '1fr',
//     },
//     winner_message_small: {
//       fontSize: '2rem',
//     },
//   },
// };


// export default index;

import React, { useState, useEffect, useContext } from 'react';
import Image from 'next/image';
import Countdown from 'react-countdown';

import { VotingContext } from '../context/Voter';
import Card from '../components/Card/Card';
import image from "../assets/hero.png";

const index = () => {
  const { 
    getNewCandidate, 
    candidateArray, 
    giveVote, 
    currentAccount, 
    checkIfWalletIsConnected, 
    candidateLength, 
    voterLength,
    getAllVoterData,
  } = useContext(VotingContext);

  useEffect(() => {
    getAllVoterData();
  }, []);  // Only run once on component mount

  return (
    <div style={Style.home}>
      {currentAccount && (
        <div style={Style.winner}> 
          <div style={Style.winner_info}>
            <div style={Style.candidate_list}>
              <p style={Style.candidate_list_p}>
                No. Candidates: <span>{candidateLength}</span>
              </p>
            </div>
            <div style={Style.candidate_list}>
              <p style={Style.candidate_list_p}>
                No. Voters: <span>{voterLength}</span>
              </p>
            </div>
          </div>
          <div style={Style.winner_message}> 
            <small style={Style.winner_message_small}>
              <Countdown date={Date.now() + 100000000} />
            </small>  
          </div> 
        </div>
      )}
      <Card candidateArray={candidateArray} giveVote={giveVote} />
    </div>
  );
};

const Style = {
  home: {
    width: '70%',
    margin: '0 auto',
    marginBlock: '2rem',
  },
  winner: {
    marginBlock: '3rem',
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '2rem',
  },
  winner_info: {
    backgroundColor: '#231e39',
    padding: '1rem',
    borderRadius: '0.2rem',
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1rem',
    alignItems: 'center',
  },
  winner_message: {
    backgroundColor: '#231e39',
    padding: '2rem',
    borderRadius: '0.2rem',
    fontSize: '1.5rem',
    color: '#b3b8cd',
    lineHeight: 0,
    position: 'relative',
  },
  winner_message_small: {
    fontSize: '5rem',
    top: '43%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    position: 'absolute',
  },
  candidate_list: {
    backgroundColor: '#9a02ac',
    fontSize: '1rem',
    padding: '0.1rem 1rem',
  },
  candidate_list_p: {
    fontWeight: 600,
  },
  candidate_list_samp: {
    backgroundColor: '#231E39',
    padding: '0.5rem',
    marginLeft: '0.5rem',
    color: '#b3b8cd',
    borderRadius: '0.2rem',
  },
};

export default index;
