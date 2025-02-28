import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, provider, db } from './firebase'; // Make sure firebase.js is in the src folder
import { collection, doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore';

import HomePage from './pages/HomePage';
import NewsPage from './pages/NewsPage';
import SurveyPage from './pages/SurveyPage';
import ContactPage from './pages/ContactPage';
import StudentGovernmentPortal from './pages/StudentGovernmentPortal';
import ManagementPortal from './pages/management/ManagementPortal';
import AdminApproval from './pages/management/AdminApproval';
import CandidatesList from './pages/management/CandidatesList';
import ManagePermissions from './pages/management/ManagePermissions';
import StudentRoster from './pages/management/StudentRoster'; // Updated import to match correct filename
import Profile from './pages/Profile';
import CreateAccount from './pages/CreateAccount';

import VotingPage from './pages/election-portal/VotingPage';
import CandidateApplication from './pages/election-portal/CandidateApplication';

import './App.css';

function App() {
  const placeholderEmail = 'seanyuto@gmail.com';
  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [allowedEmails, setAllowedEmails] = useState([placeholderEmail]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "allowedEmails"), (snapshot) => {
      const emails = snapshot.docs.map(doc => doc.data().email);
      setAllowedEmails(prevEmails => [...prevEmails, ...emails]);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      checkAuthorization(user.email);
      fetchUserInfo(user.email);
    }
  }, [user, allowedEmails]);

  const checkAuthorization = (email) => {
    setIsAuthorized(allowedEmails.includes(email));
  };

  const fetchUserInfo = async (email) => {
    const userDoc = await getDoc(doc(db, "students", email));
    if (userDoc.exists()) {
      setUserInfo(userDoc.data());
    } else {
      setUserInfo(null);
    }
  };

  const signIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const signedInUser = result.user;
      setUser(signedInUser);
      checkAuthorization(signedInUser.email);
      
      // Check if user info exists, otherwise prompt to complete profile
      const userDoc = await getDoc(doc(db, "students", signedInUser.email));
      if (!userDoc.exists()) {
        await setDoc(doc(db, "students", signedInUser.email), {
          email: signedInUser.email,
          nameJapanese: "",
          furigana: "",
          nameEnglishLast: "",
          nameEnglishFirst: "",
          grade: "",
          studentGovPosition: "",
        });
        setUserInfo(null);
      } else {
        setUserInfo(userDoc.data());
      }
    } catch (error) {
      console.log("サインインエラー:", error);
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserInfo(null);
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
          {/* Replaced "ホームページ" with the logo image */}
          <Link to="/" className="logo-link">
            <img src="/../logonew.png" alt="Logo" className="logo-image" />
          </Link>
          <Link to="/news">ニュース</Link>
          <Link to="/survey">アンケート</Link>

          {/* Election Portal Dropdown */}
          <div className="dropdown">
            <Link to="/portal" className="dropbtn">選挙ポータル</Link>
            <div className="dropdown-content">
              <Link to="/portal/voting-page">投票</Link>
              <Link to="/portal/request-run">立候補申し出</Link>
            </div>
          </div>

          {isAuthorized && <Link to="/student-gov-portal">生徒会ポータル</Link>}

          {/* Management Portal Dropdown */}
          {isAuthorized && (
            <div className="dropdown">
              <Link to="/management" className="dropbtn">管理ポータル</Link>
              <div className="dropdown-content">
                <Link to="/management/election">選挙</Link>
                <Link to="/management/request">立候補申請</Link>
                <Link to="/management/permissions">ユーザー権限</Link>
                <Link to="/management/roster">生徒名簿</Link>
              </div>
            </div>
          )}

            <Link to="/contact">お問い合わせ</Link>
          </div>

          {/* User Dropdown or Sign-in Button */}
          <div className="auth-section">
            {user ? (
              <div className="user-dropdown">
                <button className="dropbtn">ようこそ, {userInfo?.nameJapanese || user.email}</button>
                <div className="dropdown-content">
                  <Link to="/profile">プロフィール</Link>
                  <button onClick={logOut}>ログアウト</button>
                </div>
              </div>
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
          {isAuthorized && <Route path="/management/permissions" element={<ManagePermissions />} />}
          {isAuthorized && <Route path="/management/roster" element={<StudentRoster />} />}

          {isAuthorized && <Route path="/student-gov-portal" element={<StudentGovernmentPortal />} />}
          
          {/* Profile Page */}
          <Route path="/profile" element={<Profile />} />
          
          {/* Create Account Page (Only Show If User Info Is Missing) */}
          {user && !userInfo && <Route path="*" element={<CreateAccount />} />}

          <Route path="*" element={<h2>404 - ページが見つかりませんでした</h2>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
