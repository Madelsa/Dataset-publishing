'use client';

import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import { ReactNode } from 'react';

interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export default function PageLayout({ 
  children, 
  title,
  description 
}: PageLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
          {(title || description) && (
            <div className="mb-6">
              {title && (
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{title}</h1>
              )}
              {description && (
                <p className="mt-2 text-sm text-gray-500">{description}</p>
              )}
            </div>
          )}
          
          {children}
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 