import React, { useState } from "react";
import { auth, db } from "../firebase"; // Import Firebase config
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom"; // Import navigate

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
  const navigate = useNavigate();

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
      // Store user info in Firestore (without re-creating the authentication user)
      const user = auth.currentUser; // Use the logged-in user
      const userRef = doc(db, "students", user.email); // Use the email for Firestore document reference
      await setDoc(userRef, {
        japaneseName: formData.japaneseName,
        furigana: formData.furigana,
        lastName: formData.lastName.toUpperCase(),
        firstName: formData.firstName,
        grade: formData.grade,
        email: formData.email,
        studentGovPosition: formData.studentGovPosition || null,
      });

      alert("アカウントが作成されました。");
      navigate("/"); // Redirect to homepage or dashboard after successful profile creation
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
          LAST NAME IN ENGLISH(ex. Takahashi):
          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
        </label>

        <label>
          FIRST NAME IN ENGLISH(ex. Yuto):
          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
        </label>

        <label>
          学年 (Grade):
          <select name="grade" value={formData.grade} onChange={handleChange} required>
            <option value="">選択してください</option>
            <option value="1">中1</option>
            <option value="2">中2</option>
            <option value="3">中3</option>
            <option value="4">高1</option>
            <option value="5">高2</option>
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
