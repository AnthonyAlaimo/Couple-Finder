import DashboardLayout from "../components/DashboardLayout";
import { useContext, useEffect, useReducer} from "react";
import { UserContext } from "../components/UserProvider";
import MatchDetails from "../components/MatchDetails";
import { useParams } from "react-router";
import fetchApi from "../utils/fetchApi";
import { Button, Heading, HStack} from "@chakra-ui/react";
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,MenuGroup, MenuDivider
  } from "@chakra-ui/react"
import './FavouritesPage/FavouritesPage.css';
import { useToast } from "@chakra-ui/react";

function reducer(state = {}, action) {
    if (action === null){
        return action;
    }
    return Object.assign({}, state, action);
}

function FavouritesPage() {
    const toast = useToast();
    const { user } = useContext(UserContext);
    const params = useParams();
    const userId = params.userID ?? user?._id;
    const [ userDetails, dispatch ] = useReducer(reducer, null);

    const onSubmit = async () => {
        const action = userDetails.action;
        if (action === 'decline'){
            let result = await fetchApi("/match/", "PUT", {invitee: userDetails.in_email, status: "DISLIKED"});
            let updatedMatches = userDetails.favourites.filter((cur) => {
                return cur.inviter_profile.email !== result[0].inviter;
            })
            dispatch({favourites: updatedMatches,  match: null});
        }
    };

    const displayMatch = async (match) => {
        dispatch({match: match});
    };
    useEffect(() => {
        const controller = new AbortController();
        dispatch(null);
        const runFetch = async () => {
            try {
                // TODO: 
                if (!controller.signal.aborted){
                    // get match history of user and find users which have status MATCHE
                    //const match_history = await fetchApi("/matches/", "GET", null);
                    const favourites = await fetchApi("/favourites/", "GET", null);
                    const user_profile = await fetchApi("/profile/", "GET", null, controller.signal);
                    const survey = await fetchApi("/survey/", "GET", null);
                    dispatch({...user_profile, favourites: favourites, survey: survey, match: null});
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
        return <DashboardLayout><Heading className="centre" as="h1" size="2xl">Loading</Heading></DashboardLayout>
    }
    //get matched status
    //possible logic for getting mutual matches for a user
    if (userDetails?.favourites.length === 0){
        return <DashboardLayout>
                <Heading className="centre" as="h1" size="2xl">Your favourites list is empty. Only matches that you've liked and have liked you back will appear here!</Heading>
            </DashboardLayout>
    }
    else{
        return (
            <DashboardLayout>
                <Menu>
                <MenuButton as={Button} colorScheme="pink">
                    Favourites
                </MenuButton>
                <MenuList>
                    <MenuGroup title="favourites">
                    {userDetails.favourites.map((match, key) =>
                    <MenuItem key={key}  onClick={() => displayMatch(match)}>{match.inviter_profile.name}</MenuItem>
                    )}
                    </MenuGroup>
                    <MenuDivider />
                </MenuList>
                </Menu>
                {userDetails.match !== null &&
                    <HStack>
                        <HStack onSubmit={e => {
                        e.preventDefault();
                        onSubmit().then(()=>{
                                toast({
                                    title: "Request successful",
                                    position: 'top',
                                    description: "Match removed from Favourites list",
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
                            as='form'>
                            <MatchDetails user={userDetails.match.inviter_profile} survey={userDetails.survey}></MatchDetails>
                            <Button type="submit" onClick={() => dispatch({ action: "decline", in_email: userDetails.match.inviter_profile.email })}>Delete</Button>
                        </HStack>
                    </HStack>
                }
            </DashboardLayout>
        );
    }
}

export default FavouritesPage;