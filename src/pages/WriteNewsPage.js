import React, { useState } from 'react';
import { db } from '../../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const WriteNewsPage = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Add the news article to the 'news' collection in Firestore
      await addDoc(collection(db, 'news'), {
        title,
        author,
        text,
        date: new Date(),
      });

      // Redirect back to the news page after submission
      navigate('/news');
    } catch (error) {
      console.error('Error submitting news article: ', error);
    }
  };

  return (
    <div className="write-news">
      <h2>ニュース記事の作成</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>タイトル:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>著者:</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>
        <div>
          <label>記事内容:</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />
        </div>
        <button type="submit">記事を投稿</button>
      </form>
    </div>
  );
};

export default WriteNewsPage;
