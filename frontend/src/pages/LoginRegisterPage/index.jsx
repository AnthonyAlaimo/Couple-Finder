import { Flex, VStack, HStack, Input, Heading, Text, Button } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import { useContext, useState } from 'react';
import { UserContext } from '../../components/UserProvider';
import './LoginRegisterPage.css';
import { useToast } from "@chakra-ui/react"

function LoginRegisterPage() {
    const toast = useToast()
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const { login } = useContext(UserContext);
    const { register } = useContext(UserContext);
    const history = useHistory();

    const onSubmit = async (action) => {
        if (action == 'login'){
            console.log("working?")
            await login(email, password);
        }else if (action == 'register'){
            await register(email, password);
        }
        history.push(`/profile`);
    };

    return (
        <Flex align='center' justify='center' w="100%" h="100vh" bgGradient="linear(to-r, green.200, pink.500)">
            <VStack className='lrp__card' maxW='800px' w='80%' m='auto' p='8' borderRadius='md'>
                <Heading as="h1" size="4xl">Couple Finder</Heading>
                <VStack p='2rem 0'>
                    <Heading as="h2" size="lg">Welcome to Couple Finder</Heading>
                    <Text align='center' size='md'>
                        Tired and alone? Introducing, a brand new relationship finder
                        web app for those who need just a little bit of help meeting
                        new people. Whether you're looking for a romantic partner or
                        new best friend, you can be sure to find those who match
                        what you're looking for.
                    </Text>
                </VStack>
                <VStack
                    onSubmit={e => {
                        e.preventDefault();
                        return false;
                    }}
                    as='form'
                    spacing='4'
                    w='80%'
                >
                    <Input
                        variant='filled'
                        value={email}
                        onChange={e => setEmail(e.currentTarget.value)}
                        placeholder="email"
                        type='email'
                        required
                    />
                    <Input
                        variant='filled'
                        value={password}
                        onChange={e => setPassword(e.currentTarget.value)}
                        placeholder="password"
                        type='password'
                        required
                    />
                    <HStack>
                        <Button onClick={() => onSubmit(`login`)}
                        // onClick={() =>
                        //     toast({
                        //       title: "Login Failed",
                        //       position: 'top',
                        //       description: "Password or Email is incorrect",
                        //       status: "error",
                        //       duration: 9000,
                        //       isClosable: true,
                        //     })}
                            >Login</Button>
                        <Button onClick={() => onSubmit(`register`)}
                        // onClick={() =>
                        //     toast({
                        //       title: "Registration Failed",
                        //       position: 'top',
                        //       description: "Invalid email address",
                        //       status: "error",
                        //       duration: 9000,
                        //       isClosable: true,
                        //     })}
                        >Register</Button>
                    </HStack>
                </VStack>
            </VStack>
        </Flex>
    );
}

export default LoginRegisterPage;