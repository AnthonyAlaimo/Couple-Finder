import { useContext, useEffect, useReducer } from "react";
import { useParams } from "react-router";
import DashboardLayout from "../components/DashboardLayout";
import UserDetails from "../components/UserDetails";
import { UserContext } from "../components/UserProvider";
import { FormLabel, RadioGroup, VStack, HStack, Input, Heading, Radio, Button, Textarea } from '@chakra-ui/react';
import './ProfilePage/ProfilePage.css';
import fetchApi from "../utils/fetchApi";
import fetchImageApi from "../utils/fetchImageApi";
import { Wrap, WrapItem } from "@chakra-ui/react"
import { NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper } from "@chakra-ui/react"
import { useToast } from "@chakra-ui/react"
import _ from "lodash"

function reducer(state = {}, action) {
    if (action === null){
        return action;
    }
    return _.merge({}, state, action)
    // return Object.assign({}, state, action);
}
  
function ProfilePage() {
    const toast = useToast()
    const { user } = useContext(UserContext);
    const params = useParams();
    const userId = params.userID ?? user?._id;

    const [ userDetails, dispatch ] = useReducer(reducer, null);


    const onSubmit = async () => {
        const action = userDetails.action;
        if (action === 'profile'){
            let profile = await fetchImageApi("/profile/", "POST", {name: userDetails.name, birth_date: userDetails.birth_date, gender: userDetails.gender, bio: userDetails.profile_bio, profile_picture: userDetails.image_file});
            dispatch({...profile, id: userId});
        }
        if (action === 'survey'){
            let results = await fetchApi("/survey/", "PUT", userDetails.surveyResults);
            dispatch({...results, surveyComplete: true, filterResults: {lower_age_range: 18, upper_age_range: 90, preferred_gender: "", smokes: ""}});
        }
        if (action === 'filter'){
            // if lower is greater than upper, reset values
            if (userDetails.filterResults.upper_age_range < userDetails.filterResults.lower_age_range){
                userDetails.filterResults.upper_age_range = 90;
                userDetails.filterResults.lower_age_range = 18;
            }
            let filters = await fetchApi("/filters/", "PUT", userDetails.filterResults);
            dispatch({filter: filters});
        }
    };

    const setSurveyResults = async (o_num, q_text) =>{
        // userDetails.surveyResults[q_text] = parseInt(o_num);
        dispatch({surveyResults:{
            ...userDetails.surveyResults,
            [q_text]:parseInt(o_num),
            },
        });
    }
    const setFilterResults = async (o_answer, q_text) =>{
        if (q_text === "preferred_gender"){
            dispatch({filterResults:{
                ...userDetails.filterResults,
                [q_text]:o_answer,
                },
            });
        }else{
            dispatch({filterResults:{
                ...userDetails.filterResults,
                [q_text]:parseInt(o_answer),
                },
            });
        }
    }

    const handler = (e) => {
        // console.log(e, e.target);
        dispatch({[e.target.name]: e.target.value});
    }

    const imageHandler = (e) => {
        // console.log(e, e.target);
        dispatch({[e.target.name]: e.target.files[0]});
    }

    useEffect(() => {
        const controller = new AbortController();
        dispatch(null);
        const runFetch = async () => {
            try {
                // TODO: Some fetch for user information
                const user_profile = await fetchApi("/profile/", "GET", null);
                const survey = await fetchApi("/survey/", "GET", null);
                let surveyResults = null;
                if (user_profile !== null){
                    surveyResults = { personality_resp: user_profile.personality_resp,
                                    traits_resp: user_profile.traits_resp, 
                                    music_resp: user_profile.music_resp,
                                    foods_resp: user_profile.foods_resp, 
                                    pets_resp: user_profile.pets_resp,
                                    smokes_resp: user_profile.smokes_resp};
                }
                if (!controller.signal.aborted){ 
                    if (user_profile === null) {
                        dispatch({id: null, 
                            image_file: "", 
                            name: "", 
                            birth_date: new Date(), 
                            gender: "", 
                            profile_bio: "",
                            surveyResults: { personality_resp: 0,
                                traits_resp: 0, 
                                music_resp: 0,
                                foods_resp: 0, 
                                pets_resp: 0,
                                smokes_resp: 0},
                            filterResults: {lower_age_range: 18, upper_age_range: 90, preferred_gender: "", smokes: ""}, 
                            survey: survey,
                            surveyComplete: false});
                    }
                    else if (user_profile.traits_resp === 0) {
                    // else if (surveyResults.length === 0){
                        dispatch({...user_profile,
                                survey: survey,
                                surveyComplete: false,
                                surveyResults: surveyResults,
                                filterResults: {lower_age_range: 18, upper_age_range: 90, preferred_gender: "", smokes: ""}})
                    }else if (user_profile.filter === null){
                        dispatch({...user_profile,
                            survey: survey,
                            surveyComplete: true,
                            surveyResults: surveyResults,
                            filterResults: {lower_age_range: 18, upper_age_range: 90, preferred_gender: "", smokes: ""}})
                    }else{
                        dispatch({...user_profile, survey: survey, surveyResults: surveyResults, surveyComplete: true, filterResults: user_profile.filter});
                    }
                }
            } catch (err) {
                if (err.name === `AbortError`) {
                    // No problem, we did this
                    //maybe put redirect code here for when user is unauthorized
                    return;
                }
                throw err;
            }
        };

        runFetch();

        return () => {
            controller.abort();
        };
    }, [ userId ]);


    if ( userDetails === null ){
        return <DashboardLayout><Heading className="centre" as="h1" size="2xl">Loading</Heading></DashboardLayout>
    }
    if (userDetails.surveyResults === undefined){
        return <DashboardLayout><Heading className="centre" as="h1" size="2xl">Loading</Heading></DashboardLayout>
    }
    if ( userDetails.id !== null){
        // SURVEY RESPONSE CASE: SURVEY HASN'T BEEN COMPLETED
        if (userDetails.surveyComplete === false){
            return <DashboardLayout>
                    <VStack>
                        <UserDetails user={userDetails}></UserDetails>
                        {/* survey */}
                         <VStack 
                            onSubmit={e => {
                                e.preventDefault();
                                onSubmit().then(()=>{
                                    toast({
                                        title: "Survey Complete",
                                        position: 'top',
                                        description: "View Survey Results below",
                                        status: "success",
                                        duration: 4000,
                                        isClosable: true
                                    })
                                }).catch(()=>{
                                    toast({
                                        title: "Survey Incomplete",
                                        position: 'top',
                                        description: "All survey fields must be filled out",
                                        status: "error",
                                        duration: 4000,
                                        isClosable: true
                                    })
                                })
                                return false;
                                }}
                                as='form'
                                p='0px 0px 5px 0px'
                                className='lrp__card img_layout profile_info' borderRadius='md' maxW="1000px" w="1000px" h="1500px" overflowX="hidden">
                        <Heading as="h3" color="white" bg="black" w="100%" borderRadius="5px" p="10px">Complete Your Matching Survey</Heading>
                        <Heading as="h2" size="md">How would you describe your personality?</Heading>
                        <RadioGroup isRequired name="q1" value={userDetails.surveyResults.personality_resp.toString()}  onChange={(q1) => {setSurveyResults(q1, "personality_resp")}}>
                            <HStack spacing="12px" p="8px">
                            <Wrap>
                                <WrapItem>
                                <Radio value="1">Shy and naive</Radio>
                                <Radio value="2" >Brave and talkative</Radio>
                                <Radio value="3" >Honest and reliable</Radio>
                                <Radio value="4" >Easy-going and cheerful</Radio>
                                <Radio value="5" >Sympathetic and tolerant</Radio>
                                <Radio value="6" >Energetic and open minded</Radio>
                                </WrapItem>
                            </Wrap>
                            </HStack>
                        </RadioGroup>
                        <Heading as="h2" size="md">What traits do you look for in a partner?</Heading>
                        <RadioGroup isRequired name="q2" value={userDetails.surveyResults.traits_resp.toString()} onChange={(q2) => {setSurveyResults(q2, "traits_resp")}}>
                            <HStack spacing="12px">
                                <VStack>
                                <Radio value="1" >Kind</Radio>
                                <Radio value="2" >Energetic</Radio>
                                </VStack>
                                <VStack>
                                <Radio value="3" >Honest</Radio>
                                <Radio value="4" >Naive</Radio>
                                </VStack>
                                <VStack>
                                <Radio value="5" >Talkative</Radio>
                                <Radio value="6" >Moody</Radio>
                                </VStack>
                                <VStack>
                                <Radio value="7" >Open minded</Radio>
                                <Radio value="8" >Respectful</Radio>
                                </VStack>
                                <VStack>
                                <Radio value="9" >Passionate</Radio>
                                <Radio value="10" >Good looks</Radio>
                                </VStack>
                            </HStack>
                        </RadioGroup>
                        <Heading as="h2" size="md">What kind of music puts you in the mood?</Heading>
                        <RadioGroup isRequired name="q3" value={userDetails.surveyResults.music_resp.toString()}  onChange={(q3) => {setSurveyResults(q3, "music_resp")}}>
                            <HStack spacing="12px">
                                <Radio value="1" >Soul music</Radio>
                                <Radio value="2" >Jazz</Radio>
                                <Radio value="3">Blues</Radio>
                                <Radio value="4">Classical music</Radio>
                                <Radio value="5">House music</Radio>
                            </HStack>
                        </RadioGroup>
                        <Heading as="h2" size="md">Out of the following foods, what appeals to you the most?</Heading>
                        <RadioGroup isRequired name="q4" value={userDetails.surveyResults.foods_resp.toString()} onChange={(q4) => {setSurveyResults(q4, "foods_resp")}}>
                            <HStack spacing="12px">
                                <Radio value="1" >Pizza</Radio>
                                <Radio value="2" >Pasta</Radio>
                                <Radio value="3" >Sushi</Radio>
                                <Radio value="4">Hamburger</Radio>
                                <Radio value="5" >Chinese</Radio>
                            </HStack>
                        </RadioGroup>
                        <Heading as="h2" size="md">How do you feel about pets and animals?</Heading>
                        <RadioGroup isRequired name="q5" value={userDetails.surveyResults.pets_resp.toString()} onChange={(q5) => {setSurveyResults(q5, "pets_resp")}}>
                            <HStack spacing="12px">
                                <Radio value="1" >Not very much</Radio>
                                <Radio value="2" >Not much</Radio>
                                <Radio value="3" >Neutral</Radio>
                                <Radio value="4" >Somewhat like</Radio>
                                <Radio value="5" >Adore</Radio>
                            </HStack>
                        </RadioGroup>
                        <Heading as="h2" size="md">Do you smoke?</Heading>
                        <RadioGroup isRequired name="q6" value={userDetails.surveyResults.smokes_resp.toString()} onChange={(q6) => {setSurveyResults(q6, "smokes_resp")}}>
                            <HStack spacing="12px">
                                <Radio value="1" >Not at all</Radio>
                                <Radio value="2" >Somewhat</Radio>
                                <Radio value="3" >Frequently</Radio>
                            </HStack>
                        </RadioGroup>
                        <Button p='8px' className="btn" type="submit" onClick={() => dispatch({action:"survey"})}>Submit</Button>
                        </VStack>
                    </VStack>
                </DashboardLayout>
        // SURVEY RESPONSE CASE: SURVEY HAS BEEN COMPLETED
        }else{
            let response=[userDetails.personality_resp, 
                userDetails.traits_resp, 
                userDetails.music_resp,
                userDetails.foods_resp, 
                userDetails.pets_resp,
                userDetails.smokes_resp]
            let count=0
            let stringResponse = [];
            userDetails.survey.forEach((q) =>{
                q.survey_options.forEach((o) =>{
                    if (o.answer_number === response[count]){
                        stringResponse.push({q: q.question_text, o: o.answer_text});
                    }
                })
                count += 1;
            })
                return <DashboardLayout>
                            <UserDetails user={userDetails}></UserDetails>
                            <HStack>
                            <VStack w='80%' h="425px" p='0px 0px 5px 0px' className='lrp__card img_layout profile_info' borderRadius='md' maxW="700px" maxH="500px" overflowX="hidden">
                            <Heading as="h3" color="white" bg="black" w="100%" borderRadius="5px" p="8px 0px">Survey Answers</Heading>
                            {stringResponse.map((result, key) => 
                                <VStack key={key}>
                                    <Heading as="h2" size="md">{result.q}</Heading>
                                    <Heading as="h3" size="md" color="blue">{result.o}</Heading>
                                </VStack>
                            )}
                            </VStack>
                            {/* filter code */}
                            <VStack onSubmit={e => {
                                    e.preventDefault();
                                    onSubmit().then(()=>{
                                        toast({
                                            title: "Filters Successfully set",
                                            position: 'top',
                                            description: "Go to inbox to check for potential matches",
                                            status: "success",
                                            duration: 4000,
                                            isClosable: true
                                        })
                                    }).catch(()=>{
                                        toast({
                                            title: "Filters not set",
                                            position: 'top',
                                            description: "Failed to set filters, make sure to set all fields!",
                                            status: "error",
                                            duration: 4000,
                                            isClosable: true
                                        })
                                    })
                                    return false;
                                    }}
                                    as='form'
                                    w='80%' h="425px"
                                    p='0px 0px 5px 0px'
                                    className='lrp__card img_layout profile_info' borderRadius='md' maxW="700px" maxH="500px" overflow="hidden">
                            <Heading className='display' as="h3" color="white" bg="black" w="100%" borderRadius="5px" p="8px 0px">Edit Matching Filters</Heading>
                            <Heading as="h2" size="md">Preferred Age Range</Heading>
                            <VStack>
                            <Heading as="h2" size="sm">Lowest</Heading>
                                <NumberInput value={userDetails?.filterResults?.lower_age_range?.toString()} min={18} max={90} onChange={(lower) => {setFilterResults(lower, "lower_age_range")}}>
                                <NumberInputField/>
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                                </NumberInput>
                            <Heading as="h2" size="sm">Highest</Heading>
                                <NumberInput value={userDetails?.filterResults?.upper_age_range?.toString()} min={18} max={90} onChange={(upper) => {setFilterResults(upper, "upper_age_range")}}>
                                <NumberInputField/>
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                                </NumberInput>
                            </VStack>

                            <Heading as="h2" size="md">Preferred Gender</Heading>
                            <RadioGroup isRequired value={userDetails?.filterResults?.preferred_gender} defaultValue={userDetails.filterResults.preferred_gender} onChange={(q2) => {setFilterResults(q2, "preferred_gender")}}>
                                <HStack spacing="24px">
                                    <Radio value="MALE" >Male</Radio>
                                    <Radio value="FEMALE" >Female</Radio>
                                    <Radio value="BOTH" >Both</Radio>
                                </HStack>
                            </RadioGroup>
                            <Heading as="h2" size="md">Partner's Smoking Habit</Heading>
                            <RadioGroup isRequired value={userDetails?.filterResults?.smokes?.toString()} defaultValue={userDetails.filterResults.smokes} onChange={(q3) => {setFilterResults(q3, "smokes")}}>
                                <HStack spacing="24px">
                                    <Radio value="1" >Not at all</Radio>
                                    <Radio value="2" >Somewhat</Radio>
                                    <Radio value="3" >Frequently</Radio>
                                </HStack>
                            </RadioGroup>
                            <Button p='8px' type="submit" onClick={() => dispatch({action: "filter"})}>Submit</Button>
                            </VStack>
                            </HStack>
                        </DashboardLayout>
            //}
        }
    }
    return (
        <DashboardLayout>
            <VStack className='lrp__card' maxW='1000px' w='80%' m='auto' p='8' borderRadius='md' overflow="hidden">
                <Heading as="h1" size="2xl">Create Your Profile</Heading>
                <VStack
                    onSubmit={e => {
                        e.preventDefault();
                        onSubmit().then(()=>{
                            toast({
                                title: "Profile Successful Created",
                                position: 'top',
                                description: "",
                                status: "success",
                                duration: 4000,
                                isClosable: true
                            })
                        }).catch(()=>{
                            toast({
                                title: "Profile Not Created",
                                position: 'top',
                                description: "Missing profile fields, Age must be 18+",
                                status: "error",
                                duration: 4000,
                                isClosable: true
                            })
                        })
                        return false;
                    }}
                    as='form'
                    spacing='4'
                    w='80%'
                >
                   <Input background="none"
                        id="image_id"
                        name="image_file"
                        variant='filled'
                        type="file"
                        onChange={imageHandler}
                        placeholder="choose a profile image"
                        accept="image/*"
                        isRequired
                        /> 
                    <Input
                        id="name"
                        name="name"
                        variant='filled'
                        value={userDetails.name}
                        onChange={handler}
                        placeholder="name"
                        type='text'
                        isRequired
                    />
                    <Input
                        id="birth_date"
                        name="birth_date"
                        variant='filled'
                        value={userDetails.birth_date}
                        onChange={handler}
                        placeholder="Date of Birth"
                        type='date'
                        isRequired
                    />
                    <FormLabel>Select your gender</FormLabel>
                    <RadioGroup required id="gender" value={userDetails.gender} onChange={(gender) => {dispatch({gender})}}>
                        <HStack spacing="24px">
                        <Radio value="Male" name="gender">Male</Radio>
                        <Radio value="Female" name="gender">Female</Radio>
                        </HStack>
                    </RadioGroup>
                    <Textarea
                        id="profile_bio"
                        name="profile_bio"
                        variant='filled'
                        value={userDetails.profile_bio}
                        onChange={handler}
                        placeholder="Write your profile biography here"
                        type='text'
                        isRequired
                    />
                    <HStack>
                        <Button type="submit" onClick={() => dispatch({ action: "profile" })}>Submit</Button>
                    </HStack>
                </VStack>
            </VStack>
            
        </DashboardLayout>
    );
}

export default ProfilePage;