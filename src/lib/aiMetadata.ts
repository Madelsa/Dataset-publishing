import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API
// In production, this should be an environment variable
const API_KEY = process.env.GEMINI_API_KEY || "YOUR_API_KEY"; 
const genAI = new GoogleGenerativeAI(API_KEY);

// Use the more efficient Gemini 1.5 Flash model
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
    // Limit to 10 rows and 100KB to stay within API limits
    const sampleRows = Math.min(data.length, 10);
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
    
    // Create the prompt based on language
    const prompt = language === 'ar' 
      ? `تحليل مجموعة البيانات التالية وتوليد البيانات الوصفية:
         ${dataPreview}
         
         بناءً على معاينة مجموعة البيانات أعلاه، قم بإنشاء ما يلي:
         1. عنوان موجز ووصفي
         2. وصف مفصل يشرح محتويات مجموعة البيانات
         3. 3-5 علامات أو كلمات مفتاحية ذات صلة
         4. الفئة التي تناسب هذه البيانات بشكل أفضل
         
         قم بتنسيق إجابتك في تنسيق JSON مع المفاتيح: title، description، tags، category`
      : `Analyze the following dataset and generate metadata:
         ${dataPreview}
         
         Based on the dataset preview above, generate the following:
         1. A concise, descriptive title
         2. A detailed description explaining what this dataset contains
         3. 3-5 relevant tags or keywords
         4. A category that best fits this data
         
         Format your response as JSON with keys: title, description, tags, category`;

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