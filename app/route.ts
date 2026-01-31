import { NextResponse } from 'next/server';
import { Client } from "@elastic/elasticsearch";
import { faker } from "@faker-js/faker";

const client = new Client({ node: "http://localhost:9200" });

const genres = [
  "Fantasy",
  "Science Fiction",
  "Mystery",
  "Historical",
  "Romance",
  "Horror",
  "Biography",
  "Adventure",
];

const getRandomGenre = () => {
  const randomIndex = Math.floor(Math.random() * genres.length);
  return genres[randomIndex];
};

/**
 * Handles GET requests to /
 * This function will generate a single fake book and index it into Elasticsearch.
 */
export async function GET() {
  try {
    const book = {
      title: faker.commerce.productName(),
      author: faker.person.fullName(),
      genre: getRandomGenre(),
      publishedYear: faker.date.past({ years: 20 }).getFullYear(),
      price: parseFloat(faker.commerce.price()),
    };
    const response = await client.index({
      index: 'books', 
      document: book,
    });

    return NextResponse.json({ 
      message: 'Successfully indexed a new book!',
      documentId: response._id,
      book: book 
    });

  } catch (error) {
    console.error("Error indexing document:", error);
    return NextResponse.json(
      { message: 'Failed to index document.', error: error instanceof Error ? error.message : String(error) }, 
      { status: 500 }
    );
  }
}
