import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, provider, db } from './firebase'; 
import { collection, getDocs, addDoc, deleteDoc, doc, onSnapshot, query, where } from 'firebase/firestore';
import AddCandidate from './AddCandidate';  
import CandidatesList from './CandidatesList';
import VotingPage from './VotingPage';
import CandidateApplication from './CandidateApplication';
import AdminApproval from './AdminApproval';
import './App.css'; // Ensure CSS is imported

function App() {
  const [user, setUser] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [allowedEmails, setAllowedEmails] = useState([]);
  const [newEmail, setNewEmail] = useState('');

  const placeholderEmail = 'seanyuto@gmail.com';

  const signIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (error) {
      console.log("Sign-in error:", error);
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setIsAuthorized(false);
    } catch (error) {
      console.log("Log-out error:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "allowedEmails"), (snapshot) => {
      const emails = snapshot.docs.map(doc => doc.data().email);
      setAllowedEmails(emails);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      checkAuthorization(user.email);
    }
  }, [user, allowedEmails]);

  const checkAuthorization = (email) => {
    setIsAuthorized(email === placeholderEmail || allowedEmails.includes(email));
  };

  const handleAddEmail = async () => {
    if (!newEmail) {
      alert("メールアドレスを入力してください。");
      return;
    }

    if (allowedEmails.includes(newEmail)) {
      alert("このメールアドレスはすでに許可されています。");
      return;
    }

    try {
      await addDoc(collection(db, "allowedEmails"), { email: newEmail });
      setNewEmail('');
    } catch (error) {
      console.error("Error adding email: ", error);
    }
  };

  const handleDeleteEmail = async (emailToDelete) => {
    if (emailToDelete === placeholderEmail) {
      alert("このメールアドレスは削除できません。");
      return;
    }

    try {
      const emailQuery = query(collection(db, "allowedEmails"), where("email", "==", emailToDelete));
      const querySnapshot = await getDocs(emailQuery);

      querySnapshot.forEach(async (docSnapshot) => {
        await deleteDoc(doc(db, "allowedEmails", docSnapshot.id));
      });
    } catch (error) {
      console.error("Error deleting email: ", error);
    }
  };

  return (
    <Router>
      <div>
        {/* Fixed Top Navigation Bar */}
        <div className="navbar">
          <div className="nav-links">
            <Link to="/">管理ページ</Link>
            <Link to="/vote">投票ページ</Link>
            <Link to="/candidate-application">候補者申請</Link>
            <Link to="/admin-approval">管理者承認</Link>
          </div>
          <div>
            {user ? (
              <button className="auth-button" onClick={logOut}>ログアウト</button>
            ) : (
              <button className="auth-button" onClick={signIn}>Googleでサインイン</button>
            )}
          </div>
        </div>

        <h1>生徒会選挙管理ページ</h1>

        {user ? (
          <div>
            <p>こんにちは、 {user.displayName}</p>

            <Routes>
              <Route path="/" element={
                isAuthorized ? (
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
                )
              } />
              <Route path="/vote" element={<VotingPage />} />
              <Route path="/candidate-application" element={<CandidateApplication />} />
              <Route path="/admin-approval" element={<AdminApproval />} />
            </Routes>
          </div>
        ) : (
          <p>サインインしてこのページにアクセスしてください。</p>
        )}
      </div>
    </Router>
  );
}

export default App;
