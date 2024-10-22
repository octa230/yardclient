import React, { useState, useContext } from 'react';
import { Store } from '../Store';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import { toast } from 'react-toastify';
import Image from 'react-bootstrap/Image';

const ImageUpload = ({ label, name, multiple, onUpload }) => {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [images, setImages] = useState([]);
  const [uploadedUrls, setUploadedUrls] = useState([]);

  const handleChange = async (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    try {
      const uploadFiles = await Promise.all(files.map((file) => uploadFile(file)));
      onUpload(name, multiple ? uploadFiles : uploadFiles[0]);
    } catch (error) {
      toast.error('File upload failed. Please try again.');
    }
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('https://api.ugyard.com/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      const uploadedUrl = response.data.secure_url;
      setUploadedUrls((prevUrls) => [...prevUrls, uploadedUrl]);
      return uploadedUrl;
    } catch (error) {
      toast.error(`Error uploading file: ${error.response?.data?.message || error.message}`);
      throw error;
    }
  };

  return (
    <div>
      <Form.Group>
        <Form.Label>{label}</Form.Label>
        <Form.Control
          type="file"
          name={name}
          multiple={multiple}
          onChange={handleChange}
        />
      </Form.Group>

      {uploadedUrls.length > 0 && (
        <div>
          <h4>Uploaded Images:</h4>
          <ListGroup>
            {uploadedUrls.map((url, index) => (
              <ListGroup.Item key={index}>
                <Image src={url} alt={`Uploaded Image ${index + 1}`} style={{ maxWidth: '100px' }} />
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
