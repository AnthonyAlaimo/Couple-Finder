import DashboardLayout from "../components/DashboardLayout";
import { useContext, useEffect, useReducer, useState } from "react";
import UserProvider, { UserContext } from "../components/UserProvider";
import { useParams } from "react-router";
import './ProfilePage/ProfilePage.css';
import fetchApi from "../utils/fetchApi";
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

    useEffect(() => {
        const controller = new AbortController();
        dispatch(null);
        const runFetch = async () => {
            try {
                // TODO: Some fetch for user information
                const user_profile = await fetchApi("/profile/", "GET", null, controller.signal);
                dispatch(user_profile);
                const matches = await fetchApi("/new-matches/", "GET", null, controller.signal);
                console.log(matches);
                dispatch(matches);
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
    return (
        <DashboardLayout>
            Inbox
        </DashboardLayout>
    );
}

export default InboxPage;