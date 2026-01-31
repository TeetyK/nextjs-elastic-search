import { NextResponse } from 'next/server';
import { Client } from "@elastic/elasticsearch";

const client = new Client({ node: "http://localhost:9200" });
/**
 * Handles GET requests to /search?q=...
 * This function searches for books by title in the 'books' index.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q) {
    return NextResponse.json(
      { error: "Query parameter 'q' is required." },
      { status: 400 }
    );
  }

  try {
    const result = await client.search({
      index: 'books',
      query: {
        match: {
          title: {
            query: q as string,
            fuzziness: "AUTO" 
          }
        },
      },
    });

    const results = result.hits.hits.map((hit) => ({
      id: hit._id,
      score: hit._score,
      ...hit._source
    }));

    return NextResponse.json(results);

  } catch (error) {
    console.error("Elasticsearch error:", error);
    return NextResponse.json(
      { error: "Failed to perform search." },
      { status: 500 }
    );
  }
}
