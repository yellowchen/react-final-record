import { useState, useContext } from 'react';
import { MessageContext } from './../store/messageStore';


const Message = () => {
	// const [message, setMessage] = useState({});  原先的

	// const [message] = useContext(MessageContext);
	// --> 原先
	// const reducer = useReducer(messageReducer, initState);
	// const [state, dispatch] = useReducer(messageReducer, initState)
	const [message, dispatch] = useContext(MessageContext);

	return (
		<>
			<div
				className='toast-container position-fixed'
				style={{ top: "2rem", right: "10px" }} //位置的調整
			>
				{message.title && (
					<div className='toast show' role='alert' aria-live='assertive' aria-atomic='true' data-delay='3000'>
						<div className={`toast-header text-white bg-${message.type}`}>
							<strong className='me-auto'>{message.title}</strong>
							<button type='button' className='btn-close' data-bs-dismiss='toast' aria-label='Close' />
						</div>
						<div className='toast-body'>{message.text}</div>
					</div>
				)}
			</div>
		</>
	);
}

export default Message;