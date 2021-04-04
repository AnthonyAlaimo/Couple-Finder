import DashboardLayout from "../components/DashboardLayout";
import { useContext, useEffect, useReducer } from "react";
import { UserContext } from "../components/UserProvider";
import { useParams } from "react-router";
import fetchApi from "../utils/fetchApi";
import { Button, ChevronDownIcon, Heading } from "@chakra-ui/react";
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

function RequestsPage() {
    const { user } = useContext(UserContext);
    const params = useParams();
    const userId = params.userID ?? user?._id;
    const [ userDetails, dispatch ] = useReducer(reducer, null);

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
                    dispatch({...user_profile, matches: matches});
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
    if ( userDetails.matches !== undefined ){
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
                    {userDetails.matches.map((match) => {
                        <Heading as="h3" color="white" p="2px">{match.name}</Heading>
                    })}
        </DashboardLayout>
    }    
    return (
        <DashboardLayout>
            favourite
        </DashboardLayout>
    );
}

export default RequestsPage;