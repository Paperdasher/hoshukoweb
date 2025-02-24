import React, { useState } from "react";
import { db} from '../../firebase';
import { addDoc, collection } from 'firebase/firestore';

function CandidateApplication() {
  const [name, setName] = useState('');
  const [reason, setReason] = useState('');
  const [position, setPosition] = useState('');
  const [grade, setGrade] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !reason || !position || !grade) {
      alert("すべてのフィールドを入力してください。");
      return;
    }

    const candidateData = {
      name,
      reason,
      position,
      grade,
      status: 'pending', // Keep track of approval status
    };

    try {
      await addDoc(collection(db, "candidateApplications"), candidateData); // Store in temporary collection
      alert("申請が完了しました！");
      setName('');
      setReason('');
      setPosition('');
      setGrade('');
    } catch (error) {
      console.error("Error adding candidate application: ", error);
    }
  };

  return (
    <div>
      <h2>候補者申請</h2>
      <form onSubmit={handleSubmit}>
        <label>
          名前:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <br />
        <label>
          理由:
          <textarea value={reason} onChange={(e) => setReason(e.target.value)} required />
        </label>
        <br />
        <label>
          役職:
          <select value={position} onChange={(e) => setPosition(e.target.value)} required>
            <option value="">選択してください</option>
            <option value="会長">会長</option>
            <option value="副会長">副会長</option>
            <option value="書記">書記</option>
            <option value="会計">会計</option>
          </select>
        </label>
        <br />
        <label>
          学年:
          <select value={grade} onChange={(e) => setGrade(e.target.value)} required>
            <option value="">選択してください</option>
            <option value="中1">中1</option>
            <option value="中2">中2</option>
            <option value="中3">中3</option>
            <option value="高1">高1</option>
          </select>
        </label>
        <br />
        <button type="submit">申請する</button>
      </form>
    </div>
  );
}

export default CandidateApplication;
