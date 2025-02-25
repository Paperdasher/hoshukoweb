import React, { useState, useEffect } from "react";
import { db} from '../../firebase';
import { collection, query, onSnapshot, doc, deleteDoc } from "firebase/firestore";

const CandidatesList = () => {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "candidates"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const candidatesData = [];
      querySnapshot.forEach((doc) => {
        candidatesData.push({ id: doc.id, ...doc.data() });
      });
      setCandidates(candidatesData);
    });
    return () => unsubscribe();
  }, []);

  const handleDeleteCandidate = async (candidateId) => {
    try {
      await deleteDoc(doc(db, "candidates", candidateId));
      console.log("Candidate removed");
    } catch (error) {
      console.error("Error deleting candidate: ", error);
    }
  };

  return (
    <div>
      <h3>候補者リスト</h3>
      <ul>
        {candidates.map((candidate) => (
          <li key={candidate.id}>
            {candidate.name} ({candidate.position}, {candidate.grade}) - {candidate.votes}票
            <button onClick={() => handleDeleteCandidate(candidate.id)}>削除</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CandidatesList;
