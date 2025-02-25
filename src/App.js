import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, provider, db } from './firebase'; 
import { collection, onSnapshot } from 'firebase/firestore';

import HomePage from './pages/HomePage';
import NewsPage from './pages/NewsPage';
import SurveyPage from './pages/SurveyPage';
import ContactPage from './pages/ContactPage';
import StudentGovernmentPortal from './pages/StudentGovernmentPortal';
import ManagementPortal from './pages/management/ManagementPortal';
import AdminApproval from './pages/management/AdminApproval';
import CandidatesList from './pages/management/CandidatesList';

import VotingPage from './pages/election-portal/VotingPage';
import CandidateApplication from './pages/election-portal/CandidateApplication';

import './App.css';

function App() {
  const placeholderEmail = 'seanyuto@gmail.com';  // Declare placeholderEmail before using it
  const [user, setUser] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [allowedEmails, setAllowedEmails] = useState([placeholderEmail]); // Initialize with placeholder email

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "allowedEmails"), (snapshot) => {
      const emails = snapshot.docs.map(doc => doc.data().email);
      setAllowedEmails(prevEmails => [...prevEmails, ...emails]); // Add fetched emails to allowed list
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      checkAuthorization(user.email);
    }
  }, [user, allowedEmails]);

  const checkAuthorization = (email) => {
    setIsAuthorized(allowedEmails.includes(email));
  };

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

  return (
    <Router>
      <div>
        {/* Navigation Bar */}
        <div className="navbar">
          <div className="nav-links">
            <Link to="/">ホームページ</Link>
            <Link to="/news">ニュース</Link>
            <Link to="/survey">アンケート</Link>

            {/* Election Portal Dropdown */}
            <div className="dropdown">
              <Link to="/portal" className="dropbtn">選挙ポータル</Link>
              <div className="dropdown-content">
                <Link to="/portal/voting-page">投票ページ</Link>
                <Link to="/portal/request-run">立候補ページ</Link>
              </div>
            </div>

            {/* New Management Portal Dropdown (Only for Authorized Users) */}
            {isAuthorized && (
              <div className="dropdown">
                <Link to="/management" className="dropbtn">管理ポータル</Link>
                <div className="dropdown-content">
                  <Link to="/management/election">選挙管理</Link>
                  <Link to="/management/request">立候補申請管理</Link>
                </div>
              </div>
            )}

            {isAuthorized && <Link to="/student-gov-portal">生徒会ポータル</Link>}
            <Link to="/contact">お問い合わせ</Link>

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
          <Route path="/portal/voting-page" element={<VotingPage />} />
          <Route path="/portal/request-run" element={<CandidateApplication />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Management Portal Routes */}
          {isAuthorized && <Route path="/management" element={<ManagementPortal />} />}
          {isAuthorized && <Route path="/management/election" element={<CandidatesList />} />}
          {isAuthorized && <Route path="/management/request" element={<AdminApproval />} />}
          
          {isAuthorized && <Route path="/student-gov-portal" element={<StudentGovernmentPortal />} />}
          <Route path="*" element={<h2>404 - ページが見つかりませんでした</h2>} />
        </Routes>
      </div>
    </Router>
  );
}




export default App;
