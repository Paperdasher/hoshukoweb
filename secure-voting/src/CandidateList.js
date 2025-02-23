import React, { useEffect, useState } from 'react';
import { db } from './firebase'; // Import Firestore db

const CandidatesList = () => {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    const fetchCandidates = async () => {
      const snapshot = await db.collection('candidates').get();
      const candidatesData = snapshot.docs.map(doc => doc.data());
      setCandidates(candidatesData);
    };

    fetchCandidates();
  }, []);

  return (
    <div className="candidates-list">
      <h2>Candidates List</h2>
      {candidates.length === 0 ? (
        <p>No candidates added yet.</p>
      ) : (
        <ul>
          {candidates.map((candidate, index) => (
            <li key={index}>
              {candidate.logo && <img src={candidate.logo} alt={`${candidate.name} logo`} />}
              <h3>{candidate.name}</h3>
              <p>Party: {candidate.party}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CandidatesList;