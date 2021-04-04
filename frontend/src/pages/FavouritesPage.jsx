import DashboardLayout from "../components/DashboardLayout";
import { useContext, useEffect, useReducer } from "react";
import { UserContext } from "../components/UserProvider";
import MatchDetails from "../components/MatchDetails";
import { useParams } from "react-router";
import fetchApi from "../utils/fetchApi";
import { Button, ChevronDownIcon } from "@chakra-ui/react";
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
  } from "@chakra-ui/react"

function reducer(state = {}, action) {
    if (action === null){
        return action;
    }
    return Object.assign({}, state, action);
}

function FavouritesPage() {
    const { user } = useContext(UserContext);
    const params = useParams();
    const userId = params.userID ?? user?._id;
    const [ userDetails, dispatch ] = useReducer(reducer, null);

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
                    console.log(favourites);
                    dispatch({...user_profile, favourites: favourites, survey: survey, match: ""});
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
    //get matched status
    //possible logic for getting mutual matches for a user
    console.log(userDetails.match)
    if (userDetails?.favourites !== undefined){
        return (
            <DashboardLayout>
                <MatchDetails user={userDetails.favourites[0]} survey={userDetails.survey}></MatchDetails>
                {/* <Menu>
                <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                    Favourites
                </MenuButton>
                <MenuList>
                {userDetails.favourites.map((match, key) =>
                    <MenuItem key={key}  onClick={() => displayMatch(match)}>{match.name}</MenuItem>
                    )}
                </MenuList>
                </Menu>
                <MatchDetails user={userDetails.match} survey={userDetails.survey}></MatchDetails> */}
            </DashboardLayout>
        );
    }
    return (
        <DashboardLayout>
            favourite
        </DashboardLayout>
    );
}

export default FavouritesPage;