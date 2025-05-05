import OpenAI from 'openai';
import { ComparisonResult } from '../types';

const CHUNK_SIZE = 4000;
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

function chunkText(text: string): string[] {
  const chunks: string[] = [];
  let currentChunk = '';
  
  const paragraphs = text.split(/\n\n+/);
  
  for (const paragraph of paragraphs) {
    if (currentChunk.length + paragraph.length > CHUNK_SIZE && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = '';
    }
    
    currentChunk += paragraph + '\n\n';
  }
  
  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks;
}

async function compareChunks(oldChunk: string, newChunk: string, chunkIndex: number): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are a document comparison expert.

Your task is to identify precise differences between two report sections:
- Highlight values that were changed (show old → new)
- Point out added or removed content
- Describe exactly what was moved and where it was moved from and to

### Old Report Section {i+1}:
{old_chunk}

### New Report Section {i+1}:
{new_chunk}

Return a clear list of differences with bullet points.`
        },
        {
          role: 'user',
          content: `Compare these document sections and list ALL differences:

### Old Report Section ${chunkIndex + 1}:
${oldChunk}

### New Report Section ${chunkIndex + 1}:
${newChunk}`
        }
      ],
      temperature: 0.0
    });

    return response.choices[0]?.message?.content || 'No differences found.';
  } catch (error) {
    console.error('Error comparing chunks:', error);
    throw new Error(`Failed to compare document sections: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function parseDifferences(comparisonText: string): ComparisonResult {
  const lines = comparisonText.split('\n');
  const result: ComparisonResult = {
    summary: '',
    changedValues: [],
    addedContent: [],
    removedContent: [],
    movedSections: []
  };

  const structuredLines: string[] = [];
  let currentHeader: string | null = null;

  for (let line of lines) {
    line = line.trim();
    if (!line) continue;

    // Normalize bullet points
    line = line.replace(/^[-*]/, '•');

    // If this is a main point with colon (e.g. "• Currency Symbol Change:")
    if (/^•\s.*:$/.test(line)) {
      currentHeader = line;
      structuredLines.push(currentHeader);
    }
    // If this is a subpoint and we have a header, indent it
    else if (line.startsWith('•') && currentHeader) {
      structuredLines.push(`  ${line}`);
    }
    // Otherwise it's a normal bullet point
    else {
      currentHeader = null;
      structuredLines.push(line);
    }
  }

  result.summary = structuredLines.join('\n');
  return result;
}

export async function compareTexts(oldText: string, newText: string): Promise<ComparisonResult> {
  const oldChunks = chunkText(oldText);
  const newChunks = chunkText(newText);
  
  const maxChunks = Math.max(oldChunks.length, newChunks.length);
  const comparisonResults: string[] = [];

  for (let i = 0; i < maxChunks; i++) {
    const oldChunk = i < oldChunks.length ? oldChunks[i] : '';
    const newChunk = i < newChunks.length ? newChunks[i] : '';
    
    const result = await compareChunks(oldChunk, newChunk, i);
    comparisonResults.push(result);
  }

  const combinedResults = comparisonResults.join('\n\n');
  return parseDifferences(combinedResults);
}