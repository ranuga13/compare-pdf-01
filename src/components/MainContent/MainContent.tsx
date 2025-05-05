import React from 'react';
import { useComparison } from '../../contexts/ComparisonContext';
import UploadSection from '../UploadSection/UploadSection';
import ComparisonResults from '../ComparisonResults/ComparisonResults';
import LoadingIndicator from '../common/LoadingIndicator';
import ErrorDisplay from '../common/ErrorDisplay';

const MainContent: React.FC = () => {
  const { originalDocument, newDocument, isProcessing, error, shouldShowResults } = useComparison();
  
  const bothDocumentsUploaded = originalDocument && newDocument;

  return (
    <main className="container mx-auto px-4 py-8 flex-1">
      {error && <ErrorDisplay message={error} />}
      
      {isProcessing ? (
        <LoadingIndicator />
      ) : (
        <>
          {(!bothDocumentsUploaded || !shouldShowResults) && <UploadSection />}
          {bothDocumentsUploaded && shouldShowResults && <ComparisonResults />}
        </>
      )}
    </main>
  );
};

export default MainContent;