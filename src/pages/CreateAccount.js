import React, { useState } from "react";
import { auth, db } from "../firebase"; // Import Firebase config
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";

const CreateAccount = () => {
  const [formData, setFormData] = useState({
    japaneseName: "",
    furigana: "",
    lastName: "",
    firstName: "",
    grade: "",
    email: "",
    studentGovPosition: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateEmail = (email) => {
    return email.endsWith("@nyshoshuko.org");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(formData.email)) {
      setError("学校のメールアドレス（@nyshoshuko.org）を入力してください。");
      return;
    }

    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, "temporaryPassword");
      const user = userCredential.user;

      // Store user info in Firestore
      const userRef = doc(collection(db, "students"), user.uid);
      await setDoc(userRef, {
        japaneseName: formData.japaneseName,
        furigana: formData.furigana,
        lastName: formData.lastName.toUpperCase(),
        firstName: formData.firstName,
        grade: formData.grade,
        email: formData.email,
        studentGovPosition: formData.studentGovPosition || null,
      });

      alert("アカウントが作成されました。ログインしてください。");
    } catch (err) {
      console.error("アカウント作成エラー:", err);
      setError("アカウントの作成に失敗しました。");
    }
  };

  return (
    <div className="create-account">
      <h2>アカウント作成</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          日本語氏名:
          <input type="text" name="japaneseName" value={formData.japaneseName} onChange={handleChange} required />
        </label>

        <label>
          ふりがな:
          <input type="text" name="furigana" value={formData.furigana} onChange={handleChange} required />
        </label>

        <label>
          姓 (Last Name in English):
          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
        </label>

        <label>
          名 (First Name in English):
          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
        </label>

        <label>
          学年 (Grade):
          <select name="grade" value={formData.grade} onChange={handleChange} required>
            <option value="">選択してください</option>
            <option value="1">1年生</option>
            <option value="2">2年生</option>
            <option value="3">3年生</option>
            <option value="4">4年生</option>
            <option value="5">5年生</option>
            <option value="6">6年生</option>
          </select>
        </label>

        <label>
          メールアドレス (@nyshoshuko.org のみ):
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </label>

        <label>
          生徒会役職 (任意):
          <input type="text" name="studentGovPosition" value={formData.studentGovPosition} onChange={handleChange} />
        </label>

        <button type="submit">アカウントを作成</button>
      </form>
    </div>
  );
};

export default CreateAccount;
