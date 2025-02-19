import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import archiver from "archiver";

export async function GET(request) {
    try {
        const url = new URL(request.url);
        const email = url.searchParams.get("email");

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        const userFolder = path.join(process.cwd(), "public/uploads", email);

        if (!fs.existsSync(userFolder)) {
            return NextResponse.json({ error: "No files found for this user" }, { status: 404 });
        }

        const zipPath = path.join(process.cwd(), "public/uploads", `${email}.zip`);
        const output = fs.createWriteStream(zipPath);
        const archive = archiver("zip", { zlib: { level: 9 } });

        archive.pipe(output);
        archive.directory(userFolder, false);
        await archive.finalize();

        return NextResponse.json({ downloadUrl: `/uploads/${email}.zip` }, { status: 200 });

    } catch (error) {
        console.error("❌ Error Creating ZIP:", error);
        return NextResponse.json({ error: "❌ Failed to create ZIP" }, { status: 500 });
    }
}
