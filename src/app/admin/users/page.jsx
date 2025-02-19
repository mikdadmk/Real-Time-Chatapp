"use client";

import { useEffect, useState } from "react";

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch("/api/admin/users");
                if (!response.ok) {
                    throw new Error("Failed to fetch users");
                }
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error("❌ Error fetching users:", error);
                setError("Error fetching users. Please try again later.");
            }
        };
        fetchUsers();
    }, []);

    const handleDownloadZip = async (email) => {
        try {
            const response = await fetch(`/api/admin/download?email=${email}`);
            const data = await response.json();
            if (data.downloadUrl) {
                window.open(data.downloadUrl, "_blank");
            } else {
                alert("❌ No files found for this user.");
            }
        } catch (error) {
            console.error("❌ Download Error:", error);
            alert("❌ Failed to download files.");
        }
    };

    return (
        <div className="p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold mb-6">Registered Users</h1>
            {error && <p className="text-red-500">{error}</p>}
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border border-gray-300 p-2">User Name</th>
                        <th className="border border-gray-300 p-2">Email</th>
                        <th className="border border-gray-300 p-2">Contact</th>
                        <th className="border border-gray-300 p-2">Role</th>
                        <th className="border border-gray-300 p-2">Files</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length > 0 ? (
                        users.map((user) => (
                            <tr key={user._id} className="text-center">
                                <td className="border border-gray-300 p-2">{user.name}</td>
                                <td className="border border-gray-300 p-2">{user.email}</td>
                                <td className="border border-gray-300 p-2">{user.phone}</td>
                                <td className="border border-gray-300 p-2">{user.role}</td>
                                <td className="border border-gray-300 p-2">
                                    {user.files ? (
                                        <>
                                            {Object.entries(user.files).map(([key, url]) => (
                                                <a key={key} href={url} download className="text-blue-500 hover:underline ml-2">
                                                    {key.toUpperCase()}
                                                </a>
                                            ))}
                                            <button
                                                className="ml-4 bg-blue-500 text-white px-3 py-1 rounded"
                                                onClick={() => handleDownloadZip(user.email)}
                                            >
                                                Download All (ZIP)
                                            </button>
                                        </>
                                    ) : (
                                        <span className="text-gray-500">No files</span>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center p-4">No users found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
