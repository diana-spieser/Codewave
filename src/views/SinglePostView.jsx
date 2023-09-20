import  { useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Container, HStack, IconButton } from '@chakra-ui/react';
import { BiArrowBack } from 'react-icons/bi';
import { AuthContext } from '../context/authentication-context';
import SinglePost from '../components/posts/SinglePost';
import CommentsList from '../components/comments/CommentsList';
import NewComment from '../components/comments/NewComment';


function SinglePostView() {
const { postId } = useParams();
const [commentAdded, setCommentAdded] = useState(false);
const { user, userData } = useContext(AuthContext);
const navigate = useNavigate();

  const handleCommentAdded = () => {
    setCommentAdded(!commentAdded);
  };

  return (
    <>
      <Container maxW={'7xl'} p="12">
        <HStack spacing={2} marginTop={2}>
          <IconButton
            aria-label="Go back to Posts"
            icon={<BiArrowBack />}
            onClick={() => navigate(-1)}
          />
          <Link onClick={() => navigate(-1)}>Go back</Link>
        </HStack>
        <SinglePost commentAdded={commentAdded}/>
        <CommentsList postId={postId} key={commentAdded}  />
        {userData && <NewComment postId={postId} onCommentAdded={handleCommentAdded}/>}
      </Container>
    </>
  );
}

export default SinglePostView;
