import  { useState } from 'react';
import { Box, Button, Input, FormControl, FormLabel } from '@chakra-ui/react';
import firebase from 'firebase/app';
import 'firebase/database';

const ImageUploader = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  const handleUpload = () => {
    if (!selectedImage) return;

    const storageRef = firebase.storage().ref();
    const imageRef = storageRef.child(selectedImage.name);

    imageRef.put(selectedImage).then(() => {
      imageRef.getDownloadURL().then((url) => {
        // Now, store the image URL in the Firebase Realtime Database
        const databaseRef = firebase.database().ref('/images');
        databaseRef.push(url).then(() => {
        }).catch((error) => {
          console.error('Error storing image URL:', error);
        });
      }).catch((error) => {
        console.error('Error getting image URL:', error);
      });
    }).catch((error) => {
      console.error('Error uploading image:', error);
    });
  };

  return (
    <Box maxW="400px" m="auto">
      <FormControl>
        <FormLabel htmlFor="image-upload">Choose an image to upload</FormLabel>
        <Input type="file" id="image-upload" onChange={handleFileChange} />
        <Button mt={2} onClick={handleUpload}>Upload</Button>
      </FormControl>
    </Box>
  );
};

export default ImageUploader;
