import {
  Text,
  chakra,
  useToast,
  IconButton,
  Flex,
  useColorModeValue,
  Button,
  Textarea,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Stack,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import { useState, useContext } from "react";
import { editComment } from "../../services/comment.services";
import { AuthContext } from "../../context/authentication-context";
import { EditIcon } from "@chakra-ui/icons";

function SingleCommentCard({ content, commentId, authorId }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const [hovered, setHovered] = useState(false);
  const { userData } = useContext(AuthContext);
  const toast = useToast();

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = (comment) => {
    if (!editedContent || editedContent.length < 10) {
      toast({
        title: "Validation Error",
        description: "Comment must not be empty and should have at least 10 characters.",
        status: "error",
      });
      return;
    }
    editComment(comment, editedContent);
    setIsEditing(false);
  };

  const handleClose = () => {
    setIsEditing(false);
    setEditedContent(content);
  };

  return (
    <Flex
      boxShadow={"lg"}
      maxW={"1200px"}
      direction={{ base: "column-reverse", md: "row" }}
      width={"full"}
      rounded={"xl"}
      mb={4}
      p={10}
      overflowWrap="break-word"
      wordBreak="break-word"
      justifyContent={"left"}
      position={"relative"}
      bg={useColorModeValue("white", "gray.800")}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      opacity={hovered ? 1 : 0.9}

    >
      <Flex
        direction={"column"}
        textAlign={"left"}
        justifyContent={"space-between"}
      >
        <Stack fontWeight={"medium"} fontSize={"15px"} pb={4} position="relative"
        >
          <Text>{content}</Text>
          {userData && userData.uid === authorId && (
            <Flex opacity={hovered ? 1 : 0}  transition="opacity 0.5s">
            <Text color="gray.500" mr={2}>Edit Comment:</Text>
            <IconButton
            icon={<EditIcon />}
            size="xs"
            aria-label="Edit comment"
            onClick={handleEditClick}
          />
          </Flex>
          )}
        </Stack>
        <Modal isOpen={isEditing} onClose={handleClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Edit Comment</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                size="sm"
              />
            </ModalBody>
            <ModalFooter>
              <Button
                bg="blue"
                mr={3}
                onClick={() => handleSaveClick(commentId)}
              >
                Save
              </Button>
              <Button onClick={handleClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Flex>
    </Flex>
  );
}

SingleCommentCard.propTypes = {
  content: PropTypes.string,
  commentId: PropTypes.string,
  authorId: PropTypes.string
};

export default SingleCommentCard;
