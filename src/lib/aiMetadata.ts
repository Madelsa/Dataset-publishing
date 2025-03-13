import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_MODEL, PROMPT_TEMPLATES } from "@/constants/ai";
import { GEMINI_API_KEY } from "@/constants/env";
import { MAX_SAMPLE_ROWS } from "@/constants/uploads";

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Use the model defined in constants
const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

interface MetadataSuggestion {
  title: string;
  description: string;
  tags: string[];
  category: string;
}

/**
 * Generate metadata suggestions using Gemini AI
 * 
 * @param data The dataset rows
 * @param columnNames The column names from the dataset
 * @param language The language to generate metadata in ('en' or 'ar')
 * @returns The suggested metadata
 */
export async function generateMetadata(
  data: any[], 
  columnNames: string[], 
  language = 'en'
): Promise<MetadataSuggestion> {
  try {
    // Create a sample of the dataset for the AI to analyze
    // Limit to MAX_SAMPLE_ROWS and 100KB to stay within API limits
    const sampleRows = Math.min(data.length, MAX_SAMPLE_ROWS);
    const sample = data.slice(0, sampleRows);
    
    // Format the data for the prompt
    let dataPreview = '';
    
    // Add column names
    dataPreview += `Columns: ${columnNames.join(', ')}\n\n`;
    
    // Add sample rows
    dataPreview += `Sample data (${sampleRows} rows):\n`;
    sample.forEach((row, index) => {
      dataPreview += `Row ${index + 1}: `;
      dataPreview += columnNames.map(col => `${col}=${row[col]}`).join(', ');
      dataPreview += '\n';
    });
    
    // Create the prompt based on language using the template
    const promptTemplate = language === 'ar' 
      ? PROMPT_TEMPLATES.ARABIC
      : PROMPT_TEMPLATES.ENGLISH;
    
    // Replace the placeholder with the actual data preview
    const prompt = promptTemplate.replace('{{dataPreview}}', dataPreview);

    // Send the prompt to Gemini
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Try to parse the JSON response
    try {
      // Remove any markdown formatting and parse the JSON
      const cleanedJson = text.replace(/```json|```/g, '').trim();
      const metadata = JSON.parse(cleanedJson);
      
      // Ensure the response has the expected structure
      return {
        title: metadata.title || '',
        description: metadata.description || '',
        tags: Array.isArray(metadata.tags) ? metadata.tags : [],
        category: metadata.category || ''
      };
    } catch (e) {
      console.error("Failed to parse AI response as JSON:", e);
      
      // Fallback: Extract metadata using regex
      return extractMetadataFromText(text);
    }
  } catch (error) {
    console.error("Error generating metadata:", error);
    
    // Return empty metadata on error
    return {
      title: '',
      description: '',
      tags: [],
      category: ''
    };
  }
}

/**
 * Fallback function to extract metadata from text when JSON parsing fails
 */
function extractMetadataFromText(text: string): MetadataSuggestion {
  // Default empty result
  const result: MetadataSuggestion = {
    title: '',
    description: '',
    tags: [],
    category: ''
  };
  
  // Simple regex patterns to extract metadata
  const titleMatch = text.match(/title[:\s]+([^\n]+)/i);
  if (titleMatch?.[1]) {
    result.title = titleMatch[1].trim();
  }
  
  const descMatch = text.match(/description[:\s]+([^\n]+(\n[^\n]+)*)/i);
  if (descMatch?.[1]) {
    result.description = descMatch[1].trim();
  }
  
  const tagsMatch = text.match(/tags[:\s]+([^\n]+)/i);
  if (tagsMatch?.[1]) {
    // Extract tags, handling various formats
    result.tags = tagsMatch[1]
      .split(/[,;]/)
      .map(tag => tag.trim())
      .filter(tag => tag);
  }
  
  const categoryMatch = text.match(/category[:\s]+([^\n]+)/i);
  if (categoryMatch?.[1]) {
    result.category = categoryMatch[1].trim();
  }
  
  return result;
} 