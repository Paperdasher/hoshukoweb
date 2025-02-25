import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';  // Import Firebase configuration
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';

const ManagePermissions = () => {
  const [users, setUsers] = useState([]);
  const [permissions, setPermissions] = useState({
    management: false,
    studentGov: false,
    createPost: false,
  });
  const [newUserEmail, setNewUserEmail] = useState("");  // New user email input
  const currentUserEmail = "admin@yourdomain.com"; // Replace with actual user email to check permissions

  // Fetch users and their permissions from Firestore
  useEffect(() => {
    const fetchPermissions = async () => {
      const usersSnapshot = await getDocs(collection(db, "permissions"));
      const usersData = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersData);
    };

    fetchPermissions();
  }, []);

  // Handle permission changes for existing users
  const handlePermissionChange = (userId, permissionKey, value) => {
    const userRef = doc(db, "permissions", userId);
    updateDoc(userRef, {
      [permissionKey]: value,
    });
  };

  // Handle adding new permissions for a user
  const handleAddPermission = async (userId) => {
    const userRef = doc(db, "permissions", userId);
    await updateDoc(userRef, permissions); // Apply all permissions at once
  };

  // Handle adding a new user with specified permissions
  const handleAddNewUser = async () => {
    if (newUserEmail) {
      try {
        // Add new user with default permissions
        await addDoc(collection(db, "permissions"), {
          userEmail: newUserEmail,
          management: permissions.management,
          studentGov: permissions.studentGov,
          createPost: permissions.createPost,
        });
        setNewUserEmail("");  // Clear the input field after adding
      } catch (error) {
        console.error("Error adding new user:", error);
      }
    }
  };

  // Handle deleting a user
  const handleDeleteUser = async (userId) => {
    try {
      const userRef = doc(db, "permissions", userId);
      await deleteDoc(userRef); // Deletes the user document
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="manage-permissions">
      <h2>ユーザー権限管理</h2>

      {/* New User Section */}
      <div className="add-new-user">
        <input
          type="email"
          placeholder="新しいユーザーのメールアドレス"
          value={newUserEmail}
          onChange={(e) => setNewUserEmail(e.target.value)}
        />
        <div>
          <label>
            管理ポータル:
            <input
              type="checkbox"
              checked={permissions.management}
              onChange={(e) => setPermissions({ ...permissions, management: e.target.checked })}
            />
          </label>
        </div>

        <div>
          <label>
            生徒会ポータル:
            <input
              type="checkbox"
              checked={permissions.studentGov}
              onChange={(e) => setPermissions({ ...permissions, studentGov: e.target.checked })}
            />
          </label>
        </div>

        <div>
          <label>
            投稿作成:
            <input
              type="checkbox"
              checked={permissions.createPost}
              onChange={(e) => setPermissions({ ...permissions, createPost: e.target.checked })}
            />
          </label>
        </div>

        <button onClick={handleAddNewUser}>新しいユーザーを追加</button>
      </div>

      {/* List of Users */}
      <div className="permissions-list">
        {users.map(user => {
          const isCurrentUser = user.userEmail === currentUserEmail;  // Check if the current user is the admin

          return (
            <div key={user.id} className="user-permissions">
              <h3>{user.userEmail}</h3>

              {/* Display and allow editing of permissions */}
              <div>
                <label>
                  管理ポータル:
                  <input
                    type="checkbox"
                    checked={isCurrentUser ? user.management : user.management} // Admin can toggle their own permissions
                    onChange={(e) => handlePermissionChange(user.id, 'management', e.target.checked)}
                  />
                </label>
              </div>

              <div>
                <label>
                  生徒会ポータル:
                  <input
                    type="checkbox"
                    checked={isCurrentUser ? user.studentGov : user.studentGov} // Admin can toggle their own permissions
                    onChange={(e) => handlePermissionChange(user.id, 'studentGov', e.target.checked)}
                  />
                </label>
              </div>

              <div>
                <label>
                  投稿作成:
                  <input
                    type="checkbox"
                    checked={isCurrentUser ? user.createPost : user.createPost} // Admin can toggle their own permissions
                    onChange={(e) => handlePermissionChange(user.id, 'createPost', e.target.checked)}
                  />
                </label>
              </div>

              {/* Button to update permissions */}
              <button onClick={() => handleAddPermission(user.id)}>権限を更新</button>

              {/* Button to delete user */}
              <button onClick={() => handleDeleteUser(user.id)}>ユーザーを削除</button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ManagePermissions;
