import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileUp, AlertCircle } from 'lucide-react';
import { useComparison } from '../../contexts/ComparisonContext';
import { processPdfFile } from '../../services/pdfService';
import Button from '../common/Button';

const UploadSection: React.FC = () => {
  const { 
    originalDocument, 
    newDocument, 
    setOriginalDocument, 
    setNewDocument, 
    setIsProcessing,
    setError,
    setShouldShowResults
  } = useComparison();

  const handleFileUpload = useCallback(async (file: File, isOriginal: boolean) => {
    if (!file.type.includes('pdf')) {
      setError('Only PDF files are supported');
      return;
    }

    setIsProcessing(true);
    setError(null);
    
    try {
      const processedFile = await processPdfFile(file);
      
      if (isOriginal) {
        setOriginalDocument(processedFile);
      } else {
        setNewDocument(processedFile);
      }
    } catch (error) {
      setError(`Error processing PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  }, [setOriginalDocument, setNewDocument, setIsProcessing, setError]);

  const originalDropzone = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    onDrop: useCallback((acceptedFiles) => {
      if (acceptedFiles.length) {
        handleFileUpload(acceptedFiles[0], true);
      }
    }, [handleFileUpload])
  });

  const newDropzone = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    onDrop: useCallback((acceptedFiles) => {
      if (acceptedFiles.length) {
        handleFileUpload(acceptedFiles[0], false);
      }
    }, [handleFileUpload])
  });

  const startComparison = () => {
    if (!originalDocument || !newDocument) {
      setError('Please upload both documents first');
      return;
    }
    setShouldShowResults(true);
  };

  const renderUploadZone = (
    dropzone: any, 
    document: DocumentFile | null, 
    label: string, 
    description: string
  ) => (
    <div className="flex flex-col">
      <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">{label}</h3>
      <div 
        {...dropzone.getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${dropzone.isDragActive 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : document 
              ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
              : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'}`}
      >
        <input {...dropzone.getInputProps()} />
        
        {document ? (
          <div className="text-green-600 dark:text-green-400">
            <div className="max-w-full px-4">
              <p className="font-semibold truncate" title={document.file.name}>
                {document.file.name}
              </p>
            </div>
            <p className="text-sm mt-1">Document loaded successfully</p>
          </div>
        ) : (
          <div className="text-gray-500 dark:text-gray-400">
            <FileUp className="mx-auto h-12 w-12 mb-3 text-gray-400 dark:text-gray-500" />
            <p className="font-medium">
              {dropzone.isDragActive 
                ? "Drop the file here" 
                : "Drag & drop or click to select"}
            </p>
            <p className="text-sm mt-1">{description}</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-6">Upload Documents to Compare</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Upload two PDF documents to compare their content and visual differences.
          Our system will analyze both textual and visual changes between versions.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {renderUploadZone(
          originalDropzone,
          originalDocument,
          "Original Document (Old Version)",
          "Original PDF file"
        )}
        {renderUploadZone(
          newDropzone,
          newDocument,
          "New Document (Updated Version)",
          "Updated PDF file"
        )}
      </div>

      {(originalDocument || newDocument) && (
        <div className="flex justify-center mt-8">
          <Button 
            onClick={startComparison} 
            disabled={!originalDocument || !newDocument}
            className="px-6 py-3 text-lg"
          >
            Start Comparison
          </Button>
        </div>
      )}

      <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex items-start">
        <AlertCircle className="text-blue-500 dark:text-blue-400 mr-3 flex-shrink-0 mt-0.5" size={20} />
        <div className="text-sm text-blue-800 dark:text-blue-200">
          <p className="font-semibold mb-1">Privacy Note</p>
          <p>Your documents are processed locally in your browser. No content is stored on external servers except during the AI-powered text comparison process.</p>
        </div>
      </div>
    </div>
  );
};

export default UploadSection;