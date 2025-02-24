import { useState, useEffect } from "react";
import { db} from '../../firebase';
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

function Voting() {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    const fetchCandidates = async () => {
      const querySnapshot = await getDocs(collection(db, "candidates"));
      setCandidates(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchCandidates();
  }, []);

  const vote = async (id, votes) => {
    const candidateRef = doc(db, "candidates", id);
    await updateDoc(candidateRef, { votes: votes + 1 });
  };

  return (
    <div>
      <h2>Vote for a Candidate</h2>
      {candidates.map(candidate => (
        <div key={candidate.id}>
          <h3>{candidate.name}</h3>
          <p>Votes: {candidate.votes}</p>
          <button onClick={() => vote(candidate.id, candidate.votes)}>Vote</button>
        </div>
      ))}
    </div>
  );
}

export default Voting;