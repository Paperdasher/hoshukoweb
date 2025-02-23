import React, { useState } from 'react';
import { db } from './firebase'; // Import Firestore db

const AddCandidate = () => {
  const [candidateName, setCandidateName] = useState('');
  const [candidateParty, setCandidateParty] = useState('');
  const [candidateLogo, setCandidateLogo] = useState('');

  const handleAddCandidate = async (e) => {
    e.preventDefault();

    if (!candidateName || !candidateParty) {
      alert("Please fill out all fields.");
      return;
    }

    try {
      await db.collection('candidates').add({
        name: candidateName,
        party: candidateParty,
        logo: candidateLogo
      });
      alert("Candidate added successfully!");
      setCandidateName('');
      setCandidateParty('');
      setCandidateLogo('');
    } catch (error) {
      console.error("Error adding candidate: ", error);
    }
  };

  return (
    <div className="add-candidate-form">
      <h2>Add a New Candidate</h2>
      <form onSubmit={handleAddCandidate}>
        <div>
          <label htmlFor="name">Candidate Name:</label>
          <input
            type="text"
            id="name"
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
            placeholder="Enter candidate's name"
          />
        </div>
        <div>
          <label htmlFor="party">Party:</label>
          <input
            type="text"
            id="party"
            value={candidateParty}
            onChange={(e) => setCandidateParty(e.target.value)}
            placeholder="Enter party name"
          />
        </div>
        <div>
          <label htmlFor="logo">Logo URL:</label>
          <input
            type="text"
            id="logo"
            value={candidateLogo}
            onChange={(e) => setCandidateLogo(e.target.value)}
            placeholder="Enter image URL for logo"
          />
        </div>
        <button type="submit">Add Candidate</button>
      </form>
    </div>
  );
};

export default AddCandidate;