import React, { useState } from "react";
import { db } from './firebase';
import { addDoc, collection } from "firebase/firestore";

const AddCandidate = () => {
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [grade, setGrade] = useState('');

  const handleAddCandidate = async () => {
    if (name && position && grade) {
      try {
        await addDoc(collection(db, "candidates"), {
          name: name,
          position: position,
          grade: grade,
          votes: 0, // Initializing votes to 0
        });
        setName('');
        setPosition('');
        setGrade('');
      } catch (error) {
        console.error("Error adding candidate: ", error);
      }
    }
  };

  return (
    <div>
      <h3>候補者を追加</h3>
      <input 
        type="text" 
        placeholder="名前"
        value={name}
        onChange={(e) => setName(e.target.value)} 
      />
      <input 
        type="text" 
        placeholder="役職"
        value={position}
        onChange={(e) => setPosition(e.target.value)} 
      />
      <input 
        type="text" 
        placeholder="学年"
        value={grade}
        onChange={(e) => setGrade(e.target.value)} 
      />
      <button onClick={handleAddCandidate}>追加</button>
    </div>
  );
};

export default AddCandidate;
