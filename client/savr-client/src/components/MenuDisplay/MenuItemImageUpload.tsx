import React, { useState } from 'react';
import axios from 'axios';

interface MenuItemImageUploadProps {
  itemId: string;
  itemName: string;
  onImageUploaded: (imageUrl: string) => void;
}

const MenuItemImageUpload: React.FC<MenuItemImageUploadProps> = ({
  onImageUploaded,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Reached here');
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      uploadImage(file);
      e.target.value = '';
    }
  };

  const uploadImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = function (e) {
      const base64DataUrl = e.target?.result;
      if (typeof base64DataUrl === 'string') {
        setIsLoading(true);

        // Create form data with the image and item details
        const imageUrl = base64DataUrl;

        axios
          .post('http://127.0.0.1:8000/upload-menu-item-image', {
            imageUrl: imageUrl,
          })
          .then(response => {
            if (response.data.imageUrl) {
              onImageUploaded(response.data.imageUrl);
            }
            console.log(response.data);
          })
          .catch(error => {
            console.error('Error uploading image:', error);
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="menu-item-image-upload">
      <div className="image-upload-buttons">
        <label className="upload-button">
          {isLoading ? 'Uploading...' : 'Upload Image'}
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileChange}
            disabled={isLoading}
          />
        </label>
      </div>
    </div>
  );
};

export default MenuItemImageUpload;
