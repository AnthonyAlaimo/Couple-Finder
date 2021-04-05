import DashboardLayout from "../components/DashboardLayout";
import { useContext, useEffect, useReducer, useState } from "react";
import { UserContext } from "../components/UserProvider";
import MatchDetails from "../components/MatchDetails";
import { useParams } from "react-router";
import fetchApi from "../utils/fetchApi";
import { Button, ChevronDownIcon, Textarea, Heading, Input, Message } from "@chakra-ui/react";
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,MenuGroup, MenuDivider
  } from "@chakra-ui/react"
import io from 'socket.io-client';
import './FavouritesPage/FavouritesPage.css';

function reducer(state = {}, action) {
    if (action === null){
        return action;
    }
    return Object.assign({}, state, action);
}

function FavouritesPage() {
    const [state, setState] = useState({message: '', name: ''});
    const [chat, setChat] = useState([]);


    const { user } = useContext(UserContext);
    const params = useParams();
    const userId = params.userID ?? user?._id;
    const [ userDetails, dispatch ] = useReducer(reducer, null);

    const displayMatch = async (match) => {
        console.log(match);
        dispatch({match: match});
    };

    // chat functions
    const onTextChange = e => {
        setState({...state, [e.target.name]: e.target.value})
    }

    const onMessageSubmit = e => {
        e.preventDefault()
        const {name, message} = state;
        socket.emit('message', {name, message})
        setState({message: '', name })
    }
    const renderChat = () => {
        return chat.map(({name, message}, key)=>{
            <div key={key}>
                <h3>{name}:
                    <span>{message}</span>
                </h3>
            </div>
        })
    }
    /////////////////
    useEffect(() => {
        const socket = io.connect(process.env.PORT);
        socket.on('message', ({name, message}) => {
            setChat([...chat, {name, message}])
        })

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
        return <DashboardLayout><Heading as="h1" size="4xl">loading</Heading></DashboardLayout>
    }
    //get matched status
    //possible logic for getting mutual matches for a user
    console.log(userDetails.favourites)
    if (userDetails?.favourites.length === 0){
        return <DashboardLayout>
                <Heading className="centre" as="h1" size="4xl">Your favourites list is empty. Make sure to fill out your survey and filters on the profile page!</Heading>
            </DashboardLayout>
    }
    else{
        console.log(userDetails.match)
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
                    <MatchDetails user={userDetails.match.inviter_profile} survey={userDetails.survey}></MatchDetails>
                }
                {/* chat stuff */}
                {/* <div className="card">
                <form onSubmit={onMessageSubmit}>
                    <h1>Messanger</h1>
                    <div className='name-field'>
                        <Input name='name' value={userDetails.name} label='Name'/>
                    </div>
                    <div className='name-field'>
                        <Input name='message' onChange={e => onTextChange(e)} value={state.message} label='Message'/>
                    </div>
                    <Button>Send Message</Button>
                </form>
                <div className="render-chat">
                    <h1>Chat log</h1>
                    {renderChat()}
                </div>

                </div> */}
            </DashboardLayout>
        );
    }
}

export default FavouritesPage;