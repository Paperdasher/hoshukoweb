import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Use Link to navigate to WriteNewsPage
import { db, auth } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import './NewsPage.css';

function NewsPage() {
  const [canPostNews, setCanPostNews] = useState(false);

  useEffect(() => {
    const checkUserPermissions = async () => {
      const user = auth.currentUser;
      if (user) {
        // Check if the user has the permission to post news
        const permissionsDoc = await getDoc(doc(db, 'permissions', user.email));
        if (permissionsDoc.exists()) {
          const permissions = permissionsDoc.data();
          setCanPostNews(permissions.canPostNews);
        }
      }
    };

    checkUserPermissions();
  }, []);

  return (
    <div>
      <h1>補習校ニュース</h1>
      <p>補習校で起こっているイベントについてもっと知ろう！</p>

      {/* Display the "Write News" button only if the user has permission */}
      {canPostNews && (
        <Link to="/write-news">
          <button>ニュース記事を書く</button>
        </Link>
      )}
    </div>
  );
}

export default NewsPage;
