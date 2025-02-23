import React, { useState, useEffect } from 'react';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, provider, db } from './firebase';  // Assuming you're already importing your firebase setup
import AddCandidate from './AddCandidate';  // Add the components for adding and displaying candidates
import CandidatesList from './CandidatesList';

function App() {
  const [user, setUser] = useState(null);

  const signIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        setUser(result.user);
      })
      .catch((error) => console.log(error));
  };

  const logOut = () => {
    signOut(auth)
      .then(() => setUser(null))
      .catch((error) => console.log(error));
  };

  // Optionally, you can fetch the user data when the component is mounted
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h1>Secure Voting App</h1>
      
      {/* User Authentication */}
      {user ? (
        <div>
          <p>Welcome, {user.displayName}</p>
          <button onClick={logOut}>Log Out</button>
          
          {/* Add Candidate Form and Candidates List for logged-in users */}
          <AddCandidate />
          <CandidatesList />
        </div>
      ) : (
        <button onClick={signIn}>Sign in with Google</button>
      )}
    </div>
  );
}

export default App;