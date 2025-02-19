import { NextResponse } from "next/server";
import path from "path";
import fsSync from "fs";

export async function GET(request) {
    const url = new URL(request.url);
    const email = url.searchParams.get("email");
    const fileType = url.searchParams.get("type"); // "pdf" or "zip"

    if (!email || !fileType) {
        return NextResponse.json({ error: "❌ Email and file type are required" }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), "public/uploads", email, fileType === "zip" ? "documents.zip" : "application_form.pdf");

    if (!fsSync.existsSync(filePath)) {
        return NextResponse.json({ error: `❌ ${fileType.toUpperCase()} file not found.` }, { status: 404 });
    }

    return NextResponse.json({ downloadUrl: `/uploads/${email}/${fileType === "zip" ? "documents.zip" : "application_form.pdf"}` });
}
