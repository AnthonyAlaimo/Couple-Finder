import DashboardLayout from "../components/DashboardLayout";
import { useContext, useEffect, useReducer } from "react";
import { UserContext } from "../components/UserProvider";
import { useParams } from "react-router";
import './ProfilePage/ProfilePage.css';
import fetchApi from "../utils/fetchApi";
import { FcLike } from '@react-icons/all-files/fc/FcLike';
import { FcDislike } from '@react-icons/all-files/fc/FcDislike';
import { IconButton, HStack, Heading, VStack } from "@chakra-ui/react";
import MatchDetails from "../components/MatchDetails";
import '../components/DashboardLayout/DashboardLayout.css';
import './InboxPage/InboxPage.css';
import { useToast } from "@chakra-ui/react";

function reducer(state = {}, action) {
    if (action === null){
        return action;
    }
    return Object.assign({}, state, action);
}


function InboxPage() {
    const toast = useToast();
    const { user } = useContext(UserContext);
    const params = useParams();
    const userId = params.userID ?? user?._id;

    const [ userDetails, dispatch ] = useReducer(reducer, null);

    const onSubmit = async () => {
        const action = userDetails.action;
        if (action === 'LikeProfile'){
            let result = await fetchApi("/match/", "PUT", {invitee: userDetails.matches[0].email, status: "PENDING"});
            let updatedMatches = userDetails.matches.slice(1);
            dispatch({matches: updatedMatches});
        }else if (action === 'DisLikeProfile'){
            await fetchApi("/match/", "PUT", {invitee: userDetails.matches[0].email, status: "DISLIKED"});
            let updatedMatches = userDetails.matches.slice(1);
            dispatch({matches: updatedMatches});
        }   
    };
    useEffect(() => {
        const controller = new AbortController();
        dispatch(null);
        const runFetch = async () => {
            try {
                // TODO: 
                if (!controller.signal.aborted){
                    const user_profile = await fetchApi("/profile/", "GET", null, controller.signal);
                    const matches = await fetchApi("/new-matches/", "GET", null);
                    const survey = await fetchApi("/survey/", "GET", null);
                    if (matches === null) {
                        dispatch({...user_profile, matches: [], survey: survey});
                    }else{
                        dispatch({...user_profile, matches: matches, survey: survey});
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
        return <DashboardLayout><Heading className="centre" as="h1" size="2xl">Loading. Complete your user <b>Survey</b> and fill out <b>Filters</b> located in the profile page</Heading></DashboardLayout>
    }
    else if(userDetails.matches.length === 0){
        return <DashboardLayout><Heading className="centre" as="h1" size="2xl">You have no current matches! Reconfigure your filters or wait for more users to join the community</Heading></DashboardLayout>
    }
    return (
        <DashboardLayout >
            <VStack justifyContent="center">
            <Heading className="centre" as="h1" size="2xl">Matches</Heading>
            <HStack className="centre" 
            onSubmit={e => {
                e.preventDefault();
                onSubmit().then(()=>{
                    toast({
                        title: "Successfully updated matches",
                        position: 'top',
                        description: "Check the request page to view matches you sent out and are recieving",
                        status: "success",
                        duration: 4000,
                        isClosable: true
                    })
                }).catch(()=>{
                    toast({
                        title: "Something went wrong, try refreshing the page",
                        position: 'top',
                        description: "",
                        status: "error",
                        duration: 4000,
                        isClosable: true
                    })
                })
                return false;
            }}
            as='form'
            spacing='4'
            w='100%'
            >
                <VStack>
                <Heading className="centre" as="h4" size="1xl">Like</Heading>
                <IconButton
                    type="submit"
                    colorScheme="teal"
                    aria-label="Call Sage"
                    icon={<FcLike />}
                    size="lg"
                    onClick={() => dispatch({action: "LikeProfile"})}></IconButton>
                </VStack>
                <MatchDetails user={userDetails.matches[0]} survey={userDetails.survey}></MatchDetails>
                <VStack>
                <Heading className="centre" as="h4" size="1xl">DisLike</Heading>
                <IconButton
                    type="submit"
                    colorScheme="teal"
                    aria-label="Call Sage"
                    icon={<FcDislike />}
                    size="lg"
                    onClick={() => dispatch({action: "DisLikeProfile"})}></IconButton>
                </VStack>
            </HStack>
            </VStack>
        </DashboardLayout>
    );
}

export default InboxPage;