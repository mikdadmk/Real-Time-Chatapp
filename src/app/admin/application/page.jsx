"use client";

import { useEffect, useState } from "react";

export default function ApplicationPage() {
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

    const handleDownloadPDF = async (email) => {
        try {
            const response = await fetch(`/api/generate-pdf?email=${email}`);
            const data = await response.json();
    
            if (data.pdfUrl) {  // ✅ Check for pdfUrl instead of downloadUrl
                window.open(data.pdfUrl, "_blank");
            } else {
                alert("❌ PDF file not found.");
            }
        } catch (error) {
            console.error("❌ Download Error:", error);
            alert("❌ Failed to generate PDF.");
        }
    };
    

    return (
        <div className="p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold mb-6">Download Application Forms</h1>
            {error && <p className="text-red-500">{error}</p>}
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th>Email</th>
                        <th>Download</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.email}>
                            <td>{user.email}</td>
                            <td>
                                <button 
                                    className="bg-green-500 text-white px-4 py-2 rounded"
                                    onClick={() => handleDownloadPDF(user.email)}
                                >
                                    Download PDF
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
