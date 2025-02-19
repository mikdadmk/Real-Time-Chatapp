import { NextResponse } from "next/server";
import path from "path";
import fsSync from "fs";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get("email");

        if (!email) {
            return NextResponse.json({ error: "❌ Email is required." }, { status: 400 });
        }

        const pdfPath = path.join(process.cwd(), "public/uploads", email, "application_form.pdf");

        if (!fsSync.existsSync(pdfPath)) {
            return NextResponse.json({ error: "❌ PDF file not found." }, { status: 404 });
        }

        return NextResponse.json({ downloadUrl: `/uploads/${email}/application_form.pdf` }, { status: 200 });

    } catch (error) {
        console.error("❌ Error downloading PDF:", error);
        return NextResponse.json({ error: "❌ Internal server error" }, { status: 500 });
    }
}
