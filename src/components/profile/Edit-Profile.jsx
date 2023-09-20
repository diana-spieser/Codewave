import { useState,useEffect } from 'react';
import {
  Box, Flex, Avatar, Text, Button, HStack, Divider, Modal, ModalOverlay, ModalContent,
  ModalHeader, Stack, ModalBody, ModalCloseButton, Input, FormLabel, FormControl, InputGroup, InputRightElement, Alert, AlertDescription, AlertIcon, ChakraProvider, Center
} from '@chakra-ui/react';
import { useContext } from 'react';
import { AuthContext } from '../../context/authentication-context';
import { auth, storage } from '../../config/firebase.config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { EditIcon, ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { changeFirstName, changeLastName, updateUserPhone } from '../../services/user.service';
import {
  MIN_FIRST_NAME_LEN, MAX_FIRST_NAME_LEN, MIN_LAST_NAME_LEN, MAX_LAST_NAME_LEN,
  PASSWORD_COMPLEXITY, MIN_PASSWORD_LENGTH, PHONE_FORMAT
} from '../../common/Common';
import { updatePassword, updateEmail } from 'firebase/auth';
import Reauthentication from './Reauthentication';
import { useToast } from "@chakra-ui/toast"
import { updatePhotoUrl } from '../../services/user.service';
import PostAndComment from './PostAndComment';
import { useNavigate } from 'react-router-dom';
import { deleteUser,deletePost } from '../../services/user.service';
import { getAllPostsFromUser } from '../../services/post.services';
import ConfirmationAlert from '../base/ConfirmationAlert';

