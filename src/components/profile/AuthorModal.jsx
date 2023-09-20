import  { useState } from "react";
import {
  Button,
  Center,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Avatar,
  useBreakpointValue,
} from "@chakra-ui/react";
import PostAndComment from "./PostAndComment";
import PropTypes from "prop-types";

const AuthorModal = ({ authorName, authorPhoto, authorIdent }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useBreakpointValue({ base: true, md: false });
  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Button h={8} w={120} fontSize={isMobile ? '12px' : 'md'} onClick={openModal}>View Author</Button>
            <Modal isOpen={isOpen} onClose={closeModal} size="xl">
                <ModalOverlay />
                <ModalContent maxW={"2xl"}>
                  <Center>
                    <ModalHeader>Author Details</ModalHeader>
                  </Center>
                <ModalCloseButton />
                <ModalBody size="lg">
                  <Center>
                    <Avatar
                    size="xl"
                    src={authorPhoto}
                    name={`Avatar of ${authorName}`}
                    />
                      </Center>
                      <Center m={3}>
                        <p>Author: {authorName}</p>
                      </Center>

                    <PostAndComment authorId={authorIdent}
                    authorName={authorName}/>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={closeModal}>
                    Close
                    </Button>
                </ModalFooter>
                </ModalContent>
            </Modal>
    </>
  );
};

AuthorModal.propTypes = {
  authorName: PropTypes.string,
  authorPhoto: PropTypes.string,
  authorIdent: PropTypes.string,
};

export default AuthorModal;
