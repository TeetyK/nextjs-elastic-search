import { NextResponse } from 'next/server';
import { Client } from "@elastic/elasticsearch";

const client = new Client({ node: "http://localhost:9200" });
/**
 * Handles POST requests to /insert?index=...
 * This function inserts a document from the request body into the specified index.
 */
export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const index = searchParams.get('index');
    const data = await request.json();

    if (!index) {
      return NextResponse.json(
        { success: false, error: "Query parameter 'index' is required." },
        { status: 400 }
      );
    }

    if (!data || Object.keys(data).length === 0) {
      return NextResponse.json(
        { success: false, error: "Request body with data payload is required." },
        { status: 400 }
      );
    }

    const result = await client.index({
      index: index,
      document: data,
    });

    return NextResponse.json({
      success: true,
      result: result,
    });

  } catch (error: any) {
    console.error("Failed to insert data:", error);
    if (error instanceof SyntaxError && 'body' in error) {
      return NextResponse.json(
        { success: false, message: "Invalid JSON in request body." },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: "Failed to insert data.", error: error.message },
      { status: 500 }
    );
  }
}
