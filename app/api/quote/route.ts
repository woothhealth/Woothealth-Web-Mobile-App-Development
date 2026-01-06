import { NextResponse } from "next/server";
import { databases, account } from "../../../lib/appwrite";

const DATABASE_ID = "main";
const USERS_COLLECTION_ID = "users";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, firstName, lastName, phoneNumber, company, companyAddress, employeeNumber, state, message } = body;

    // Get the current user (must be logged in)
    const user = await account.get();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Update or create user document with business role
    const result = await databases.listDocuments(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      [`userId=${user.$id}`]
    );

    if (result.total > 0) {
      // Update existing user document to business role
      await databases.updateDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        result.documents[0].$id,
        {
          role: "business",
          company,
          companyAddress,
          employeeNumber,
          state,
          message,
          firstName,
          lastName,
          phoneNumber,
          email,
          updatedAt: new Date().toISOString(),
        }
      );
    } else {
      // Create new user document with business role
      await databases.createDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        "unique()",
        {
          userId: user.$id,
          role: "business",
          company,
          companyAddress,
          employeeNumber,
          state,
          message,
          firstName,
          lastName,
          phoneNumber,
          email,
          createdAt: new Date().toISOString(),
        }
      );
    }

    return NextResponse.json({ success: true, role: "business" });
  } catch (error: any) {
    console.error("Quote business role error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to assign business role." },
      { status: 400 }
    );
  }
}
