import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Text,
  Flex,
  useToast,
} from '@chakra-ui/react';
import { useDisclosure } from '@chakra-ui/react';
import CreatePost from './CreatePost';
import { FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../../context/authentication-context';

function CreatePostModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, userData } = useContext(AuthContext);
  const navigate = useNavigate();
  const toast = useToast();
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const handleModalClose = () => {
    onClose();
    navigate('/');
  };

  const handleCretePostSuccess = () => {
    setShowSuccessToast(true);

    setShowSuccessToast(false);
    handleModalClose();
  };

  return (
    <>
      <Flex direction="column" align="center">
        {userData?.isBlocked === true ? (
          <Text
            fontSize="lg"
            color="red.500"
            fontWeight="bold"
            textAlign="center"
            p={4}
            border="2px solid red"
            borderRadius="md"
            backgroundColor="red.100"
          >
            You are blocked
          </Text>
        ) : (
          <Button
            onClick={onOpen}
            leftIcon={<FiPlus />}
            _hover={{ bg: 'blue', color: 'white' }}
            height={'50px'}
            width={'85%'}
            mt={1}
            display="flex"
            alignItems="center"
            justifyContent="start"
          >
            Create Your Post
          </Button>
        )}
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <CreatePost currentUser={user} onClose={handleCretePostSuccess} />
          </ModalBody>
        </ModalContent>
      </Modal>
      {showSuccessToast && (
        <Text textAlign="center" color="green.500" mt={4}>
          Post created successfully!
        </Text>
      )}
    </>
  );
}

export default CreatePostModal;
