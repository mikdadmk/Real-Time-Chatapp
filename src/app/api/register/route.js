

import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { createUserWithEmailAndPassword } from "firebase/auth"; // Change here
import { auth } from "@/lib/firebase";
import db from "@/lib/mongodb";

export async function POST(request) {
  try {
    const formData = await request.formData();
    console.log("📤 Received registration data");

    // Extract fields from FormData
    const extractedData = {};
    for (const [key, value] of formData.entries()) {
      extractedData[key] = value;
    }

    const {
      name,
      fatherName,
      motherName,
      guardianName,
      relation,
      address,
      dob,
      phone,
      whatsapp,
      email,
      password,
      studiedBefore,
      prevInstitute,
      studyYears,
      lastMadrassaClass,
      lastSchoolClass,
    } = extractedData;

    // Ensure required fields are provided
    if (
      !name ||
      !fatherName ||
      !motherName ||
      !guardianName ||
      !relation ||
      !address ||
      !dob ||
      !phone ||
      !whatsapp ||
      !email ||
      !password
    ) {
      return NextResponse.json(
        { error: "❌ Missing required fields" },
        { status: 400 }
      );
    }

    // Handle file uploads (if any)
    const uploadFolder = path.join(process.cwd(), "public/uploads", email);
    await fs.mkdir(uploadFolder, { recursive: true });
    const filePaths = {};
    const fileFields = ["aadhaar", "tc", "pupilPhoto", "signature"];
    for (const key of fileFields) {
      const file = formData.get(key);
      if (file && file.name) {
        const filePath = path.join(uploadFolder, file.name);
        const fileBuffer = await file.arrayBuffer();
        await fs.writeFile(filePath, Buffer.from(new Uint8Array(fileBuffer)));
        filePaths[key] = `/uploads/${email}/${file.name}`;
      }
    }

    // Determine role based on existing users: 1st user is admin, 2nd is subadmin, others are user
    const userCount = await db.collection("users").countDocuments();
    const role = userCount === 0 ? "admin" : userCount === 1 ? "subadmin" : "user";

    // Create user in Firebase Authentication
    let user;
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      user = userCredential.user;
      console.log("✅ Firebase User Created:", user.uid);
    } catch (firebaseError) {
      return NextResponse.json({ error: firebaseError.message }, { status: 500 });
    }

    // Store admission details in MongoDB
    await db.collection("admissions").insertOne({
      uid: user.uid,
      name,
      fatherName,
      motherName,
      guardianName,
      relation,
      address,
      dob,
      phone,
      whatsapp,
      email,
      studiedBefore,
      prevInstitute: studiedBefore === "YES" ? prevInstitute : "",
      studyYears: studiedBefore === "YES" ? studyYears : "",
      lastMadrassaClass,
      lastSchoolClass,
      files: filePaths,
      createdAt: new Date(),
    });

    // Store user data in MongoDB
    await db.collection("users").insertOne({
      uid: user.uid,
      name,
      email,
      phone,
      role,
      files: filePaths,
      createdAt: new Date(),
    });

    return NextResponse.json(
      { message: "✅ Registration successful", role },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error Processing Registration:", error);
    return NextResponse.json(
      { error: "❌ Internal server error" },
      { status: 500 }
    );
  }
}
