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
 * Handles GET requests to /init
 * This function will generate and bulk-index 10,000 fake books into Elasticsearch.
 */
export async function GET() {
  try {
    console.log("Starting to generate 10,000 books for bulk indexing...");

    const operations = [];
    for (let i = 0; i < 10000; i++) {
      const book = {
        title: faker.commerce.productName(),
        author: faker.person.fullName(),
        genre: getRandomGenre(),
      };
      
      operations.push({ index: { _index: 'old_books' } });
      operations.push(book);
      
      if (i % 1000 === 0) {
        console.log(`Generated ${i} books...`);
      }
    }

    console.log("Generation complete. Sending data to Elasticsearch via Bulk API...");

    const bulkResponse = await client.bulk({
      refresh: true, // Refresh the index after the operation to make documents searchable
      operations,
    });

    if (bulkResponse.errors) {
      console.error("Bulk indexing had errors:", bulkResponse.items.filter(item => item.index && item.index.error));
      throw new Error("Some documents failed to index.");
    }

    console.log("Bulk indexing complete!");

    return NextResponse.json({
      success: true,
      message: `Successfully indexed 10,000 books into 'old_books' index.`,
    });

  } catch (error) {
    console.error("Error during bulk indexing:", error);
    return NextResponse.json(
      { success: false, message: 'Failed to bulk index documents.', error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
