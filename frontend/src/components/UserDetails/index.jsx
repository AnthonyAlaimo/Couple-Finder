import { Heading, VStack, HStack, Container, Box, Img, Form, Textarea, Button} from "@chakra-ui/react"
// import { useState } from "react";
import './userDetails.css';
export default function UserDetails({ user }) {
    // const { user } = useState(UserContext);
    // const onBioSubmit = async (bio) => {
    //     console.log(bio);
    //     //await fetchImageApi("/changeBio/", "PUT", {bio: bio})
    // }
    // const setVisibility = (id) => {
    //     let elmt = document.getElementById(id);
    //     if (elmt.style.display == "flex") elmt.style.display = "none";
    //     else {
    //     elmt.style.display = "flex";
    //     document.getElementById(id).scrollIntoView();
    //     }
    // }
    // "Pure component
    // if (user.pictures === undefined){
    //     // window.location.reload();
    //     return <Heading as="h1" size="4xl">loading</Heading>
    // }
    console.log(user);
    return (
            <HStack>
                <Box className='lrp__card' maxW='800px' maxH='60%' w='90%' m='auto' p='4' borderRadius='md'>
                <HStack justifyContent="center">
                <Heading className="centre" as="h1" size="4xl">Profile</Heading>
                <Button /*onClick={() => setVisibility("bio_edit")}*/>Edit Bio.</Button>
                </HStack>
                <HStack p="8">
                    {/* default image, need to SRC PATH*/}
                    <Img className="img_shadow"
                        boxSize="350px"
                        objectFit="cover"
                        src={"/api/pictures/"+user?.pictures?.[0]?.id+"/picture/"}
                        alt="okay"
                    />
                    <VStack className='lrp__card img_layout profile_info' borderRadius='md' boxSize="350px">
                        <Container m='0' p='0' w='110%' borderRadius='md'>
                        <Box bg="tomato" w="100%" color="white" borderRadius='md'>
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
                        {/* <Form id="bio_edit">
                            <Textarea
                                name="new_bio"
                                placeholder="Enter Your New Biography HERE"
                            ></Textarea>
                            <Button onClick={(new_bio) => onBioSubmit(new_bio)}>Submit</Button>
                        </Form> */}
                        </Box>
                        </Container>
                    </VStack>
                </HStack>
                </Box>
            </HStack>
    );
}