import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';

const placeholderEmail = 'seanyuto@gmail.com';

function ManagementPortal() {
  const [emails, setEmails] = useState([]);
  const [newEmail, setNewEmail] = useState('');

  useEffect(() => {
    const fetchEmails = async () => {
      const querySnapshot = await getDocs(collection(db, "allowedEmails"));
      setEmails(querySnapshot.docs.map(doc => ({ id: doc.id, email: doc.data().email })));
    };

    fetchEmails();
  }, []);

  const addPermission = async () => {
    if (newEmail.trim() !== '' && !emails.some(e => e.email === newEmail)) {
      await addDoc(collection(db, "allowedEmails"), { email: newEmail });
      setEmails([...emails, { email: newEmail }]);
      setNewEmail('');
    }
  };

  const removePermission = async (id, email) => {
    if (email !== placeholderEmail) {
      await deleteDoc(doc(db, "allowedEmails", id));
      setEmails(emails.filter(e => e.id !== id));
    }
  };

  return (
    <div>
      <h2>管理ポータル</h2>
      <input 
        type="email" 
        placeholder="許可するメールアドレスを追加" 
        value={newEmail} 
        onChange={(e) => setNewEmail(e.target.value)} 
      />
      <button onClick={addPermission}>追加</button>
      
      <ul>
        {emails.map(({ id, email }) => (
          <li key={id}>
            {email} 
            {email !== placeholderEmail && <button onClick={() => removePermission(id, email)}>削除</button>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ManagementPortal;
