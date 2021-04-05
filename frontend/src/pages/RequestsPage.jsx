import DashboardLayout from "../components/DashboardLayout";
import { useContext, useEffect, useReducer } from "react";
import { UserContext } from "../components/UserProvider";
import { useParams } from "react-router";
import fetchApi from "../utils/fetchApi";
import { Button, ChevronDownIcon, Heading, HStack, VStack, useToast } from "@chakra-ui/react";
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
  } from "@chakra-ui/react"
import './ProfilePage/ProfilePage.css';
import { result } from "lodash";

function reducer(state = {}, action) {
    if (action === null){
        return action;
    }
    return Object.assign({}, state, action);
}

function RequestsPage() {
    const toast = useToast();
    const { user } = useContext(UserContext);
    const params = useParams();
    const userId = params.userID ?? user?._id;
    const [ userDetails, dispatch ] = useReducer(reducer, null);

    const onSubmit = async () => {
        const action = userDetails.action;
        // got to fix dispatch value to remove correct invitee
        if (action === 'accept'){
            let result = await fetchApi("/match/", "PUT", {invitee: userDetails.in_email, status: "MATCHED"});
            console.log(result);
            let updatedMatches = userDetails.incoming.filter((cur) => {
                return cur.email !== result.email;
            })
            console.log(updatedMatches);
            dispatch({incoming: updatedMatches});
        }else if (action === 'decline'){
            let result = await fetchApi("/match/", "PUT", {invitee: userDetails.in_email, status: "DISLIKED"});
            console.log(result);
            let updatedMatches = userDetails.incoming.filter((cur) => {
                return cur.email !== result.email;
            })
            console.log(updatedMatches);
            dispatch({incoming: updatedMatches});
        }else if (action === 'cancel'){
            let result = await fetchApi("/match/", "PUT", {invitee: userDetails.out_email, status: "DISLIKED"});
            console.log(result);
            let updatedMatches = userDetails.outgoing.filter((cur) => {
                return cur.email !== result.email;
            })
            console.log(updatedMatches);
            dispatch({outgoing: updatedMatches});
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
                    const matches = await fetchApi("/matches/", "GET", null);
                    console.log(matches);
                    dispatch({...user_profile, incoming: matches.incoming, outgoing: matches.outgoing});
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
    if ( userDetails !== undefined){
        return <DashboardLayout>
                {/* <Menu>
                    <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                        Favourites
                    </MenuButton>
                    <MenuList>
                    {userDetails.matches.map((match, key) =>
                        <MenuItem key={key}  onClick={() => displayMatch(match)}>{match.name}</MenuItem>
                        )}
                    </MenuList>
                    </Menu> */}
                    <HStack justifyContent="center" justifyContent="space-around">
                    <VStack className='lrp__card img_layout profile_info'>
                    <Heading as="h3" color="white" bg="black" w="110%" borderRadius="5px" p="10px">Match Request Recieved</Heading>
                    {userDetails.incoming.map((match, key) => 
                        <HStack key={key} 
                        onSubmit={e => {
                            e.preventDefault();
                            onSubmit().then(()=>{
                                toast({
                                    title: "Request Complete",
                                    position: 'top',
                                    description: "",
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
                        w='80%'
                        >
                            <Heading as="h3" color="white" p="2px">{match.inviter_profile.name}</Heading>
                            <VStack>
                                <Button type="submit" onClick={() => dispatch({ action: "accept", in_email: match.inviter_profile.email})}>Accept</Button>
                                <Button type="submit" onClick={() => dispatch({ action: "decline", in__email: match.inviter_profile.email })}>Decline</Button>
                            </VStack>
                        </HStack>
                    )}
                    </VStack>
                    <VStack className='lrp__card img_layout profile_info'>
                    <Heading as="h3" color="white" bg="black" w="110%" borderRadius="5px" p="10px">Match Request Sent</Heading>
                    {userDetails.outgoing.map((match, key) => 
                        <HStack key={key}
                        onSubmit={e => {
                            e.preventDefault();
                            onSubmit().then(()=>{
                                toast({
                                    title: "Match Request Succesfully Cancelled",
                                    position: 'top',
                                    description: "",
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
                        w='80%'
                        >
                            <Heading as="h3" color="white" p="2px">{match.invitee_profile.name}</Heading>
                            <Button type="submit" onClick={() => dispatch({ action: "cancel", out_email: match.invitee_profile.email })}>Cancel</Button>
                        </HStack>
                    )}
                    </VStack>
                    </HStack>
        </DashboardLayout>
    }    
    return (
        <DashboardLayout>
        </DashboardLayout>
    );
}

export default RequestsPage;