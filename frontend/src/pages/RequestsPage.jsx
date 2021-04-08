import DashboardLayout from "../components/DashboardLayout";
import { useContext, useEffect, useReducer } from "react";
import { UserContext } from "../components/UserProvider";
import { useParams } from "react-router";
import fetchApi from "../utils/fetchApi";
import MatchDetails from "../components/MatchDetails";
import { Button, Heading, HStack, VStack, useToast, Form } from "@chakra-ui/react";
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,MenuGroup, MenuDivider
  } from "@chakra-ui/react"
import './ProfilePage/ProfilePage.css';

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
            let updatedMatches = userDetails.incoming.filter((cur) => {
                return cur.inviter_profile.email !== result[0].inviter;
            })
            dispatch({incoming: updatedMatches,  match: null});
        }else if (action === 'decline'){
            console.log(userDetails);
            let result = await fetchApi("/match/", "PUT", {invitee: userDetails.in_email, status: "DISLIKED"});
            let updatedMatches = userDetails.incoming.filter((cur) => {
                return cur.inviter_profile.email !== result[0].inviter;
            })
            dispatch({incoming: updatedMatches,  match: null});
        }else if (action === 'cancel'){
            let result = await fetchApi("/match/", "PUT", {invitee: userDetails.out_email, status: "DISLIKED"});
            let updatedMatches = userDetails.outgoing.filter((cur) => {
                return cur.invitee_profile.email !== result[0].invitee;
            })
            dispatch({outgoing: updatedMatches, match: null});
        }
    };

    const displayMatch = async (match, invite) => {
        console.log(match);
        if (invite === "invitee"){
            dispatch({match: match, invite: "invitee"});
        }else{
            dispatch({match: match, invite: "inviter"});
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
                    const survey = await fetchApi("/survey/", "GET", null);
                    console.log(matches);
                    dispatch({...user_profile, incoming: matches.incoming, outgoing: matches.outgoing, match: null, survey: survey});
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
        return <DashboardLayout><Heading className="centre" as="h1" size="4xl">Loading</Heading></DashboardLayout>
    }
    if ( userDetails !== undefined){
        if (userDetails.incoming.length === 0 && userDetails.outgoing.length === 0){
            return <DashboardLayout><Heading className="centre" as="h1" size="4xl">You have no current Requests</Heading></DashboardLayout>
        }
        return <DashboardLayout>
            {/* menus for request sent to and from the user */}
            <HStack p="10px">
            <Menu>
            <MenuButton as={Button} colorScheme="pink">
                Request Sent
            </MenuButton>
            <MenuList>
                <MenuGroup title="Sent">
                {userDetails.outgoing.map((match, key) =>
                <MenuItem key={key}  onClick={() => displayMatch(match, "invitee")}>{match.invitee_profile.name}</MenuItem>
                )}
                </MenuGroup>
                <MenuDivider />
            </MenuList>
            </Menu>
            <Menu>
            <MenuButton as={Button} colorScheme="pink">
                Request Recieved
            </MenuButton>
            <MenuList>
                <MenuGroup title="Recieved">
                {userDetails.incoming.map((match, key) =>
                <MenuItem key={key}  onClick={() => displayMatch(match, "inviter")}>{match.inviter_profile.name}</MenuItem>
                )}
                </MenuGroup>
                <MenuDivider />
            </MenuList>
            </Menu>
            </HStack>
                {userDetails.match !== null &&
                <HStack>
                    {/* invitee case */}
                    {userDetails.invite === "invitee" &&
                    <HStack as="form"
                    onSubmit={e => {
                        e.preventDefault();
                        onSubmit().then(()=>{
                            toast({
                                title: "Match Request Succesfully Cancelled",
                                position: 'top',
                                description: "Match removed from request sent list",
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
                    }}>
                    <MatchDetails user={userDetails.match.invitee_profile} survey={userDetails.survey}></MatchDetails>
                    <Button type="submit" onClick={() => dispatch({ action: "cancel", out_email: userDetails.match.invitee_profile.email })}>Cancel Request</Button>
                    </HStack>
                    }
                    {/* inviter case */}
                    {userDetails.invite === "inviter" &&
                    <HStack onSubmit={e => {
                        e.preventDefault();
                        onSubmit().then(()=>{
                            {userDetails.action === "decline" &&
                            toast({
                                title: "Request Complete",
                                position: 'top',
                                description: "Match removed from request list",
                                status: "success",
                                duration: 4000,
                                isClosable: true
                            })
                            }
                            {userDetails.action === "accept" &&
                            toast({
                                title: "Request Complete",
                                position: 'top',
                                description: "View the favourites page to see your perfect matches",
                                status: "success",
                                duration: 4000,
                                isClosable: true
                            })
                            }

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
                    as='form'>
                    <MatchDetails user={userDetails.match.inviter_profile} survey={userDetails.survey}></MatchDetails>
                    <VStack>
                        <Button type="submit" onClick={() => dispatch({ action: "accept", in_email: userDetails.match.inviter_profile.email})}>Accept</Button>
                        <Button type="submit" onClick={() => dispatch({ action: "decline", in_email: userDetails.match.inviter_profile.email })}>Decline</Button>
                    </VStack>
                    </HStack>
                    }
                </HStack>
                }
        </DashboardLayout>
    }    
    return (
        <DashboardLayout>
        </DashboardLayout>
    );
}

export default RequestsPage;