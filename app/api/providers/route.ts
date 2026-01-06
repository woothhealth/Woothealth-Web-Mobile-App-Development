import { NextResponse } from "next/server";
import { databases } from "../../../lib/appwrite";

export async function GET() {
  try {
    const DATABASE_ID = "main";
    const PROVIDERS_COLLECTION_ID = "providers";
    // Fetch all provider documents
    const result = await databases.listDocuments(
      DATABASE_ID,
      PROVIDERS_COLLECTION_ID
    );
    return NextResponse.json({ providers: result.documents });
  } catch (error: any) {
    console.error("Appwrite providers error:", error);
    return NextResponse.json(
      { error: "Failed to fetch providers. Please try again later." },
      { status: 500 }
    );
  }
}
