"use client"
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { toast } from "react-toastify";

interface User {
  _id: string;
  username: string;
  email: string;
}

export default function ManageUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null); // Tracks the user to be deleted
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Modal for delete user
  const [showRegisterModal, setShowRegisterModal] = useState(false); // Modal for register new user
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
  });
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/admin");
        setUsers(response.data.users); // Adjusted to match the response structure
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const deleteUser = async () => {
    if (selectedUser) {
      try {
        await axios.delete("/api/admin", { data: { id: selectedUser._id } });
        setUsers(users.filter((user) => user._id !== selectedUser._id));
        setShowDeleteModal(false);
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const openDeleteModal = (user: User) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedUser(null);
  };

  const openRegisterModal = () => {
    setShowRegisterModal(true);
  };

  const closeRegisterModal = () => {
    setShowRegisterModal(false);
  };

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onSignup = async () => {
    try {
      // Signup request without _id, the server should handle adding the _id
      const response = await axios.post("/api/admin/signup", {
        username: newUser.username,
        email: `${newUser.username}@lapor.com`, // Use dynamic email
        password: newUser.password,
      });
      toast.success(`Signup successful for ${newUser.username}`, {
        position: "top-right",
      });

      // Add the new user to the list without redirecting
      closeRegisterModal(); // Close the register modal after successful signup
    } catch (error) {
      console.error("Signup failed", error);
      toast.error(`Error occurred when trying to create an account!`, {
        position: "top-right",
      });
    }
  };

  return (
    <div>
      <Navbar />
      <div className={`container mx-auto py-8 text-black ${showDeleteModal || showRegisterModal ? "blur-sm" : ""} p-4`}>
        <h1 className="text-3xl font-bold text-center mb-8">Manage Admins</h1>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by username"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Button to open register user modal */}
        <button
          onClick={openRegisterModal}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        >
          Register New User
        </button>

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b border-gray-200">Username</th>
                  <th className="py-2 px-4 border-b border-gray-200">Email</th>
                  <th className="py-2 px-4 border-b border-gray-200">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td className="py-2 px-4 border-b border-gray-200">{user.username}</td>
                    <td className="py-2 px-4 border-b border-gray-200">{user.email}</td>
                    <td className="py-2 px-4 border-b border-gray-200">
                      <button
                        onClick={() => openDeleteModal(user)}
                        className="bg-red-500 text-white px-4 py-2 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete user modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 text-black">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4 text-left">
              Are you sure you want to delete this user [{selectedUser?.username}]?
            </h2>
            <p className="mb-4 text-left">This action cannot be undone.</p>
            <div className="flex justify-end">
              <button
                onClick={deleteUser}
                className="bg-red-500 text-white px-4 py-2 rounded mr-4"
              >
                I'm Sure
              </button>
              <button
                onClick={closeDeleteModal}
                className="bg-gray-300 text-black px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Register new user modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 text-black">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Register New User</h2>
            <input
              type="text"
              placeholder="Username"
              value={newUser.username}
              onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
              className="w-full p-2 mb-4 border border-gray-300 rounded-md"
            />
            <input
              type="password"
              placeholder="Password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              className="w-full p-2 mb-4 border border-gray-300 rounded-md"
            />
            <div className="flex justify-end">
              <button
                onClick={onSignup}
                className="bg-blue-500 text-white px-4 py-2 rounded mr-4"
              >
                Register
              </button>
              <button
                onClick={closeRegisterModal}
                className="bg-gray-300 text-black px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
