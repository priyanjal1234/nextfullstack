import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import userModel from "@/models/user-model";

export async function POST(request: NextRequest) {
  try {
    let { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "All Fields are required" },
        { status: 400 }
      );
    }

    await db();

    let user = await userModel.findOne({ email });

    if (user) {
      return NextResponse.json(
        { error: "Email is already registered" },
        { status: 409 }
      );
    }

    await userModel.create({
      name,
      email,
      password,
    });

    return NextResponse.json(
      { message: "Registration Successfull" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to register" },
      { status: 500 }
    );
  }
}
