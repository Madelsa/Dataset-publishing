/**
 * Metadata Service
 * 
 * Provides AI-powered metadata generation for datasets using Google's Gemini API.
 * This service handles:
 * - Communicating with the Gemini AI model
 * - Formatting dataset samples for AI analysis
 * - Creating prompts in multiple languages
 * - Parsing and validating AI responses
 * - Providing fallback extraction when parsing fails
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { MetadataSuggestion } from "@/types/dataset.types";

// Initialize the Gemini API
// Replace this with your actual Gemini API key from https://makersuite.google.com/
// For production, use environment variables by adding GEMINI_API_KEY to your .env file
const API_KEY = process.env.GEMINI_API_KEY || "YOUR_ACTUAL_API_KEY_HERE"; 
const genAI = new GoogleGenerativeAI(API_KEY);

// Use the more efficient Gemini 1.5 Flash model
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * Generate metadata suggestions using Gemini AI
 * 
 * Analyzes a dataset sample and generates descriptive metadata using AI.
 * The function:
 * 1. Creates a sample of the dataset (limited to 10 rows)
 * 2. Formats the data for the AI prompt
 * 3. Sends the prompt to Gemini in the requested language
 * 4. Parses the response and validates the structure
 * 5. Falls back to regex extraction if JSON parsing fails
 * 
 * @param data - The dataset rows to analyze
 * @param columnNames - The column names from the dataset
 * @param language - The language to generate metadata in ('en' or 'ar')
 * @returns The suggested metadata (title, description, tags, category)
 */
export async function generateMetadata(
  data: any[], 
  columnNames: string[], 
  language = 'en'
): Promise<MetadataSuggestion> {
  try {
    // If we already have sample data, use it directly
    // Otherwise, create a sample from the full data
    let sample: any[];
    if (data.length > 0 && typeof data[0] === 'object' && Object.keys(data[0]).length > 0) {
      // We already have structured data (likely from the processFile function)
      sample = data.slice(0, 10); // Limit to 10 rows
    } else {
      // We need to create sample data
      sample = [];
      console.warn("No structured data provided for metadata generation");
    }
    
    // Format the data for the prompt
    let dataPreview = '';
    
    // Add column names
    if (columnNames && columnNames.length > 0) {
      dataPreview += `Columns: ${columnNames.join(', ')}\n\n`;
    }
    
    // Add sample rows in a table-like format for better readability
    if (sample.length > 0) {
      dataPreview += 'Sample data:\n\n';
      
      // Create a header row
      dataPreview += '| ' + columnNames.join(' | ') + ' |\n';
      // Add a separator row
      dataPreview += '| ' + columnNames.map(() => '---').join(' | ') + ' |\n';
      
      // Add data rows
      sample.forEach(row => {
        const rowValues = columnNames.map(col => {
          const value = row[col];
          // Format the value properly, handling undefined/null
          if (value === undefined || value === null) {
            return 'null';
          } else if (typeof value === 'string') {
            return value;
          } else {
            return String(value);
          }
        });
        dataPreview += '| ' + rowValues.join(' | ') + ' |\n';
      });
    } else {
      dataPreview += 'No sample data available.\n';
    }
    
    // Create the prompt based on language
    const prompt = language === 'ar' 
      ? createArabicPrompt(dataPreview)
      : createEnglishPrompt(dataPreview);

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
 * Creates an English prompt for the AI model
 * 
 * Formats the dataset preview into a structured prompt that instructs
 * the AI to generate metadata in English format.
 * 
 * @param dataPreview - The formatted dataset sample
 * @returns A complete prompt string for the AI model
 */
function createEnglishPrompt(dataPreview: string): string {
  return `You are an expert data analyst tasked with creating metadata for a dataset. 
Analyze the following dataset preview carefully:

${dataPreview}

Based on the dataset preview above, please generate the following:
1. A concise, descriptive title (1 line)
2. A detailed description (2-3 paragraphs) explaining what this dataset contains, its structure, and potential use cases
3. 3-5 relevant tags or keywords
4. A category that best fits this data

Ensure your description accurately reflects the actual data in the preview. If there are any issues with the data (such as missing values, formatting issues), mention them in the description.

Format your response as JSON with keys: title, description, tags, category`;
}

/**
 * Creates an Arabic prompt for the AI model
 * 
 * Formats the dataset preview into a structured prompt that instructs
 * the AI to generate metadata in Arabic format.
 * 
 * @param dataPreview - The formatted dataset sample
 * @returns A complete prompt string for the AI model in Arabic
 */
function createArabicPrompt(dataPreview: string): string {
  return `أنت محلل بيانات خبير مكلف بإنشاء بيانات وصفية لمجموعة بيانات.
قم بتحليل معاينة مجموعة البيانات التالية بعناية:

${dataPreview}

بناءً على معاينة مجموعة البيانات أعلاه، يرجى إنشاء ما يلي:
1. عنوان موجز ووصفي (سطر واحد)
2. وصف مفصل (2-3 فقرات) يشرح محتوى مجموعة البيانات هذه وهيكلها وحالات الاستخدام المحتملة
3. 3-5 علامات أو كلمات مفتاحية ذات صلة
4. الفئة التي تناسب هذه البيانات بشكل أفضل

تأكد من أن وصفك يعكس البيانات الفعلية في المعاينة بدقة. إذا كانت هناك أي مشكلات في البيانات (مثل القيم المفقودة أو مشكلات التنسيق)، اذكرها في الوصف.

قم بتنسيق إجابتك بتنسيق JSON مع المفاتيح: title، description، tags، category`;
}

/**
 * Fallback function to extract metadata from text when JSON parsing fails
 * 
 * Uses regex patterns to extract metadata fields from unstructured text.
 * This provides resilience when the AI response isn't valid JSON.
 * 
 * @param text - The raw text response from the AI
 * @returns Extracted metadata with best-effort parsing
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