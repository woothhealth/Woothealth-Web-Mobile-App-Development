import { NextResponse } from "next/server";
import { account } from "../../../lib/appwrite";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    // Attempt to log in the user
    await account.createEmailPasswordSession(email, password);
    const user = await account.get();

    return NextResponse.json({
      message: "Login successful!",
      user,
      success: true,
    });
  } catch (error: any) {
    // Log the real error for debugging
    console.error("Appwrite login error:", error);
    // User-friendly error message
    let userMessage = "Invalid credentials. Please check your email and password.";
    if (error?.message?.includes("invalid credentials")) {
      userMessage = "Invalid credentials. Please check your email and password.";
    }
    return NextResponse.json(
      { error: userMessage },
      { status: 401 }
    );
  }
}
