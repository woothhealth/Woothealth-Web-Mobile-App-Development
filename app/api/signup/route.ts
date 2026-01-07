import { NextResponse } from "next/server";
import { account } from "../../../lib/appwrite";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, firstName, lastName, phoneNumber, state, address, age, check } = body;
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    // Register user with Appwrite
    const user = await account.create({
      userId: 'unique()',
      email,
      password,
      name: firstName ? `${firstName} ${lastName || ''}`.trim() : undefined,
    });
// let us test this out locally with my server
// okay
    // Store user data in Appwrite collection (users) with only registration form fields
    const { databases } = await import("../../../lib/appwrite");
    const DATABASE_ID = "main";
    const USERS_COLLECTION_ID = "users";
    await databases.createDocument(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      "unique()",
      {
        userId: user.$id,
        email,
        firstName,
        lastName,
        phoneNumber,
        state,
        address,
        age,
        check,
        createdAt: new Date().toISOString(),
      }
    );

    return NextResponse.json({
      message: "Registration successful! Please log in to continue.",
      success: true,
    });
  } catch (error: any) {
    // Log the real error for debugging
    console.error("Appwrite signup error:", error);
    // User-friendly error message
    let userMessage = "Something went wrong during registration. Please check your details and try again.";
    if (error?.message?.includes("already exists")) {
      userMessage = "An account with this email already exists. Please log in or use a different email.";
    } else if (error?.message?.includes("missing scopes")) {
      userMessage = "Registration failed due to a server permission issue. Please contact support if this persists.";
    }
    return NextResponse.json(
      { error: userMessage },
      { status: 400 }
    );
  }
}
