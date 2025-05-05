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

    // Regular content - remove bullet points if they exist
    const contentWithoutBullets = trimmedLine.replace(/^[•-]\s*/, '').trim();
    return {
      type: 'content',
      content: contentWithoutBullets
    };
  }).filter(Boolean);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 rounded-t-xl">
          <h3 className="font-semibold text-gray-900 text-lg">Document Changes</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {changes.map((change, index) => {
            if (!change) return null;

            if (change.type === 'header') {
              return (
                <div key={index} className="px-6 py-3 bg-blue-50">
                  <h4 className="text-blue-700 font-medium">
                    {change.content}
                  </h4>
                </div>
              );
            }

            return (
              <div key={index} className="px-6 py-2">
                <div className="flex items-start space-x-2">
                  <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-blue-500 mt-2" />
                  <span className="text-gray-700 text-sm">{change.content}</span>
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