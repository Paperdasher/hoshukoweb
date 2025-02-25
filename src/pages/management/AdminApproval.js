import React, { useEffect, useState } from 'react';
import { db, auth } from '../../firebase';
import { collection, getDocs, deleteDoc, doc, addDoc } from 'firebase/firestore';

function AdminApproval() {
  const [requests, setRequests] = useState([]);
  const [user, setUser] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "candidateApplications")); // Fetch from correct collection
        setRequests(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("候補者のリクエストを取得できませんでした: ", error);
      }
    };

    fetchRequests();
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      if (user) {
        const allowedSnapshot = await getDocs(collection(db, "allowedEmails"));
        const allowedEmails = allowedSnapshot.docs.map(doc => doc.data().email);
        setIsAuthorized(allowedEmails.includes(user.email));
      }
    });
    return () => unsubscribe();
  }, []);

  const handleApprove = async (request) => {
    try {
      await addDoc(collection(db, "candidates"), {
        name: request.name,
        position: request.position,
        reason: request.reason,
        grade: request.grade,
        votes: 0
      });

      await deleteDoc(doc(db, "candidateApplications", request.id));
      setRequests(requests.filter(req => req.id !== request.id));
    } catch (error) {
      console.error("候補者の申請を許可できませんでした: ", error);
    }
  };

  const handleDeny = async (id) => {
    try {
      await deleteDoc(doc(db, "candidateApplications", id));
      setRequests(requests.filter(req => req.id !== id));
    } catch (error) {
      console.error("候補者の申請を却下できませんでした: ", error);
    }
  };

  if (!user) return <p>Loading...</p>;
  if (!isAuthorized) return <p>アクセスする権限はありません。</p>;

  return (
    <div>
      <h1>候補者申請の承認</h1>
      {requests.length === 0 ? <p>現在未確認の申し出はありません。</p> : (
        <ul>
          {requests.map(request => (
            <li key={request.id}>
              <p><strong>名前:</strong> {request.name}</p>
              <p><strong>役職:</strong> {request.position}</p>
              <p><strong>学年:</strong> {request.grade}</p>
              <p><strong>立候補の理由:</strong> {request.reason}</p>
              <button onClick={() => handleApprove(request)}>承認</button>
              <button onClick={() => handleDeny(request.id)}>却下</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AdminApproval;
