import { useState, useContext } from 'react';
import {
    MIN_PASSWORD_LENGTH, PASSWORD_COMPLEXITY, PHONE_FORMAT,
    MIN_FIRST_NAME_LEN, MAX_FIRST_NAME_LEN, MIN_LAST_NAME_LEN, MAX_LAST_NAME_LEN
} from '../../../common/Common';
import { AuthContext } from '../../../context/authentication-context';
import { registerUser } from '../../../services/auth.services';
import { createUserHandle, getUserByHandle } from '../../../services/user.service';
import { LOGIN } from '../../../common/Routes';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import {
    Box,
    FormControl,
    FormLabel,
    Input,
    Stack,
    Button,
    Heading,
    InputGroup,
    InputRightElement,
    Text,
    Link,
    HStack,
    Flex,
    Alert,
    AlertIcon,
    AlertDescription,
} from '@chakra-ui/react';

function Register() {
    const [formData, setFormData] = useState({
        userName: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        passwordRepeat: '',
        phoneNumber: '',
        role: 'User'
    });

    const [showPw, setShowPw] = useState(false)
    const [showPwRepeat, setShowPwRepeat] = useState(false)
    const [errors, setErrors] = useState({});

    const handleClickPw = () => setShowPw(!showPw);
    const handleClickPwRepeat = () => setShowPwRepeat(!showPwRepeat);

    const handleFormReset = () => {
        setFormData({
            ...formData,
            userName: '',
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            passwordRepeat: '',
            phoneNumber: '',
        });
        setErrors({});
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({ ...prevFormData, [name]: value }));
    };

    const { setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};

        if (formData.firstName.length < MIN_FIRST_NAME_LEN || formData.firstName.length > MAX_FIRST_NAME_LEN) {
            newErrors.firstName = `First Name must be between ${MIN_FIRST_NAME_LEN} and ${MAX_FIRST_NAME_LEN} symbols.`;
        }

        if (formData.lastName.length < MIN_LAST_NAME_LEN || formData.lastName.length > MAX_LAST_NAME_LEN) {
            newErrors.lastName = `Last Name must be between ${MIN_LAST_NAME_LEN} and ${MAX_LAST_NAME_LEN} symbols.`;
        }

        if (formData.phoneNumber !== '' && !PHONE_FORMAT.test(formData.phoneNumber)) {
            newErrors.phoneNumber = 'Please enter a valid phone number (digits only).';
        }

        if (formData.password !== formData.passwordRepeat) {
            const matchError = 'The passwords do not match. Please make sure you repeat your password correctly!';
            newErrors.password = matchError;
            newErrors.passwordRepeat = matchError;
        }

        if (formData.password.length < MIN_PASSWORD_LENGTH) {
            newErrors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} symbols long`;
        }
        if (!PASSWORD_COMPLEXITY.test(formData.password)) {

            newErrors.password = `Password must contain at least one uppercase letter, 
                    one lowercase letter, one digit, and one special character.`;
        }

        if (newErrors.phoneNumber || newErrors.password || newErrors.firstName || newErrors.lastName) {
            return setErrors({ ...newErrors });
        }

        getUserByHandle(formData.userName)
            .then(snapshot => {
                if (snapshot.exists()) {
                    throw new Error('This username is already taken.');
                }

                return registerUser(formData.email, formData.password);
            })
            .then(credential => {
                return createUserHandle(formData.userName, credential.user.uid, credential.user.email,
                    formData.firstName, formData.lastName, formData.phoneNumber, formData.userName, formData.role)
                    .then(() => {
                        setUser({
                            user: credential.user
                        });
                    });
            })
            .then(() => {
                navigate('/');
            }).catch(e => setErrors({ e: e.message }));
        
        handleFormReset();
    };

    return (
        <Flex align={'center'} justify={'center'}>
            <Box
                rounded={'lg'}
                boxShadow={'lg'}
                border={'1px'}
                borderColor={'teal'}
                p={8}
                w={500}
                mb={20}>              
                <Heading mb={4} textAlign={'center'}>Sign Up</Heading>
                <form onSubmit={handleSubmit}>
                    <Stack spacing={2}>
                        <FormControl isRequired>
                            <FormLabel>Username</FormLabel>
                            <Input
                                type='text'
                                name='userName'
                                focusBorderColor='lightblue'
                                value={formData.userName}
                                onChange={handleChange}
                            />
                        </FormControl>
                        <HStack>
                            <FormControl isRequired isInvalid={!!errors.firstName}>
                                <FormLabel>First Name</FormLabel>
                                <Input
                                    type='text'
                                    name='firstName'
                                    value={formData.firstName}
                                    focusBorderColor='lightblue'
                                    onChange={handleChange}
                                />
                            </FormControl>
                            <FormControl isRequired isInvalid={!!errors.firstName}>
                                <FormLabel>Last Name</FormLabel>
                                <Input
                                    type='text'
                                    name='lastName'
                                    focusBorderColor='lightblue'
                                    value={formData.lastName}
                                    onChange={handleChange}
                                />
                            </FormControl>
                        </HStack>
                        <FormControl isRequired>
                            <FormLabel>Email address</FormLabel>
                            <Input
                                type='email'
                                name='email'
                                focusBorderColor='lightblue'
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </FormControl>
                        <FormControl isInvalid={!!errors.phoneNumber}>
                            <FormLabel>Phone Number</FormLabel>
                            <Input
                                type='tel'
                                name='phoneNumber'
                                focusBorderColor='lightblue'
                                value={formData.phoneNumber}
                                onChange={handleChange}
                            />
                        </FormControl>
                        <FormControl isRequired isInvalid={!!errors.password}>
                            <FormLabel>Password</FormLabel>
                            <InputGroup size='md'>
                                <Input
                                    pr='4.5rem'
                                    type={showPw ? 'text' : 'password'}
                                    name='password'
                                    focusBorderColor='lightblue'
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <InputRightElement h={'full'}>
                                    <Button variant={'ghost'} onClick={handleClickPw}>
                                        {showPw ? <ViewOffIcon /> : <ViewIcon />}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                            <FormLabel>Repeat Password</FormLabel>
                            <InputGroup size='md'>
                                <Input
                                    pr='4.5rem'
                                    type={showPwRepeat ? 'text' : 'password'}
                                    name='passwordRepeat'
                                    focusBorderColor='lightblue'
                                    value={formData.passwordRepeat}
                                    onChange={handleChange}
                                />
                                <InputRightElement h={'full'}>
                                    <Button variant={'ghost'} onClick={handleClickPwRepeat}>
                                        {showPwRepeat ? <ViewOffIcon /> : <ViewIcon />}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                        </FormControl>
                        <Button type='submit' loadingText='Submitting' colorScheme='teal'>
                            Sign Up
                        </Button>
                    </Stack>
                    <Stack pt={6}>
                        {Object.keys(errors).length && <Alert status='error'>
                            <AlertIcon />
                            <AlertDescription>
                                {Object.values(errors).map((err, i) => <Text key={i} mb={1}>{err}</Text>)}
                            </AlertDescription>
                        </Alert>}
                        <Text align={'center'}>
                            Already a member? <Link as={RouterLink} to={LOGIN} color='teal'>Login</Link>
                        </Text>
                    </Stack>
                </form>
            </Box>
        </Flex>
    );
}

export default Register;