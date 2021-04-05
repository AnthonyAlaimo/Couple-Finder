import { Heading, VStack, HStack, Container, Box, Img } from "@chakra-ui/react"
import './matchDetails.css';
export default function MatchDetails({ user, survey }) {
    // "Pure component
    if (user === undefined){
        return <Heading as="h1" size="4xl">loading</Heading>
    }
    ////////
    let response=[user.personality_resp, 
                user.traits_resp, 
                user.music_resp,
                user.foods_resp, 
                user.pets_resp,
                user.smokes_resp]
            let count=0
            let stringResponse = [];
            survey.forEach((q) =>{
                q.survey_options.forEach((o) =>{
                    if (o.answer_number === response[count]){
                        stringResponse.push({q: q.question_text, o: o.answer_text});
                    }
                })
                count += 1;
            })
    return (
            <HStack >
                <Box className='lrp__card' maxW='800px' maxH='60%' w='100%' m='auto' p='4' borderRadius='md'>
                <VStack p="4">
                {/* <Heading className="centre" as="h1" size="4xl">Matches</Heading> */}
                <HStack>
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
                        </Box>
                        </Container>
                    </VStack>
                </HStack>
                {/* survey response of matche */}
                <VStack className='lrp__card img_layout profile_info' borderRadius='md' boxSize="500px">
                    <Heading as="h3" color="white" bg="black" w="110%" borderRadius="5px" p="2px">Survey Answers</Heading>
                    {stringResponse.map((result, key) => 
                        <VStack key={key}>
                            <Heading as="h2" size="md">{result.q}</Heading>
                            <Heading as="h3" size="md" color="blue">{result.o}</Heading>
                        </VStack>
                    )}
                </VStack>
                </VStack>
                </Box>
            </HStack>
    );
}