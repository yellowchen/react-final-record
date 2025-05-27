import {useSelector} from "react-redux";


const Message = () => {
    const messages = useSelector(state => {
        return state.message
    })

    return (
		<>
			<div
				className='toast-container position-fixed'
				style={{ top: "2rem", right: "10px" }} //位置的調整
			>
				{messages?.map((message) => (
						<div
							className='toast show'
							role='alert'
							aria-live='assertive'
							aria-atomic='true'
							data-delay='3000'
                            key={message.id}
						>
							<div className={`toast-header text-white bg-${message.type}`}>
								<strong className='me-auto'>{message.title}</strong>
								<button
									type='button'
									className='btn-close'
									data-bs-dismiss='toast'
									aria-label='Close'
								/>
							</div>
							<div className='toast-body'>{message.text}</div>
						</div>
					))}
			</div>
		</>
	);
}

export default Message;