import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await axios.post('http://localhost:8000/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        // Display success message
        setUploadMessage(`File uploaded successfully. URL: ${response.data.url}`);
      } catch (error) {
        // Display error message in red
        if (error.response) {
          setUploadMessage(<span style={{ color: 'red' }}>Upload failed: {error.response.data}</span>);
        } else {
          setUploadMessage(<span style={{ color: 'red' }}>Upload failed: Network Error</span>);
        }
      }
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/jpeg, image/png, image/gif, application/pdf"
        onChange={handleFileChange}
      />
      {uploadMessage && <div style={{ marginTop: '8px' }}>{uploadMessage}</div>}
    </div>
  );
};

export default FileUpload;
