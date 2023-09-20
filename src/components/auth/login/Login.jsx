import { useState, useContext } from "react";
import { AuthContext } from "../../../context/authentication-context";
import { loginUser } from "../../../services/auth.services";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { REGISTER } from "../../../common/Routes";
import {
  Box,
  Heading,
  Input,
  Button,
  FormControl,
  FormLabel,
  InputRightElement,
  InputGroup,
  Flex,
  Stack,
  Text,
  Link,
  useToast,
  Alert,
  AlertIcon,
  AlertDescription,
  useMediaQuery,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isMobile] = useMediaQuery("(max-width: 767px)");
  const [errors, setErrors] = useState('');

  const toast = useToast();
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = formData;

    loginUser(formData.email, formData.password)
      .then((credential) => {
        setUser({
          user: credential.user,
        });

        toast({
          title: "You are logged in",
          status: "success",
          isClosable: true,
          position: "top",
          duration: 4000,
          variant: "solid",
          bgColor: "green.500",
          color: "black"
        });

        setFormData({
          email: '',
          password: '',
        });
      })
      .then(() => {
        navigate("/");
      }).catch(e => setErrors('Incorrect email or password.'));
  };

  return (
    <Flex p={isMobile ? 0 : 16}  align={"center"} justify={"center"}>
      <Box
        rounded={'lg'}
        boxShadow={'lg'}
        border={'1px'}
        borderColor={'teal'}
        w={isMobile ? '100%' : 500}
        p={8}
        mb={20}>
        <Heading mb={4} textAlign={'center'}>Login</Heading>
        <form onSubmit={handleSubmit}>
          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              name="email"
              focusBorderColor='lightblue'
              value={formData.email}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl mt={4} isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                type={show ? "text" : "password"}
                name="password"
                focusBorderColor='lightblue'
                value={formData.password}
                onChange={handleChange}
              />
              <InputRightElement h={"full"}>
                <Button h="1.75rem" size="sm" onClick={handleClick}>
                  {show ? <ViewOffIcon /> : <ViewIcon />}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <Button
            type="submit"
            colorScheme='teal'
            mt={4}
            mb={4}
            w={"full"}
          >
            Login
          </Button>
          {errors && <Alert status='error'>
            <AlertIcon />
            <AlertDescription>
              {errors}
            </AlertDescription>
          </Alert>}
        </form>
        <Stack>
          <Text align={"center"} mt={2}>
            Don't have an account?{" "}
            <Link as={RouterLink} to={REGISTER} color='teal'>
              Register Here
            </Link>
          </Text>
        </Stack>
      </Box>
    </Flex>
  );
}

export default Login;
