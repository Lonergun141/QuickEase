import React, { useState } from 'react';
import Button from './button';

export default function UploadMaterials() {
  const [selectedTab, setSelectedTab] = useState('text');
  const [textInput, setTextInput] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  const handleTextInputChange = (e) => {
    setTextInput(e.target.value);
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setUploadedFiles([...uploadedFiles, ...files]);
  };

  const handleImageUpload = (e) => {
    const images = Array.from(e.target.files);
    setUploadedImages([...uploadedImages, ...images]);
  };

  const handleRemove = (index, type) => {
    if (type === 'file') {
      setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
    } else if (type === 'image') {
      setUploadedImages(uploadedImages.filter((_, i) => i !== index));
    }
  };

  const renderContent = () => {
    switch (selectedTab) {
      case 'text':
        return (
          <textarea
            className="w-full h-64 p-2 border rounded"
            placeholder="Input your text here"
            value={textInput}
            onChange={handleTextInputChange}
          />
        );
      case 'file':
        return (
          <div className="w-full h-64 p-2 border rounded flex flex-col items-center justify-center">
            <input type="file" multiple onChange={handleFileUpload} />
            {uploadedFiles.length > 0 && (
              <div className="w-full mt-4">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex justify-between items-center border-b py-2">
                    <span>{file.name}</span>
                    <button onClick={() => handleRemove(index, 'file')}>Remove</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 'image':
        return (
          <div className="w-full h-64 p-2 border rounded flex flex-col items-center justify-center">
            <input type="file" multiple accept="image/*" onChange={handleImageUpload} />
            {uploadedImages.length > 0 && (
              <div className="w-full mt-4">
                {uploadedImages.map((image, index) => (
                  <div key={index} className="flex justify-between items-center border-b py-2">
                    <span>{image.name}</span>
                    <button onClick={() => handleRemove(index, 'image')}>Remove</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-screen flex flex-col items-center p-4">
      <div className="w-full md:w-1/2 lg:w-1/3 text-center">
        <h1 className="font-bold text-2xl md:text-3xl lg:text-4xl mb-4">Upload your materials here</h1>
        <p className="text-gray-700 mb-6">
          Let <span className="text-blue-600">Quickie</span> do the work in summarizing for you sit tight
        </p>
        <div className="flex justify-center mb-6">
          <button
            className={`p-2 border ${selectedTab === 'text' ? 'bg-blue-600 text-white' : 'bg-white text-black'}`}
            onClick={() => handleTabChange('text')}
          >
            Input text
          </button>
          <button
            className={`p-2 border ${selectedTab === 'file' ? 'bg-blue-600 text-white' : 'bg-white text-black'}`}
            onClick={() => handleTabChange('file')}
          >
            Upload documents
          </button>
          <button
            className={`p-2 border ${selectedTab === 'image' ? 'bg-blue-600 text-white' : 'bg-white text-black'}`}
            onClick={() => handleTabChange('image')}
          >
            Upload images
          </button>
        </div>
        {renderContent()}
        <div className="w-full mt-6">
          <Button type="button">Generate</Button>
        </div>
      </div>
    </div>
  );
}
