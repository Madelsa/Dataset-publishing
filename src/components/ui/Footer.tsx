'use client';

import { FiGithub } from 'react-icons/fi';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between sm:flex-row">
          <div className="flex items-center text-gray-500 text-sm">
            <span>© {currentYear} Dataset Publisher. All rights reserved.</span>
          </div>
          
          <div className="mt-4 sm:mt-0">
            <a 
              href="https://github.com/yourusername/dataset-publishing-platform" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-gray-500 hover:text-gray-700 text-sm"
            >
              <FiGithub className="h-4 w-4 mr-1" />
              View on GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
} 