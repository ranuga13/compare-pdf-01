import React from 'react';
import { useComparison } from '../../contexts/ComparisonContext';

const TextComparison: React.FC = () => {
  const { textComparisonResult } = useComparison();

  if (!textComparisonResult) {
    return <div className="text-center text-gray-500 py-12">No comparison data available</div>;
  }

  // Parse and format the changes
  const changes = textComparisonResult.summary.split('\n').map(line => {
    const trimmedLine = line.trim();
    if (!trimmedLine) return null;

    // Check if it's a heading (text between **)
    const headerMatch = trimmedLine.match(/\*\*(.*?)\*\*/);
    if (headerMatch) {
      return {
        type: 'header',
        content: headerMatch[1].trim()
      };
    }

    // Check for Old: and New: prefixes
    const oldMatch = trimmedLine.match(/^[•-]?\s*Old:\s*(.*)$/);
    if (oldMatch) {
      return {
        type: 'old',
        content: oldMatch[1].trim()
      };
    }
    
    const newMatch = trimmedLine.match(/^[•-]?\s*New:\s*(.*)$/);
    if (newMatch) {
      return {
        type: 'new',
        content: newMatch[1].trim()
      };
    }


    // Regular content - remove bullet points if they exist
    const contentWithoutBullets = trimmedLine.replace(/^[•-]\s*/, '').trim();
    return {
      type: 'content',
      content: contentWithoutBullets
    };
  }).filter(Boolean);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-6 py-4 rounded-t-xl">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">Document Changes</h3>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {changes.map((change, index) => {
            if (!change) return null;

            if (change.type === 'header') {
              return (
                <div key={index} className="px-6 py-3 bg-blue-50 dark:bg-blue-900/20">
                  <h4 className="text-blue-700 dark:text-blue-300 font-medium">
                    {change.content}
                  </h4>
                </div>
              );
            }

            if (change.type === 'old') {
              return (
                <div key={index} className="px-6 py-2">
                  <div className="flex items-start space-x-2">
                    <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-red-500 dark:bg-red-400 mt-2" />
                    <span className="text-gray-700 dark:text-gray-300 text-sm">
                      <span className="text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/20 px-1.5 py-0.5 rounded font-medium">Old:</span>
                      {' '}{change.content}
                    </span>
                  </div>
                </div>
              );
            }

            if (change.type === 'new') {
              return (
                <div key={index} className="px-6 py-2">
                  <div className="flex items-start space-x-2">
                    <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 mt-2" />
                    <span className="text-gray-700 dark:text-gray-300 text-sm">
                      <span className="text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/20 px-1.5 py-0.5 rounded font-medium">New:</span>
                      {' '}{change.content}
                    </span>
                  </div>
                </div>
              );
            }

            return (
              <div key={index} className="px-6 py-2">
                <div className="flex items-start space-x-2">
                  <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400 mt-2" />
                  <span className="text-gray-700 dark:text-gray-300 text-sm">{change.content}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TextComparison;