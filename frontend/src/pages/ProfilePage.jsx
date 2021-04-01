import { useContext, useEffect, useReducer, useState } from "react";
import { Redirect, useParams } from "react-router";
import DashboardLayout from "../components/DashboardLayout";
import UserDetails from "../components/UserDetails";
import UserProvider, { UserContext } from "../components/UserProvider";
import { FormLabel, RadioGroup, VStack, HStack, Input, Heading, Radio, Button, Textarea, Stack } from '@chakra-ui/react';
import './ProfilePage/ProfilePage.css';
import fetchApi from "../utils/fetchApi";
import { Wrap, WrapItem } from "@chakra-ui/react"
import {
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
  } from "@chakra-ui/react"

function reducer(state = {}, action) {
    if (action === null){
        return action;
    }
    return Object.assign({}, state, action);
}

function ProfilePage() {
    const { user } = useContext(UserContext);
    const params = useParams();
    const userId = params.userID ?? user?._id;

    const [ userDetails, dispatch ] = useReducer(reducer, null);

    const onSubmit = async (action) => {
        if (action === 'profile'){
            await fetchApi("/profile/", "POST", {name: userDetails.name, birth_date: userDetails.birth_date, gender: userDetails.gender, bio: userDetails.profile_bio/*, profile_picture: userDetails.image_file.files[0]*/})
            dispatch({id: userId});
        }
        if (action === 'survey'){
            console.log(userDetails.surveyResults);
            await fetchApi("/survey/", "POST", userDetails.surveyResults);
            dispatch({surveyComplete: true});
        }
        if (action === 'filter'){
            // if lower is greater than upper, reset values
            if (userDetails.filterResults.upper_age_range < userDetails.filterResults.lower_age_range){
                userDetails.filterResults.upper_age_range = 90;
                userDetails.filterResults.lower_age_range = 18;
            }
            let result = {lower_age_range: userDetails.filterResults.lower_age_range, 
                        upper_age_range: userDetails.filterResults.upper_age_range,
                        preferred_gender: userDetails.filterResults.preferred_gender, 
                        smokes: userDetails.filterResults.smokes};
            if (result.lower_age_range === undefined){
                result.lower_age_range = 18
            }
            if (result.upper_age_range === undefined){
                result.upper_age_range = 90
            }
            console.log(result);
            await fetchApi("/filters/", "PUT", result);
        }
    };

    const setSurveyResults = async (o_num, q_text) =>{
        userDetails.surveyResults[q_text] = parseInt(o_num);
    }
    const setFilterResults = async (o_answer, q_text) =>{
        if (q_text === "preferred_age_upper"){
            userDetails.filterResults.upper_age_range = parseInt(o_answer);
        }
        else if (q_text === "preferred_age_lower"){
            userDetails.filterResults.lower_age_range = parseInt(o_answer);
        }
        else if (q_text === "preferred_gender"){
            userDetails.filterResults.preferred_gender = o_answer;
        }else if (q_text === "smokes"){
            userDetails.filterResults.smokes =  parseInt(o_answer);
        }
    }

    const handler = (e) => {
        console.log(e, e.target);
        dispatch({[e.target.name]: e.target.value});
    }

    useEffect(() => {
        const controller = new AbortController();
        dispatch(null);
        const runFetch = async () => {
            try {
                // TODO: Some fetch for user information
                const user_profile = await fetchApi("/profile/", "GET", null, controller.signal);
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
                            filterResults: {lower_age_range: "", upper_age_range:"", preferred_gender: "", smokes: ""}, 
                            survey: survey,
                            surveyComplete: false});
                    }
                    else if (user_profile.traits_resp === 0) {
                    // else if (surveyResults.length === 0){
                        dispatch(user_profile);
                        dispatch({survey: survey,
                                surveyComplete: false,
                                surveyResults: surveyResults,
                                filterResults: {lower_age_range: "", upper_age_range:"", preferred_gender: "", smokes: ""}})
                    }
                    else{
                        dispatch(user_profile);
                        dispatch({survey: survey, surveyResults: surveyResults, surveyComplete: true, filterResults: user_profile.filters});
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


    console.log(userDetails);
    if ( userDetails === null ){
        // if (userId === undefined){
        //     return <Redirect to="/"></Redirect>
        // }
        return <DashboardLayout>loading</DashboardLayout>
    }
    if (userDetails.surveyResults === undefined){
        return <DashboardLayout>loading</DashboardLayout>
    }
    if ( userDetails.id !== null){
        // SURVEY RESPONSE CASE: SURVEY HASN'T BEEN COMPLETED
        if (userDetails.surveyComplete === false){
            return <DashboardLayout>
                        <UserDetails user={userDetails}></UserDetails>
                         <VStack className='lrp__card img_layout profile_info' borderRadius='md' maxW="600px" boxSize="700px">
                        <Heading className='display' as="h3" color="white" bg="black" w="110%" borderRadius="5px" p="10px">Complete Your Matching Survey</Heading>
                        <Heading as="h2" size="md">How would you describe your personality?</Heading>
                        <RadioGroup value={userDetails.surveyResults.personality_resp} onChange={(q1) => {setSurveyResults(q1, "personality_resp")}}>
                            <HStack spacing="24px">
                            <Wrap>
                                <WrapItem>
                                <Radio value="1" name="q1">Shy and naive</Radio>
                                <Radio value="2" name="q1">Brave and talkative</Radio>
                                <Radio value="3" name="q1">Honest and reliable</Radio>
                                <Radio value="4" name="q1">Easy-going and cheerful</Radio>
                                <Radio value="5" name="q1">Sympathetic and tolerant</Radio>
                                <Radio value="6" name="q1">Energetic and open minded</Radio>
                                </WrapItem>
                            </Wrap>
                            </HStack>
                        </RadioGroup>
                        <Heading as="h2" size="md">What traits do you look for in a partner?</Heading>
                        <RadioGroup value={userDetails.surveyResults.traits_resp} onChange={(q2) => {setSurveyResults(q2, "traits_resp")}}>
                            <HStack spacing="24px">
                            <Wrap maxW="200">
                                <WrapItem>
                                <Radio value="1" name="q2">Kind</Radio>
                                <Radio value="2" name="q2">Energetic</Radio>
                                <Radio value="3" name="q2">Honest</Radio>
                                <Radio value="4" name="q2">Naive</Radio>
                                <Radio value="5" name="q2">Talkative</Radio>
                                <Radio value="6" name="q2">Moody</Radio>
                                <Radio value="7" name="q2">Open minded</Radio>
                                <Radio value="8" name="q2">Respectful</Radio>
                                <Radio value="9" name="q2">Passionate</Radio>
                                <Radio value="10" name="q2">Good looks</Radio>
                                </WrapItem>
                            </Wrap>
                            </HStack>
                        </RadioGroup>
                        <Heading as="h2" size="md">What kind of music puts you in the mood?</Heading>
                        <RadioGroup value={userDetails.surveyResults.music_resp} onChange={(q3) => {setSurveyResults(q3, "music_resp")}}>
                            <HStack spacing="24px">
                                <Radio value="1" name="q3">Soul music</Radio>
                                <Radio value="2" name="q3">Jazz</Radio>
                                <Radio value="3" name="q3">Blues</Radio>
                                <Radio value="4" name="q3">Classical music</Radio>
                                <Radio value="5" name="q3">House music</Radio>
                            </HStack>
                        </RadioGroup>
                        <Heading as="h2" size="md">Out of the following foods, what appeals to you the most?</Heading>
                        <RadioGroup value={userDetails.surveyResults.foods_resp} onChange={(q4) => {setSurveyResults(q4, "foods_resp")}}>
                            <HStack spacing="24px">
                                <Radio value="1" name="q4">Pizza</Radio>
                                <Radio value="2" name="q4">Pasta</Radio>
                                <Radio value="3" name="q4">Sushi</Radio>
                                <Radio value="4" name="q4">Hamburger</Radio>
                                <Radio value="5" name="q4">Chinese</Radio>
                            </HStack>
                        </RadioGroup>
                        <Heading as="h2" size="md">How do you feel about pets and animals?</Heading>
                        <RadioGroup value={userDetails.surveyResults.pets_resp} onChange={(q5) => {setSurveyResults(q5, "pets_resp")}}>
                            <HStack spacing="24px">
                                <Radio value="1" name="q5">Not very much</Radio>
                                <Radio value="2" name="q5">Not much</Radio>
                                <Radio value="3" name="q5">Neutral</Radio>
                                <Radio value="4" name="q5">Somewhat like</Radio>
                                <Radio value="5" name="q5">Adore</Radio>
                            </HStack>
                        </RadioGroup>
                        <Heading as="h2" size="md">Do you smoke?</Heading>
                        <RadioGroup value={userDetails.surveyResults.smokes_resp} onChange={(q6) => {setSurveyResults(q6, "smokes_resp")}}>
                            <HStack spacing="24px">
                                <Radio value="1" name="q6">Not at all</Radio>
                                <Radio value="2" name="q6">Somewhat</Radio>
                                <Radio value="3" name="q6">Frequently</Radio>
                            </HStack>
                        </RadioGroup>
                            <Button onClick={() => onSubmit(`survey`)}>Submit</Button>
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
                        <VStack className='lrp__card img_layout profile_info' borderRadius='md' boxSize="500px">
                        <Heading as="h3" color="white" bg="black" w="110%" borderRadius="5px" p="2px">Survey Answers</Heading>
                         {stringResponse.map((result, key) => 
                            <VStack key={key}>
                                <Heading as="h2" size="md">{result.q}</Heading>
                                <Heading as="h3" size="md" color="blue">{result.o}</Heading>
                            </VStack>
                         )}
                         </VStack>
                         {/* filter code */}
                         <VStack className='lrp__card img_layout profile_info' borderRadius='md' maxW="600px" boxSize="700px">
                        <Heading className='display' as="h3" color="white" bg="black" w="110%" borderRadius="5px" p="10px">Edit Matching Filters</Heading>
                        <Heading as="h2" size="md">Preferred Age Range</Heading>
                        <VStack>
                        <Heading as="h2" size="sm">Lowest</Heading>
                            <NumberInput value={userDetails.filterResults.lower_age_range} defaultValue={18} min={18} max={90} onChange={(lower) => {setFilterResults(lower, "preferred_age_lower")}}>
                            <NumberInputField name="lower"/>
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                            </NumberInput>
                        <Heading as="h2" size="sm">Highest</Heading>
                            <NumberInput value={userDetails.filterResults.upper_age_range} defaultValue={90} min={18} max={90} onChange={(upper) => {setFilterResults(upper, "preferred_age_upper")}}>
                            <NumberInputField name="upper"/>
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                            </NumberInput>
                        </VStack>

                        <Heading as="h2" size="md">Preferred Gender</Heading>
                        <RadioGroup value={userDetails.filterResults.preferred_gender} onChange={(q2) => {setFilterResults(q2, "preferred_gender")}}>
                            <HStack spacing="24px">
                                <Radio value="Male" name="q2">Male</Radio>
                                <Radio value="Female" name="q2">Female</Radio>
                                <Radio value="Both" name="q2">Both</Radio>
                            </HStack>
                        </RadioGroup>
                        <Heading as="h2" size="md">Partner's Smoking Habit</Heading>
                        <RadioGroup value={userDetails.filterResults.smokes} onChange={(q3) => {setFilterResults(q3, "smokes")}}>
                            <HStack spacing="24px">
                                <Radio value="1" name="q3">Not at all</Radio>
                                <Radio value="2" name="q3">Somewhat</Radio>
                                <Radio value="3" name="q3">Frequently</Radio>
                            </HStack>
                        </RadioGroup>
                        <Button onClick={() => onSubmit(`filter`)}>Submit</Button>
                        </VStack>
                        </HStack>
                    </DashboardLayout>
        }
    }
    return (
        <DashboardLayout>
            <VStack className='lrp__card' maxW='800px' w='80%' m='auto' p='8' borderRadius='md'>
                <Heading as="h1" size="4xl">Create Your Profile</Heading>
                <VStack
                    onSubmit={e => {
                        e.preventDefault();
                        return false;
                    }}
                    as='form'
                    spacing='4'
                    w='80%'
                >
                   <Input background="none"
                        name="image_file"
                        variant='filled'
                        type="file"
                        value={userDetails.image_file}
                        onChange={handler}
                        placeholder="choose a profile image"
                        accept="image/*"
                        required
                        /> 
                    <Input
                        name="name"
                        variant='filled'
                        value={userDetails.name}
                        onChange={handler}
                        placeholder="name"
                        type='text'
                        required
                    />
                    <Input
                        name="birth_date"
                        variant='filled'
                        value={userDetails.birth_date}
                        onChange={handler}
                        placeholder="Date of Birth"
                        type='date'
                        required
                    />

                    <FormLabel>Select your gender</FormLabel>
                    <RadioGroup value={userDetails.gender} onChange={(gender) => {dispatch({gender})}}>
                        <HStack spacing="24px">
                        <Radio value="Male" name="gender">Male</Radio>
                        <Radio value="Female" name="gender">Female</Radio>
                        </HStack>
                    </RadioGroup>
                    <Textarea
                        name="profile_bio"
                        variant='filled'
                        value={userDetails.profile_bio}
                        onChange={handler}
                        placeholder="Write your profile biography here"
                        type='text'
                        required
                />
                    <HStack>
                        <Button onClick={() => onSubmit(`profile`)}>Submit</Button>
                    </HStack>
                </VStack>
            </VStack>
            
        </DashboardLayout>
    );
}

export default ProfilePage;