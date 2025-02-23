import React, { useState, useEffect } from 'react';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, provider, db } from './firebase'; 
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, increment } from 'firebase/firestore';
import AddCandidate from './AddCandidate';  
import CandidatesList from './CandidatesList';

function App() {
  const [user, setUser] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [allowedEmails, setAllowedEmails] = useState([]);
  const [newEmail, setNewEmail] = useState('');

  // Define your placeholder email
  const placeholderEmail = 'seanyuto@gmail.com';

  const signIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        setUser(result.user);
        checkAuthorization(result.user.email); 
      })
      .catch((error) => console.log(error));
  };

  const logOut = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
        setIsAuthorized(false);
      })
      .catch((error) => console.log(error));
  };

  // Modify checkAuthorization to always grant access to the placeholder email
  const checkAuthorization = (email) => {
    if (email === placeholderEmail || allowedEmails.includes(email)) {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
    }
  };

  const fetchAllowedEmails = async () => {
    const querySnapshot = await getDocs(collection(db, "allowedEmails"));
    const emails = querySnapshot.docs.map(doc => doc.data().email);
    setAllowedEmails(emails);
  };

  const handleAddEmail = async () => {
    if (user && allowedEmails.includes(user.email)) {
      // Only authorized users can add emails to the allowed list
      try {
        await addDoc(collection(db, "allowedEmails"), {
          email: newEmail
        });
        setNewEmail('');
        fetchAllowedEmails();  // Refresh the allowed emails list
      } catch (error) {
        console.error("Error adding email: ", error);
      }
    }
  };

  // Modify the function to prevent deletion of the placeholder email
  const handleDeleteEmail = async (emailToDelete) => {
    if (emailToDelete === placeholderEmail) {
      alert("This email cannot be deleted.");
      return;
    }

    // Find the document of the email to be deleted
    const querySnapshot = await getDocs(collection(db, "allowedEmails"));
    querySnapshot.forEach(async (docSnapshot) => {
      const docData = docSnapshot.data();
      if (docData.email === emailToDelete) {
        try {
          await deleteDoc(doc(db, "allowedEmails", docSnapshot.id));  // Delete the document
          fetchAllowedEmails();  // Refresh the allowed emails list after deletion
        } catch (error) {
          console.error("Error deleting email: ", error);
        }
      }
    });
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        fetchAllowedEmails();
        checkAuthorization(user.email);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h1>生徒会選挙管理ページ</h1>

      {user ? (
        <div>
          <p>こんにちは、 {user.displayName}</p>
          <button onClick={logOut}>ログアウト</button>

          {isAuthorized ? (
            <>
              <AddCandidate />
              <CandidatesList />

              <div>
                <h3>他のユーザーにアクセス権を付与</h3> 
                <input 
                  type="email" 
                  value={newEmail} 
                  onChange={(e) => setNewEmail(e.target.value)} 
                  placeholder="ユーザーのメールアドレスを入力" 
                />
                <button onClick={handleAddEmail}>メールアドレスを追加</button>
              </div>

              <div>
                <h3>許可されたユーザーの削除</h3>
                <ul>
                  {allowedEmails.map((email) => (
                    <li key={email}>
                      {email} 
                      <button onClick={() => handleDeleteEmail(email)}>削除</button>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <p>このページにアクセスする権限がありません。</p>
          )}
        </div>
      ) : (
        <button onClick={signIn}>Googleでサインイン</button>
      )}
    </div>
  );
}

export default App;
