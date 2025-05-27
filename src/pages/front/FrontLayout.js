import { Outlet } from 'react-router-dom';
import axios from "axios";
import Navbar from '../../components/Navbar';
import Footer from './Footer';
import { useEffect, useState } from 'react';
import MessageToast from "../../components/MessageToast";


const FrontLayout = () => {
	const [cartData, setCartData] = useState({});

	const api = `/v2/api/${process.env.REACT_APP_API_PATH}`;

	//更新購物車資訊
	const getCart = async () => {
		try {
			const cartRes = await axios.get(`${api}/cart`);
			setCartData(cartRes.data.data);
			
		}catch(err) {
			console.log(err)
		}
	}

	useEffect(() => {
		getCart();
	}, [])

    return (
		<div className='d-flex flex-column min-vh-100'>
			<Navbar cartData={cartData} />
			<MessageToast />
			<main
				// className='d-flex flex-column min-vh-100'
				className='flex-grow-1 flex-shrink-0'
			>
				<Outlet context={{ getCart, cartData }} />
			</main>
			<Footer />
		</div>
	);
}

export default FrontLayout;