const ProfileCard = () => {

  const { user, userData } = useContext(AuthContext);
  const [errors, setErrors] = useState({});
  const [authIsOpen, setAuthIsOpen] = useState(false);

  const [currentPicture, setCurrentPicture] = useState(false);
  const [newImage, setNewImage] = useState(null);
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  // State for showing/hiding input fields
  const [firstNameField, setFirstNameField] = useState(false);
  const [lastNameField, setLastNameField] = useState(false);
  const [phoneNumberField, setPhoneNumberField] = useState(false);
  const [emailField, setEmailField] = useState(false);
  const [changePasswordField, setChangePasswordField] = useState(false);
  const [showPw, setShowPw] = useState(false)
  const [showPwRepeat, setShowPwRepeat] = useState(false)
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);

  // State for input field values used to change user info
  const [newEmail, setNewEmail] = useState('');
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [newPassword, setNewPassword] = useState({
    newPw: null,
    repeatPw: null
  });

  const toast = useToast();
  const showToast = (message) => {
    toast({
      title: message,
      status: 'success',
      duration: 4000,
      variant: 'solid',
      position: 'top',
      isClosable: true,
    });
  }

  // Functionality for showing/hiding input
  const showFirstName = () => {
    firstNameField ? setFirstNameField(false) : setFirstNameField(true);
    setErrors({});
    setLastNameField(false);
    setPhoneNumberField(false);
    setEmailField(false);
    setChangePasswordField(false);
    setCurrentPicture(false)
  }

  const showLastName = () => {
    lastNameField ? setLastNameField(false) : setLastNameField(true);
    setErrors({});
    setFirstNameField(false);
    setPhoneNumberField(false);
    setEmailField(false);
    setChangePasswordField(false);
    setCurrentPicture(false)
  }

  const showPhoneNumber = () => {
    phoneNumberField ? setPhoneNumberField(false) : setPhoneNumberField(true);
    setErrors({});
    setFirstNameField(false);
    setLastNameField(false);
    setEmailField(false);
    setChangePasswordField(false);
    setCurrentPicture(false)
  }

  const showEmail = () => {
    !emailField && onOpenAuthenticate()
    emailField ? setEmailField(false) : setEmailField(true);
    setErrors({});
    setFirstNameField(false);
    setLastNameField(false);
    setPhoneNumberField(false);
    setChangePasswordField(false);
    setCurrentPicture(false)
  }

  const showChangePasswordField = () => {
    !changePasswordField && onOpenAuthenticate()
    changePasswordField ? setChangePasswordField(false) : setChangePasswordField(true);
    setErrors({});
    setFirstNameField(false);
    setLastNameField(false);
    setPhoneNumberField(false);
    setEmailField(false);
    setShowPw(false);
    setShowPwRepeat(false);
    setCurrentPicture(false)
  }


  const handleClickPw = () => setShowPw(!showPw);
  const handleClickPwRepeat = () => setShowPwRepeat(!showPwRepeat);

  const showChangePicture = () => {
    currentPicture ? setCurrentPicture(false) : setCurrentPicture(true);
    setFirstNameField(false);
    setLastNameField(false);
    setPhoneNumberField(false);
    setEmailField(false);
    setChangePasswordField(false);
    setErrors({});
  }

  const onCloseAuthenticate = () => setAuthIsOpen(false);
  const onOpenAuthenticate = () => setAuthIsOpen(true);

  const setNewPicture = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type === 'image/jpeg') {
        if (file.size <= 1024 * 1024) {
          setNewImage(file);
        } else {
          setNewImage(null);
          return setErrors({ e: 'File size exceeds the limit of 1MB.' })
        }
      } else {
        setNewImage(null);
        return setErrors({ e: 'Please select a JPEG image.' });
      }
    }
  }

  const handlePicture = () => {
    if (newImage) {
      const imageRef = ref(storage, `images/${newImage.name}`);
      uploadBytes(imageRef, newImage)
        .then(() => {
          return getDownloadURL(imageRef);
        })
        .then((url) => {
          updatePhotoUrl(userData.userName, url);
          const successfulUpload = 'Image uploaded!';
          showToast(successfulUpload);
          showChangePicture();
        })
        .catch((error) => {
          setErrors({ e: error.message });
        });
    } else {
      setErrors({ e: 'Please upload a JPEG image that is under 1 MB.' });
    }
  }

  const handleEmailChange = (newEmail) => {
    if (newEmail.length === 0) {
      return;
    }

    updateEmail(auth.currentUser, newEmail)
      .then(() => setEmailField(false))
      .catch(error => setErrors({ e: error.message }));
  }

  const handlePasswordChange = (newPassword) => {
    const { newPw, repeatPw } = newPassword;
    if (newPw !== repeatPw) {
      return setErrors({ e: 'Passwords do not match' });
    }

    if (newPw.length < MIN_PASSWORD_LENGTH) {
      return setErrors({ e: `Password must be at least ${MIN_PASSWORD_LENGTH} symbols long` });
    }
    if (!PASSWORD_COMPLEXITY.test(newPw)) {

      return setErrors({
        e: `Password must contain at least one uppercase letter,
              one lowercase letter, one digit, and one special character.`});
    }

    updatePassword(auth.currentUser, newPw)
      .then(() => {
        const pwChanged = 'Password changed successfully.';
        showToast(pwChanged);
        setNewPassword('');
        setChangePasswordField(false);
        setErrors({});
      })
      .catch(error => setErrors({ e: error.message }));
  }

  const handlePhoneChange = (handle, newPhoneNumber) => {
    if (newPhoneNumber !== '' && !PHONE_FORMAT.test(newPhoneNumber)) {
      return setErrors({ e: 'Please enter a valid phone number (digits only).' });
    }

    updateUserPhone(handle, newPhoneNumber);
    setPhoneNumberField(false);
    setErrors({});
  }

  const handleFirstNameChange = (handle, newFirstName) => {
    if (newFirstName.length < MIN_FIRST_NAME_LEN || newFirstName.length > MAX_FIRST_NAME_LEN) {
      return setErrors({
        e: `First Name must be between ${MIN_FIRST_NAME_LEN} and ${MAX_FIRST_NAME_LEN} symbols.`
      });
    }

    changeFirstName(handle, newFirstName);
    setFirstNameField(false);
    setErrors({});
  }

  const handleLastNameChange = (handle, newLastName) => {
    if (newLastName.length < MIN_LAST_NAME_LEN || newLastName.length > MAX_LAST_NAME_LEN) {
      return setErrors({
        e: `Last Name must be between ${MIN_LAST_NAME_LEN} and ${MAX_LAST_NAME_LEN} symbols.`
      });
    }
    changeLastName(handle, newLastName);
    setLastNameField(false);
    setErrors({});
  }

  useEffect(() => {

     getAllPostsFromUser(userData?.uid)
      .then((posts) =>  setPosts(posts))
      .catch((error) => console.log(error));
  }, [userData?.uid]);

  const deleteProfile = () => {
    setIsDeleteConfirmationOpen(true);
  };

  const handleConfirmDelete = (handle) => {
    for (let post of posts) {
      deletePost(post.id);
    }
    deleteUser(handle);
    auth.signOut();
    navigate('/');
  };

  const handleCancelDelete = () => {
    setIsDeleteConfirmationOpen(false);
  };

  if (!userData) {
    return null;
  }

  return (
      <Box p={4} borderWidth="1px" borderRadius="md">
        <Flex alignItems="center" mb={4}>
          <Avatar size="lg" name={userData.userName} src={userData.photoUrl} />
          <Stack spacing={0}>
            <Text ml={3} fontWeight="bold" fontSize="xl" align={'left'}>
              {userData.userName}
            </Text>
            <Text ml={3} align={'left'}>
              {userData.role}
            </Text>
          </Stack>
        </Flex>
        <Stack>
          <Text>
            First Name: {userData.firstName}
            <EditIcon size='md' mb={1.9} ml={2} onClick={showFirstName} _hover={{ cursor: 'pointer' }} />
          </Text>
          {firstNameField && <HStack>
            <Input type="name" name="firstName" w={210} focusBorderColor='lightblue' onChange={(e) => setNewFirstName(e.target.value)} />
            <Button colorScheme='teal' variant='outline' size='xs' w={55} h={9}
              onClick={() => handleFirstNameChange(userData.userName, newFirstName)}>
              Update
            </Button>
          </HStack>}
          {(firstNameField && Object.keys(errors).length > 0) && <Alert w={'40%'} status='error'>
            <AlertIcon />
            <AlertDescription>
              <Text mb={1}>{errors.e}</Text>
            </AlertDescription>
          </Alert>}
        </Stack>
        <Stack>
          <Text>Last Name: {userData.lastName}
            <EditIcon size='md' mb={1.9} ml={2} onClick={showLastName} _hover={{ cursor: 'pointer' }} />
          </Text>
          {lastNameField && <HStack>
            <Input type="name" name="lastName" w={210} focusBorderColor='lightblue' onChange={(e) => setNewLastName(e.target.value)}
            /><Button colorScheme='teal' variant='outline' size='xs' w={55} h={9}
              onClick={() => handleLastNameChange(userData.userName, newLastName)}>
              Update
            </Button>
          </HStack>}
          {(lastNameField && Object.keys(errors).length > 0) && <Alert w={'40%'} status='error'>
            <AlertIcon />
            <AlertDescription>
              <Text mb={1}>{errors.e}</Text>
            </AlertDescription>
          </Alert>}
        </Stack>
        <Stack>
          <Text>
            Phone number: {userData.phoneNumber}
            <EditIcon size='md' mb={1.9} ml={2} onClick={showPhoneNumber} _hover={{ cursor: 'pointer' }} />
          </Text>
          {phoneNumberField && <HStack>
            <Input type="tel" name="phoneNumber" w={210} focusBorderColor='lightblue' onChange={(e) => setNewPhoneNumber(e.target.value)}
            /><Button colorScheme='teal' variant='outline' size='xs' w={55} h={9}
              onClick={() => handlePhoneChange(userData.userName, newPhoneNumber)}>
              Update
            </Button>
          </HStack>}
          {(phoneNumberField && Object.keys(errors).length > 0) && <Alert w={'40%'} status='error'>
            <AlertIcon />
            <AlertDescription>
              <Text mb={1}>{errors.e}</Text>
            </AlertDescription>
          </Alert>}
        </Stack>
        <Stack>
          <Text>Email address: {user.email}
            <EditIcon size='md' mb={1.9} ml={2} onClick={showEmail} _hover={{ cursor: 'pointer' }} />
          </Text>
          {emailField && <HStack>
            <Input type="email" name="email" w={210} focusBorderColor='lightblue' onChange={(e) => setNewEmail(e.target.value)} />
            <Button colorScheme='teal' variant='outline' size='xs' w={55} h={9} onClick={() => handleEmailChange(newEmail)}>
              Update
            </Button>
          </HStack>}
          {(emailField && Object.keys(errors).length > 0) && <Alert w={'40%'} status='error'>
            <AlertIcon />
            <AlertDescription>
              <Text mb={1}>{errors.e}</Text>
            </AlertDescription>
          </Alert>}
        </Stack>
        <Text mb={2}>Registered on: {new Date(userData.createdOn).
          toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}</Text>
        <HStack>
          <Button onClick={showChangePasswordField} colorScheme="teal" size="sm" mb={4}>
            Change Password
          </Button>
          <Button onClick={showChangePicture} colorScheme="teal" size="sm" mb={4}>
            Upload Avatar
          </Button>
        </HStack>
        {currentPicture && <HStack>
          <Input type="file" name="picture" w="30%" h={10} py={2} px={3} borderWidth={1} borderRadius="md" _hover={{ borderColor: 'gray.300' }} _focus={{ borderColor: 'blue.300', boxShadow: 'outline' }}
            onChange={(e) => setNewPicture(e)} />
          <Button colorScheme='teal' variant='outline' size='xs' w={55} h={9}
            onClick={() => handlePicture()}>
            Upload
          </Button>
        </HStack>}
        {changePasswordField && <HStack>
          <Stack>
            <FormControl isRequired>
              <FormLabel>New Password</FormLabel>
              <InputGroup size='md'>
                <Input type={showPw ? 'text' : 'password'} name="password" focusBorderColor='lightblue' pr='4.5rem' onChange={(e) => setNewPassword({ ...newPassword, newPw: e.target.value })} />
                <InputRightElement h={'full'}>
                  <Button variant={'ghost'} colorScheme='grey' onClick={handleClickPw}>
                    {showPw ? <ViewOffIcon /> : <ViewIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
          </Stack>
          <Stack>
            <FormControl isRequired>
              <FormLabel>Repeat New Password</FormLabel>
              <InputGroup size='md'>
                <Input type={showPwRepeat ? 'text' : 'password'} name="password" focusBorderColor='lightblue' pr='4.5rem' onChange={(e) => setNewPassword({ ...newPassword, repeatPw: e.target.value })} />
                <InputRightElement h={'full'}>
                  <Button variant={'ghost'} colorScheme='grey' onClick={handleClickPwRepeat}>
                    {showPwRepeat ? <ViewOffIcon /> : <ViewIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
          </Stack>
          <Button colorScheme='teal' variant='outline' size='xs' w={55} h={9} mt={8} onClick={() => handlePasswordChange(newPassword)}>
            Update
          </Button>
        </HStack>}
        {(changePasswordField && Object.keys(errors).length > 0) && <Alert w={'43.7%'} mt={4} mb={4} status='error'>
          <AlertIcon />
          <AlertDescription>
            <Text mb={1}>{errors.e}</Text>
          </AlertDescription>
        </Alert>}
        {(currentPicture && Object.keys(errors).length > 0) && <Alert w={'43.7%'} mt={4} mb={4} status='error'>
          <AlertIcon />
          <AlertDescription>
            <Text mb={1}>{errors.e}</Text>
          </AlertDescription>
        </Alert>}
        <HStack spacing={4} align="flex-start">
          <PostAndComment authorId={userData.uid}
          authorName={userData.userName}/>
        </HStack>
        <Divider my={4} />
        <Divider my={4} />
        <Modal isOpen={authIsOpen} onClose={onCloseAuthenticate}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader textAlign={'center'}>Provide credentials</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Reauthentication onChange={onCloseAuthenticate} />
            </ModalBody>
          </ModalContent>
        </Modal>
        <Flex direction="column" align="center" border="1px solid #ccc" borderRadius={'17px'} padding="20px" mb={10}>
        <Text pb={5} fontWeight="bold">Delete your account:</Text>
         <HStack>
           <Button colorScheme="red" onClick={()=> deleteProfile()}>
             Delete Account
            </Button>
          </HStack>
       </Flex>
       <ConfirmationAlert
        isOpen={isDeleteConfirmationOpen}
        onClose={handleCancelDelete}
        onDelete={() => handleConfirmDelete(userData.userName)}
        message="Are you sure you want to delete your account? This action cannot be undone."
      />
      </Box>
  );
};

export default ProfileCard;
