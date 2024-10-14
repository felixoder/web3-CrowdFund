import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { address, amount } = body;

    const client = await clientPromise;
    const db = client.db("FundMeDB");
    const fundersCollection = db.collection("funders");

    // Insert new funder into the database
    await fundersCollection.insertOne({ address, amount });

    return NextResponse.json({ message: "Funder saved successfully!" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Database error", details: error }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("FundMeDB");
    const fundersCollection = db.collection("funders");

    // Retrieve all funders from the database
    const funders = await fundersCollection.find({}).toArray();
    
    return NextResponse.json(funders);
  } catch (error) {
    return NextResponse.json({ error: "Database error", details: error }, { status: 500 });
  }
}
