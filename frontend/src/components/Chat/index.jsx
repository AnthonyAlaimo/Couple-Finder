import { useEffect, useState, useRef } from "react";
import { Textarea, Heading} from "@chakra-ui/react";
import io from 'socket.io-client';
import './chat.css';

function Chat(userDetails, matchDetails) {
    const [ state, setState ] = useState({ message: "", name: userDetails.userDetails.name });
	const [ chat, setChat ] = useState([]);
	const socketRef = useRef()

	useEffect(
		() => {
			socketRef.current = io.connect();
            console.log('check 1', socketRef.current.connected);
            socketRef.current.on('connection', function() {
                console.log('check 2', socketRef.current.connected);
            });
            socketRef.current.on('disconnect', function() {
                console.log('check 2', socketRef.current.connected);
            });
            console.log(socketRef.current);

			socketRef.current.on("message", ({ name, message }) => {
				setChat(_chat => [..._chat, { name, message } ]);
			})
			return () => socketRef.current.disconnect()
		},
		[ ]
	)

	const onTextChange = (e) => {
		setState({ ...state, [e.target.name]: e.target.value })
	}

	const onMessageSubmit = (e) => {
		const { name, message } = state
		socketRef.current.emit("message", { name, message });
		e.preventDefault()
	}

	const renderChat = () => {
		return chat.map(({ name, message }, index) => (
			<div key={index}>
				<h3>
					{name}: <span>{message}</span>
				</h3>
			</div>
		))
	}

	return (
		<div className="card">
			<div className="render-chat">
             <Heading as="h1" size="4xl">Chat Log</Heading>
                <form onSubmit={onMessageSubmit}>
				<div>
					<Textarea
						name="message"
						onChange={(e) => onTextChange(e)}
						value={state.message}
						label="Message"
					/>
				</div>
				<button>Send Message</button>
			</form>
            {renderChat()}
			</div>
		</div>
	)
    
}

export default Chat;

// const [ email, setEmail ] = useAutosavingText('/set-my-email', '/get-my-email', 2000);
// const [ msg, setMsg ] = useState({ message: "", name: userDetails.userDetails.name });
// const [ chat, setChat ] = useState([]);
// const socketConnection = useSocket();
// const socket = require('socket.io-client')({
//     auth: {
//         token: io,
//     },
// });

// useEffect(() => {
//     if (!socketConnection.isConnected) return;
//     socketConnection.emit('im alive!');
// }, [
//     socketConnection.isConnected,
//     socketConnection.emit,
// ]);
// // Hooks + socket.io
// const useSocket = () => {
//     const socket = useRef(io(process.env.SOCKET_URL, { transports: ['websocket'], autoConnect: false }));
//     const [ isConnected, setIsConnected ] = useState(false);

//     useEffect(() => {
//         socket.current.on('connection', () => {
//             setIsConnected(true);
//         });

//         socket.current.connect();
//         return () => {
//             socket.current.disconnect();
//             setIsConnected(false);
//         };
//     }, []);

//     const emit = useCallback((...args) => {
//         socket.current.emit(...args);
//     }, []);

//     const on = useCallback((...args) => {
//         socket.current.on(...args);
//     }, []);

//     return {
//         isConnected,
//         emit,
//         on,
//     };
// };
// socket.on('new user', ({ socket }) => {
//     // You store it
//     userDetails.socket = socket;
// });

// const renderChat = () => {
//     return [chat].map(({ name, message }, index) => (
//         <div key={index}>
//             <h3>
//                 {name}: <span>{message}</span>
//             </h3>
//         </div>
//         ))
//     }
// return (
//     <div className="card">
//         <div className="render-chat">
//             <h1>Chat Log</h1>
//             <form onSubmit={onMessageSubmit}>
//             <div>
//                 <Textarea
//                     name="message"
//                     onChange={(e) => onTextChange(e)}
//                     value={state.message}
//                     label="Message"
//                 />
//             </div>
//             <button>Send Message</button>
//         </form>
//         {renderChat()}
//         </div>
//     </div>
// )