import React, { useState, useEffect } from 'react';
import { db, auth } from '../../firebase'; // Ensure auth is imported from Firebase
import { collection, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const StudentRoster = () => {
  const [students, setStudents] = useState([]);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Function to check user authentication and permissions
  const checkUserAuth = async () => {
    const user = auth.currentUser; // Get the currently authenticated user from Firebase
    setCurrentUser(user);

    if (user) {
      // Check if the user has the 'studentGov' permission from the 'permissions' collection in Firestore
      const userPermissionsDoc = await getDoc(doc(db, 'permissions', user.email));
      if (userPermissionsDoc.exists()) {
        const permissions = userPermissionsDoc.data();
        if (permissions.studentGov) {
          setIsAuthorized(true); // User is authorized to access this page
        } else {
          setIsAuthorized(false); // User does not have the necessary permissions
        }
      } else {
        setIsAuthorized(false); // No permissions found for the user
      }
    } else {
      setIsAuthorized(false); // No user logged in
    }
  };

  useEffect(() => {
    checkUserAuth(); // Check user auth and permissions on mount
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      if (isAuthorized) {
        const studentsSnapshot = await getDocs(collection(db, 'students'));
        const studentsData = studentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Sort students by grade and then by last name
        studentsData.sort((a, b) => {
          if (a.grade !== b.grade) return a.grade - b.grade;
          return a.lastName.localeCompare(b.lastName);
        });

        setStudents(studentsData);
      }
    };
    fetchStudents();
  }, [isAuthorized]);

  const handleEdit = async (studentId, field, value) => {
    const studentRef = doc(db, 'students', studentId);
    await updateDoc(studentRef, { [field]: value });
  };

  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      const signedInUser = result.user;
      setCurrentUser(signedInUser);
      // Check permissions after successful sign-in
      checkUserAuth();
    } catch (error) {
      console.log("Sign-in error:", error);
    }
  };

  return (
    <div className="student-roster">
      <h2>学生名簿</h2>

      {!currentUser ? (
        <button onClick={handleSignIn}>Googleでサインイン</button>
      ) : !isAuthorized ? (
        <p>あなたにはこのページへのアクセス権限がありません。</p>
      ) : (
        students.reduce((grouped, student) => {
          if (!grouped[student.grade]) grouped[student.grade] = [];
          grouped[student.grade].push(student);
          return grouped;
        }, {})
      )}

      {Object.entries(students.reduce((grouped, student) => {
        if (!grouped[student.grade]) grouped[student.grade] = [];
        grouped[student.grade].push(student);
        return grouped;
      }, {})).map(([grade, students]) => (
        <div key={grade}>
          <h3>Grade {grade}</h3>
          {students.map(student => (
            <div key={student.id} className="student-entry">
              <span>
                {student.japaneseName}（{student.furigana}; {student.lastName.toUpperCase()}, {student.firstName.toUpperCase()}）: {student.email}
              </span>
              {isAuthorized && (
                <button onClick={() => handleEdit(student.id, 'correctedField', 'newValue')}>
                  編集
                </button>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default StudentRoster;
