/**
 * AI Constants
 * 
 * Constants and configuration values for AI services used in the application
 */

import { MAX_SAMPLE_ROWS } from './uploads';

// Gemini model settings
export const GEMINI_MODEL = "gemini-1.5-flash";

// Prompt templates
export const PROMPT_TEMPLATES = {
  ENGLISH: `Analyze the following dataset and generate metadata:
    {{dataPreview}}
    
    Based on the dataset preview above, generate the following:
    1. A concise, descriptive title
    2. A detailed description explaining what this dataset contains
    3. 3-5 relevant tags or keywords
    4. A category that best fits this data
    
    Format your response as JSON with keys: title, description, tags, category`,
    
  ARABIC: `تحليل مجموعة البيانات التالية وتوليد البيانات الوصفية:
    {{dataPreview}}
    
    بناءً على معاينة مجموعة البيانات أعلاه، قم بإنشاء ما يلي:
    1. عنوان موجز ووصفي
    2. وصف مفصل يشرح محتويات مجموعة البيانات
    3. 3-5 علامات أو كلمات مفتاحية ذات صلة
    4. الفئة التي تناسب هذه البيانات بشكل أفضل
    
    قم بتنسيق إجابتك في تنسيق JSON مع المفاتيح: title، description، tags، category`
}; 