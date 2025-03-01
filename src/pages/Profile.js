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
        const docRef = doc(db, 'students', auth.currentUser.email); // Use email to fetch user data
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
          <p><strong>English Name:</strong> {userData.lastName}, {userData.firstName}</p> {/* Fixed field names */}
          <p><strong>Grade:</strong> {userData.grade}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Student Gov Position:</strong> {userData.studentGovPosition || 'None'}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Profile;
