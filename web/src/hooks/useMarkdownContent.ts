import { useState, useEffect } from 'react';

interface MarkdownContent {
  content: string;
  loading: boolean;
  error: string | null;
}

// Map of documentation titles to their file paths
const docMap: Record<string, string> = {
  'User Manual': 'USER_MANUAL.md',
  'API Reference': 'API.md',
  'Developer Guide': 'DEVELOPER_GUIDE.md',
  'FAQ': 'FAQ.md',
  'Troubleshooting': 'TROUBLESHOOTING.md',
  'Contributing': 'CONTRIBUTING.md',
};

const useMarkdownContent = (docTitle: string) => {
  const [markdown, setMarkdown] = useState<MarkdownContent>({
    content: '',
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchMarkdown = async () => {
      try {
        const filePath = docMap[docTitle];
        if (!filePath) {
          throw new Error(`Documentation for "${docTitle}" not found`);
        }

        // Fetch from public folder or GitHub raw content
        const response = await fetch(
          `https://raw.githubusercontent.com/Rudii-25/WhatsBotX/main/${filePath}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch documentation');
        }

        const content = await response.text();

        setMarkdown({
          content,
          loading: false,
          error: null,
        });
      } catch (err) {
        console.error('Error fetching markdown:', err);
        setMarkdown(prev => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err.message : 'Failed to load documentation',
        }));
      }
    };

    fetchMarkdown();
  }, [docTitle]);

  return markdown;
};

export default useMarkdownContent;
