import DashboardLayout from "../components/DashboardLayout";
import { useContext, useEffect, useReducer, useState } from "react";
import UserProvider, { UserContext } from "../components/UserProvider";
import { useParams } from "react-router";
import './ProfilePage/ProfilePage.css';
import fetchApi from "../utils/fetchApi";
import { FcLike } from '@react-icons/all-files/fc/FcLike';
import { FcDislike } from '@react-icons/all-files/fc/FcDislike';
import { Icon, HStack, Heading } from "@chakra-ui/react";
import MatchDetails from "../components/MatchDetails";
import '../components/DashboardLayout/DashboardLayout.css';
import './InboxPage/InboxPage.css';

function reducer(state = {}, action) {
    if (action === null){
        return action;
    }
    return Object.assign({}, state, action);
}


function InboxPage() {
    const { user } = useContext(UserContext);
    const params = useParams();
    const userId = params.userID ?? user?._id;

    const [ userDetails, dispatch ] = useReducer(reducer, null);
    // /* Get 5 matches based on user's filters */
    // app.get("/api/new-matches/", isAuthenticated, function (req, res, next) {
    
    // /* Get match history for the user */
    // app.get("/api/matches/", isAuthenticated, function (req, res, next) {

    const onSubmit = async (action) => {
        if (action === 'LikeProfile'){
            console.log("Like")
            // await fetchApi("/profile/", "POST", {})
        }else if (action === 'DisLikeProfile'){
            // await fetchApi("/profile/", "POST", {})
            console.log("DisLike")
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
                    const matches = await fetchApi("/new-matches/", "GET", null, controller.signal);
                    dispatch(user_profile);
                    dispatch({matches});
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
        return <DashboardLayout>Loading. Complete Your User Survey and Filters located in the profile page</DashboardLayout>
    }
    else if(userDetails.matches === undefined){
        return <DashboardLayout>Loading. Complete Your User Survey and Filters located in the profile page</DashboardLayout>
    }
    else if(userDetails.matches.length === 0){
        return <DashboardLayout>You have no matches D:</DashboardLayout>
    }
    return (
        <DashboardLayout>
            <Heading className="centre" as="h1" size="4xl">Inbox</Heading>
            <HStack className="centre">
                <Icon className="dashboard__logo" boxSize="100px" as={FcLike} onClick={() => onSubmit(`LikeProfile`)}/>
                <MatchDetails user={userDetails.matches[0]}></MatchDetails>
                <Icon className="dashboard__logo" boxSize="100px" as={FcDislike} onClick={() => onSubmit(`DisLikeProfile`)}/>
            </HStack>
        </DashboardLayout>
    );
}

export default InboxPage;