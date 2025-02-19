


"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "@fontsource/anek-malayalam";
import "@fontsource/poppins";

// Navbar Component (same as your sample)
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-500 backdrop-blur-lg shadow-lg ${
        scrolled ? "bg-green-800/60 py-1" : "bg-transparent py-3"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-center">
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="relative w-8 h-8 overflow-hidden rounded-lg shadow-lg">
            <Image
              src="/images/Logo.png"
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              alt="Islamic Dawa Academy Logo"
              priority
            />
          </div>
          <span className="text-lg font-semibold text-white font-['Poppins'] tracking-wide">
            Islamic Dawa Academy
          </span>
        </Link>
      </div>
    </nav>
  );
};

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    whatsapp: "",
    fatherName: "",
    motherName: "",
    guardianName: "",
    relation: "",
    address: "",
    dob: "",
    studiedBefore: "NO",
    prevInstitute: "",
    studyYears: "",
    lastMadrassaClass: "",
    lastSchoolClass: ""
  });
  
  const [files, setFiles] = useState({
    aadhaar: null,
    tc: null,
    pupilPhoto: null,
    signature: null
  });
  
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === "file") {
      setFiles((prev) => ({ ...prev, [name]: e.target.files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
  
    // Prepare form data for submission
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });
    Object.entries(files).forEach(([key, file]) => {
      if (file) {
        formDataToSend.append(key, file);
      }
    });
  
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        body: formDataToSend,
      });
      const data = await response.json();
      if (response.ok) {
        setMessage("✅ Registration successful!");
        router.push("/login");
      } else {
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setMessage("❌ Error submitting registration");
      console.error("❌ Submission Error:", error);
    }
    setLoading(false);
  };
  
  return (
    <div className="bg-gradient-to-b from-green-900 to-green-800 text-white min-h-screen">
      <Navbar />
      <section className="container mx-auto px-6 py-24">
        <h2 className="text-5xl font-bold mb-8 text-center font-['Poppins'] text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-200">
          Register
        </h2>
        {message && <p className="text-center text-lg font-semibold text-red-500">{message}</p>}
        <form onSubmit={handleSubmit} className="bg-green-700/50 p-8 rounded-2xl shadow-xl max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic User Information */}
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              required
              onChange={handleChange}
              className="p-3 border rounded bg-white/10 text-white"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              onChange={handleChange}
              className="p-3 border rounded bg-white/10 text-white"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              onChange={handleChange}
              className="p-3 border rounded bg-white/10 text-white"
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              required
              onChange={handleChange}
              className="p-3 border rounded bg-white/10 text-white"
            />
            <input
              type="text"
              name="whatsapp"
              placeholder="WhatsApp Number"
              required
              onChange={handleChange}
              className="p-3 border rounded bg-white/10 text-white"
            />
  
            {/* Additional Admission Details */}
            <input
              type="text"
              name="fatherName"
              placeholder="Father's Name"
              required
              onChange={handleChange}
              className="p-3 border rounded bg-white/10 text-white"
            />
            <input
              type="text"
              name="motherName"
              placeholder="Mother's Name"
              required
              onChange={handleChange}
              className="p-3 border rounded bg-white/10 text-white"
            />
            <input
              type="text"
              name="guardianName"
              placeholder="Guardian's Name"
              required
              onChange={handleChange}
              className="p-3 border rounded bg-white/10 text-white"
            />
            <input
              type="text"
              name="relation"
              placeholder="Relation"
              required
              onChange={handleChange}
              className="p-3 border rounded bg-white/10 text-white"
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              required
              onChange={handleChange}
              className="p-3 border rounded bg-white/10 text-white"
            />
            <input
              type="date"
              name="dob"
              placeholder="Date of Birth"
              required
              onChange={handleChange}
              className="p-3 border rounded bg-white/10 text-white"
            />
            <input
              type="text"
              name="lastMadrassaClass"
              placeholder="Last Class in Madrassa"
              required
              onChange={handleChange}
              className="p-3 border rounded bg-white/10 text-white"
            />
            <input
              type="text"
              name="lastSchoolClass"
              placeholder="Last Class in School"
              required
              onChange={handleChange}
              className="p-3 border rounded bg-white/10 text-white"
            />
  
            {/* File Upload Fields */}
            {["aadhaar", "tc", "pupilPhoto", "signature"].map((field) => (
              <label key={field} className="text-white">
                {field.charAt(0).toUpperCase() + field.slice(1)}:
                <input
                  type="file"
                  name={field}
                  onChange={handleChange}
                  className="block text-white mt-1"
                />
              </label>
            ))}
  
            {/* Studied Before Dropdown */}
            <label className="text-white">
              Studied in any institution before?:
              <select
                name="studiedBefore"
                onChange={handleChange}
                className="p-2 rounded-md bg-white/10 border text-white mt-1"
              >
                <option value="NO">NO</option>
                <option value="YES">YES</option>
              </select>
            </label>
            {formData.studiedBefore === "YES" && (
              <>
                <input
                  type="text"
                  name="prevInstitute"
                  placeholder="Previous Institute"
                  onChange={handleChange}
                  className="p-3 border rounded bg-white/10 text-white"
                />
                <input
                  type="text"
                  name="studyYears"
                  placeholder="Years of Study"
                  onChange={handleChange}
                  className="p-3 border rounded bg-white/10 text-white"
                />
              </>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-6 bg-green-500 hover:bg-green-400 text-white font-bold py-4 px-8 rounded-xl shadow-xl"
          >
            {loading ? "Submitting..." : "Register"}
          </button>
        </form>
      </section>
    </div>
  );
}
