import React, { useEffect, useState } from 'react';
import { db } from './firebase'; // Make sure to import db
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore"; // Import necessary Firestore functions

const CandidatesList = () => {
  const [candidates, setCandidates] = useState([]);
  const [nameToDelete, setNameToDelete] = useState(''); // Store name for deletion input

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const candidatesCollection = collection(db, "candidates");
        const snapshot = await getDocs(candidatesCollection);
        const candidatesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCandidates(candidatesData);
      } catch (error) {
        console.error("Error fetching candidates: ", error);
      }
    };

    fetchCandidates();
  }, []);

  const handleDeleteByName = async (e) => {
    e.preventDefault();

    if (!nameToDelete) {
      alert("Please enter a name.");
      return;
    }

    try {
      const candidateToDelete = candidates.find(candidate => candidate.name === nameToDelete);

      if (!candidateToDelete) {
        alert("Candidate not found.");
        return;
      }

      await deleteDoc(doc(db, "candidates", candidateToDelete.id)); // Delete candidate by ID
      alert("Candidate deleted successfully!");

      // Update state by removing the deleted candidate
      setCandidates(candidates.filter(candidate => candidate.id !== candidateToDelete.id));
      setNameToDelete(''); // Clear input field
    } catch (error) {
      console.error("Error deleting candidate: ", error);
      alert("Error deleting candidate.");
    }
  };

  const handleDeleteByButtonClick = async (id) => {
    try {
      await deleteDoc(doc(db, "candidates", id)); // Delete candidate by ID
      alert("候補者の削除成功！");

      // Update state by removing the deleted candidate
      setCandidates(candidates.filter(candidate => candidate.id !== id));
    } catch (error) {
      console.error("候補者を削除できません: ", error);
      alert("候補者を削除できません。");
    }
  };

  return (
    <div className="candidates-list">
      <h2>候補者リスト</h2>

      {/* Input field to delete by name */}
      <div>
        <input
          type="text"
          value={nameToDelete}
          onChange={(e) => setNameToDelete(e.target.value)}
          placeholder="削除する候補者名"
        />
        <button onClick={handleDeleteByName}>名前で候補者を削除する</button>
      </div>

      {/* Display the candidates list */}
      {candidates.length === 0 ? (
        <p>まだ候補者がいません。</p>
      ) : (
        <ul>
          {candidates.map((candidate) => (
            <li key={candidate.id}>
              {candidate.picture && <img src={candidate.picture} alt={`${candidate.name} picture`} />}
              <h3>{candidate.name}</h3>
              <p>学年: {candidate.grade}</p>

              {/* Delete button */}
              <button onClick={() => handleDeleteByButtonClick(candidate.id)}>削除</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CandidatesList;
