import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';


const NotFound = () => {
    const navigate = useNavigate();
    useEffect(() => {
        setTimeout(() => {
            navigate("/");
        }, 3000)
    }, [])
	return (
		<div
			className='not-found container d-flex flex-column align-items-center justify-content-center gap-2'
		>
			<h2>404</h2>
			<i
				className='bi bi-emoji-tear'
				style={{
					fontSize: "4rem",
				}}
			></i>
			<p className='title'>Page not found</p>
		</div>
	);
};

export default NotFound;
