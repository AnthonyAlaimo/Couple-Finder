import { Heading, VStack, HStack, Container, Box, Img } from "@chakra-ui/react"
import './userDetails.css';
export default function UserDetails({ user, heading, body }) {
    // "Pure component"
    return (
            <HStack>
                <Box className='lrp__card' maxW='800px' maxH='60%' w='90%' m='auto' p='4' borderRadius='md'>
                <Heading className="centre" as="h1" size="4xl">Profile</Heading>
                <HStack p="8">
                    {/* default image, need to fix image dataform */}
                    <Img className="img_shadow"
                        boxSize="350px"
                        objectFit="cover"
                        src="https://bit.ly/dan-abramov"
                        alt="okay"
                    />
                    <VStack className='lrp__card img_layout profile_info' borderRadius='md' boxSize="350px">
                        <Container m='0' p='0' w='110%' borderRadius='md'>
                        <Box bg="tomato" w="100%" color="white" borderRadius='md'>
                        <Heading as="h2" size="lg">{user.name}</Heading>
                        </Box>
                        <Box p="2px" borderRadius="md" px={4}>
                        <Heading as="h3" size="md">{user.gender}</Heading>
                        </Box>
                        <Box p="2px" borderRadius="md" px={4}>
                        <Heading as="h3" size="md">{user.age}</Heading>
                        </Box>
                        <Box p="2px" borderRadius="md" px={4}>
                        <Heading as="h5" size="sm" >{user.bio}</Heading>
                        </Box>
                        </Container>
                    </VStack>
                </HStack>
                </Box>
            </HStack>
    );
}