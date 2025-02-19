import { NextResponse } from "next/server";
import db from "@/lib/mongodb"; // Assuming db is the connected database

export async function GET(req) {
  try {
    // Directly use the imported db
    const users = await db
      .collection("users")
      .find({}, { projection: { _id: 1, name: 1, email: 1, phone: 1, role: 1, files: 1 } })
      .toArray();

    if (!users || users.length === 0) {
      return NextResponse.json({ error: "No users found" }, { status: 404 });
    }

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
