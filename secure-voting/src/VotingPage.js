import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, query, onSnapshot, addDoc } from 'firebase/firestore';

const POSITIONS = {
  "会長": 1,
  "副会長": 2,
  "書記": 2,
  "会計": 1
};

const VotingPage = () => {
  const [candidates, setCandidates] = useState({});
  const [votes, setVotes] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    // Fetch candidates grouped by position
    const q = query(collection(db, 'candidates'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const groupedCandidates = { "会長": [], "副会長": [], "書記": [], "会計": [] };
      querySnapshot.forEach((doc) => {
        const candidate = { id: doc.id, ...doc.data() };
        if (groupedCandidates[candidate.position]) {
          groupedCandidates[candidate.position].push(candidate);
        }
      });
      setCandidates(groupedCandidates);
    });

    return () => unsubscribe();
  }, []);

  // Handle vote selection (ranking or confidence vote)
  const handleVoteChange = (position, candidateId, value) => {
    setVotes((prev) => ({
      ...prev,
      [position]: { ...prev[position], [candidateId]: value }
    }));
  };

  // Submit votes
  const handleSubmit = async () => {
    if (submitted) {
      alert("You have already voted!");
      return;
    }

    try {
      await addDoc(collection(db, "votes"), {
        voter: userEmail,
        selections: votes,
        timestamp: new Date(),
      });

      setSubmitted(true);
      alert("Your vote has been recorded!");
    } catch (error) {
      console.error("Error submitting votes:", error);
    }
  };

  return (
    <div>
      <h1>投票ページ</h1>
      <p>各ポジションの候補者を順位付け、または信任投票をしてください。</p>

      {Object.keys(POSITIONS).map((position) => (
        <div key={position}>
          <h2>{position}</h2>
          {candidates[position] && candidates[position].length > 0 ? (
            <ul>
              {candidates[position].map((candidate) => (
                <li key={candidate.id}>
                  {candidate.name} ({candidate.grade}年)
                  {candidates[position].length === POSITIONS[position] ? (
                    // 信任投票 (Approve/Disapprove)
                    <select onChange={(e) => handleVoteChange(position, candidate.id, e.target.value)}>
                      <option value="">選択</option>
                      <option value="信任">信任</option>
                      <option value="不信任">不信任</option>
                    </select>
                  ) : (
                    // Ranked Choice Voting
                    <select onChange={(e) => handleVoteChange(position, candidate.id, e.target.value)}>
                      <option value="">順位を選択</option>
                      {[...Array(candidates[position].length)].map((_, i) => (
                        <option key={i} value={i + 1}>{i + 1}位</option>
                      ))}
                    </select>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>このポジションには候補者がいません。</p>
          )}
        </div>
      ))}

      <button onClick={handleSubmit} disabled={submitted}>投票を提出</button>
    </div>
  );
};

export default VotingPage;
