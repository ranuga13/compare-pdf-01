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

  const renderFileName = (name: string) => {
    return (
      <div className="max-w-full overflow-hidden">
        <p className="font-semibold text-green-600 truncate" title={name}>
          {name}
        </p>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-blue-900 mb-6">Upload Documents to Compare</h2>
        <p className="text-gray-600 mb-8">
          Upload two PDF documents to compare their content and visual differences.
          Our system will analyze both textual and visual changes between versions.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="flex flex-col">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Original Document (Old Version)</h3>
          <div 
            {...originalDropzone.getRootProps()} 
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${originalDropzone.isDragActive 
                ? 'border-blue-500 bg-blue-50' 
                : originalDocument 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'}`}
          >
            <input {...originalDropzone.getInputProps()} />
            
            {originalDocument ? (
              <div className="text-green-600">
                {renderFileName(originalDocument.file.name)}
                <p className="text-sm mt-1">Document loaded successfully</p>
              </div>
            ) : (
              <div className="text-gray-500">
                <FileUp className="mx-auto h-12 w-12 mb-3 text-gray-400" />
                <p className="font-medium">
                  {originalDropzone.isDragActive 
                    ? "Drop the file here" 
                    : "Drag & drop or click to select"}
                </p>
                <p className="text-sm mt-1">Original PDF file</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col">
          <h3 className="text-lg font-medium text-gray-800 mb-3">New Document (Updated Version)</h3>
          <div 
            {...newDropzone.getRootProps()} 
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${newDropzone.isDragActive 
                ? 'border-blue-500 bg-blue-50' 
                : newDocument 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'}`}
          >
            <input {...newDropzone.getInputProps()} />
            
            {newDocument ? (
              <div className="text-green-600">
                {renderFileName(newDocument.file.name)}
                <p className="text-sm mt-1">Document loaded successfully</p>
              </div>
            ) : (
              <div className="text-gray-500">
                <FileUp className="mx-auto h-12 w-12 mb-3 text-gray-400" />
                <p className="font-medium">
                  {newDropzone.isDragActive 
                    ? "Drop the file here" 
                    : "Drag & drop or click to select"}
                </p>
                <p className="text-sm mt-1">Updated PDF file</p>
              </div>
            )}
          </div>
        </div>
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

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start">
        <AlertCircle className="text-blue-500 mr-3 flex-shrink-0 mt-0.5" size={20} />
        <div className="text-sm text-blue-800">
          <p className="font-semibold mb-1">Privacy Note</p>
          <p>Your documents are processed locally in your browser. No content is stored on external servers except during the AI-powered text comparison process.</p>
        </div>
      </div>
    </div>
  );
};

export default UploadSection;