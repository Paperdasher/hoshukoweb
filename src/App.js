import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, provider, db } from './firebase'; 
import { collection, getDocs, addDoc, deleteDoc, doc, onSnapshot, query, where } from 'firebase/firestore';

import HomePage from './pages/HomePage';
import NewsPage from './pages/NewsPage';
import SurveyPage from './pages/SurveyPage';
import ContactPage from './pages/ContactPage';
import StudentGovernmentPortal from './pages/StudentGovernmentPortal';

import AddCandidate from './pages/election-portal/AddCandidate';
import Voting from './pages/election-portal/Voting';
import VotingPage from './pages/election-portal/VotingPage';
import CandidateApplication from './pages/election-portal/CandidateApplication';
import AdminApproval from './pages/election-portal/AdminApproval';
import CandidatesList from './pages/election-portal/CandidatesList';

import './App.css';

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
      console.log("サインインエラー:", error);
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setIsAuthorized(false);
    } catch (error) {
      console.log("ログアウトエラー:", error);
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

  return (
    <Router>
      <div>
        {/* Navigation Bar */}
        <div className="navbar">
          <div className="nav-links">
            <Link to="/">ホームページ</Link>
            <Link to="/news">ニュース</Link>
            <Link to="/survey">アンケート</Link>
            <div className="dropdown">
              <Link to="/portal" className="dropbtn">選挙ポータル</Link>
              <div className="dropdown-content">
                <Link to="/portal/voting">投票ページ</Link>
                <Link to="/portal/voting-management">投票管理ページ</Link>
                <Link to="/portal/request-run">立候補ページ</Link>
                <Link to="/portal/request-viewing">立候補者閲覧ページ</Link>
              </div>
            </div>
            <Link to="/contact">お問い合わせ</Link>
            {isAuthorized && <Link to="/student-gov-portal">生徒会ポータル</Link>}
          </div>
          <div>
            {user ? (
              <button className="auth-button" onClick={logOut}>ログアウト</button>
            ) : (
              <button className="auth-button" onClick={signIn}>Googleでサインイン</button>
            )}
          </div>
        </div>

        {/* Page Routes */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/survey" element={<SurveyPage />} />
          <Route path="/portal" element={<VotingPage />} />
          <Route path="/portal/voting" element={<Voting />} />
          <Route path="/portal/voting-management" element={<AdminApproval />} />
          <Route path="/portal/request-run" element={<CandidateApplication />} />
          <Route path="/portal/request-viewing" element={<CandidatesList />} />
          <Route path="/contact" element={<ContactPage />} />
          {isAuthorized && <Route path="/student-gov-portal" element={<StudentGovernmentPortal />} />}
          <Route path="*" element={<h2>404 - ページが見つかりませんでした</h2>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
