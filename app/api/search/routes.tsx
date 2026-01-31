import { NextResponse } from 'next/server';

export async function GET(request: Request){
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    const data = {
        message : "this is a search api endpoint.",
        query: query || "No query"
    };
    return NextResponse.json(data);
}