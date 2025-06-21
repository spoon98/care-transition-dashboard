import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Define the base path to the data directory
    const dataDir = path.join(process.cwd(), 'public', 'data');

    // Define paths to each patient file
    const patientFiles = [
      path.join(dataDir, 'pt-1.json'),
      path.join(dataDir, 'pt-2.json'),
      path.join(dataDir, 'pt-3.json'),
    ];

    // Read all files in parallel
    const fileContents = await Promise.all(
      patientFiles.map((filePath) => fs.readFile(filePath, 'utf-8'))
    );

    // Parse each JSON file
    const patients = fileContents.map((content) => JSON.parse(content));

    // Return the combined array as JSON response
    return NextResponse.json(patients);
  } catch (error) {
    // Basic error handling - return 500 status with error message
    console.error('Error reading patient files:', error); // Log the error for server-side debugging
    return NextResponse.json(
      { error: 'Failed to load patient data' },
      { status: 500 }
    );
  }
}
