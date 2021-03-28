import { useContext, useEffect, useReducer, useState } from "react";
import { Redirect, useParams } from "react-router";
import DashboardLayout from "../components/DashboardLayout";
import UserDetails from "../components/UserDetails";
import UserProvider, { UserContext } from "../components/UserProvider";
import { FormLabel, RadioGroup, VStack, HStack, Input, Heading, Radio, Button, Textarea } from '@chakra-ui/react';
import './ProfilePage/ProfilePage.css';
import fetchApi from "../utils/fetchApi";

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
        console.log(userDetails)
        if (action === 'profile'){
            await fetchApi("/profile/", "POST", {name: userDetails.name, birth_date: userDetails.birth_date, gender: userDetails.gender, bio: userDetails.profile_bio, profile_picture: userDetails.image_file})
            dispatch({id: userId})
        }
    };

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
                console.log(user_profile)
                if (!controller.signal.aborted){ 
                    if (user_profile === null) {
                        dispatch({id: null, image_file: "", name: "", birth_date: new Date(), gender: "", profile_bio: ""});
                    }else{
                        dispatch(user_profile);
                    }
                }
            } catch (err) {
                if (err.name === `AbortError`) {
                    // No problem, we did this
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
        return <DashboardLayout>loading</DashboardLayout>
    }
    if ( userDetails.id !== null ){
        return <DashboardLayout>
                    <UserDetails user={userDetails}>
                        
                    </UserDetails>
                </DashboardLayout>
    }
    // if the wrong user is accessing profile redirect to home
    if ( userId !== user.id ){
        return <Redirect to="/"></Redirect>
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