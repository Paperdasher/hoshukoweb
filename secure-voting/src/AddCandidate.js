import React, { useState } from 'react';
import { db } from './firebase'; // Make sure you're importing db
import { collection, addDoc } from "firebase/firestore"; // Firestore functions
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Firebase Storage functions

const AddCandidate = () => {
  const [candidateName, setCandidateName] = useState('');
  const [candidateGrade, setCandidateGrade] = useState('');
  const [candidatePicture, setCandidatePicture] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/jpg")) {
      setCandidatePicture(file); // Store the file to upload later
    } else {
      alert("写真（JPEG か JPG）をアップロードしてください。");
    }
  };

  const handleAddCandidate = async (e) => {
    e.preventDefault();

    if (!candidateName || !candidateGrade) {
      alert("全ての項目を記入してください。");
      return;
    }

    try {
      setUploading(true);

      // Add the candidate data to Firestore
      const candidatesCollection = collection(db, "candidates");
      await addDoc(candidatesCollection, {
        name: candidateName,
        grade: candidateGrade,
      });

      alert("候補者が追加されました。");
      setCandidateName('');
      setCandidateGrade('');
    } catch (error) {
      console.error("Firestoreへ追加できませんでした:", error);
      alert("候補者を追加できませんでした。");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="add-candidate-form">
      <h2>新たな候補者を追加する    </h2>
      <form onSubmit={handleAddCandidate}>
        <div>
          <label htmlFor="name">候補者名: </label>
          <input
            type="text"
            id="name"
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
            placeholder="候補者名を記入"
          />
        </div>
        <div>
          <label htmlFor="grade">学年: </label>
          <input
            type="text"
            id="grade"
            value={candidateGrade}
            onChange={(e) => setCandidateGrade(e.target.value)}
            placeholder="学年を記入"
          />
        </div>
        <button type="submit" disabled={uploading}>
          {uploading ? 'Uploading...' : '追加'}
        </button>
      </form>
    </div>
  );
};

export default AddCandidate;