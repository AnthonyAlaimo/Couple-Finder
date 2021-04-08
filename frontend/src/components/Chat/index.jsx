// import { useEffect, useState, useRef } from "react";
// import { HStack } from "@chakra-ui/react";
// import io from 'socket.io-client';
// import './chat.css';

// function Chat(userDetails, matchDetails) {
//     const [ msg, setMsg ] = useAutosavingText('/set-my-msg', '/get-my-msg', undefined, 'banana phone');
//     const [ email, setEmail ] = useAutosavingText('/set-my-email', '/get-my-email', 5000);

//     const socket = require('socket.io-client')({
//         auth: {
//             token: io,
//         },
//     });
    
//     socket.emit('message', { to: matchDetails.email, message: msg });
    
//     socket.on('new user', ({ socket }) => {
//         // You store it
//         userDetails.socket = socket;
//     });
    
    
//     // React stuff
//     const useAutosavingText = (setUrl, getUrl, duration = 2000, initText = '') => {
//         const [ text, setText ] = useState(initText);
//         useEffect(() => {
//             if (text) {
//                 const timer = window.setTimeout(() => {
//                     fetch(setUrl, text);
//                 }, duration);
//                 return () => {
//                     window.clearTimeout(timer);
//                 };
//             } else {
//                 fetch(getUrl).then(old => setText(old));
//             }
//         }, [ text, setUrl, getUrl, duration ]);
//         return [ text, setText ];
//     }
    
//     const MessageComponent = () => {
//         return (
//             <textarea
//                 onChange={(e) => setMsg(e.target.value)}
//                 value={msg}
//             />
//         );
//     }
    
//     const EmailComponent = () => {
//         return (
//             <textarea
//                 onChange={(e) => setEmail(e.target.value)}
//                 value={email}
//             />
//         );
//     }
    
    
//     // Hooks + socket.io
//     const useSocket = () => {
//         const socket = useRef(io(process.env.SOCKET_URL, { autoConnect: false }));
//         const [ isConnected, setIsConnected ] = useState(false);
    
//         useEffect(() => {
//             socket.current.on('connection', () => {
//                 setIsConnected(true);
//             });
    
//             socket.current.connect();
//             return () => {
//                 socket.current.disconnect();
//                 setIsConnected(false);
//             };
//         }, []);
    
//         const emit = useCallback((...args) => {
//             socket.current.emit(...args);
//         }, []);
    
//         const on = useCallback((...args) => {
//             socket.current.on(...args);
//         }, []);
    
//         return {
//             isConnected,
//             emit,
//             on,
//         };
//     };
    
//     const Chat = () => {
//         const socketConnection = useSocket();
    
//         useEffect(() => {
//             if (!socketConnection.isConnected) return;
//             socketConnection.emit('im alive!');
//         }, [
//             socketConnection.isConnected,
//             socketConnection.emit,
//         ]);
    
//     }
//     return (
//         <HStack>
//         {/* chat stuff */}
//         <div className="card">
//                 <h1>Messenger</h1>
//                 <div className='name-field'>
//                     <EmailComponent></EmailComponent>
//                 </div>
//                 <div className='name-field'>
//                     <MessageComponent></MessageComponent>
//                 </div>
//             <div className="render-chat">
//                 <h1>Chat log</h1>
//                 <Chat></Chat>
//         </div>

//         </div>
//         </HStack>
//     );
// }

// export default Chat;