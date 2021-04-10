import { Heading, VStack, HStack, Container, Box, Img, Form, Textarea, Button} from "@chakra-ui/react"
// import { useState } from "react";
import './userDetails.css';
export default function UserDetails({ user }) {
    return (
            <HStack>
                <Box className='lrp__card' maxW='1000px' maxH='60%' w='90%' m='auto' p='4' borderRadius='md' overflow="hidden">
                <HStack justifyContent="center">
                <Heading className="centre" as="h1" size="2xl">Profile</Heading>
                </HStack>
                <HStack p="8">
                    {/* default image, need to SRC PATH*/}
                    <Img className="img_shadow"
                        h="350px"
                        w="450px"
                        objectFit="cover"
                        src={"/api/pictures/"+user?.pictures?.[0]?.id+"/picture/"}
                        alt="Image Missing"
                    />
                    <VStack className='lrp__card img_layout profile_info' borderRadius='md' w="450px" h="350px" overflow="hidden">
                        <Container m='0' p='0' w='110%' borderRadius='md'>
                        <Box bg="black" w="100%" color="white" borderRadius='md' padding="8px 0px">
                        <Heading as="h2" size="lg">{user?.name}</Heading>
                        </Box>
                        <Box p="2px" borderRadius="md" px={4}>
                        <Heading as="h3" size="md">{user?.gender}</Heading>
                        </Box>
                        <Box p="2px" borderRadius="md" px={4}>
                        <Heading as="h3" size="md">{user?.age}</Heading>
                        </Box>
                        <Box p="2px" borderRadius="md" px={4}>   
                        <Heading as="h5" size="sm" >{user?.bio}</Heading>
                        </Box>
                        </Container>
                    </VStack>
                </HStack>
                </Box>
            </HStack>
    );
}