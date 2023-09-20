import { useState } from "react";
import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, Alert, AlertIcon, AlertDescription } from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { auth } from "../../config/firebase.config";

const Reauthentication = ({ onChange }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [show, setShow] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleClick = () => setShow(!show);

    const handleSubmit = (e) => {
        e.preventDefault();
        const credential = EmailAuthProvider.credential(
            formData.email,
            formData.password,
        )

        reauthenticateWithCredential(auth.currentUser, credential).then(() => {
            setFormData({
                email: '',
                password: '',
            });
            setError('');
            onChange();
        }).catch(e => setError('Incorrect email or password.'))
    }

    return (
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
                        <Button variant={'ghost'} colorScheme='grey' onClick={handleClick}>
                            {show ? <ViewOffIcon /> : <ViewIcon />}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <Button type='submit' colorScheme='teal' mt={4} mb={4} w={"full"}>
                Login
            </Button>
            {error && <Alert status='error' mb={3}>
                            <AlertIcon />
                            <AlertDescription>
                                {error}
                            </AlertDescription>
                        </Alert>}
        </form>
    );
};

export default Reauthentication;
