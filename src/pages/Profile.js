import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const docRef = doc(db, 'students', auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      }
    };
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <div>
      <h2>Profile</h2>
      {userData ? (
        <div>
          <p><strong>Japanese Name:</strong> {userData.japaneseName}</p>
          <p><strong>Furigana:</strong> {userData.furigana}</p>
          <p><strong>English Name:</strong> {userData.englishLastName}, {userData.englishFirstName}</p>
          <p><strong>Grade:</strong> {userData.grade}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Student Gov Position:</strong> {userData.studentGov || 'None'}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Profile;
