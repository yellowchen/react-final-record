import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from '../../components/Navbar';
import Footer from './Footer';
import { useEffect, useState, createContext } from 'react';
import MessageToast from "../../components/MessageToast";
import { removeMessage, createAsyncMessage } from "../../slice/messageSlice";
import { useDispatch, useSelector } from 'react-redux';
import { removeWishItem } from "../../slice/WishSlice";



export const PaymentContext = createContext();

const FrontLayout = () => {
	const [cartData, setCartData] = useState({});

    const [cartQuantity, setCartQuantity] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

	const [select, setSelect] = useState("");
	const handleSelected = (e) => {
        setSelect(e.target.value)
	}
    const selectValue = {
        select,
        handleSelected
    }
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const wish = useSelector((state) => state.wishlists);

	// const api = `/v2/api/${process.env.REACT_APP_API_PATH}`;

	//更新購物車資訊
	const getCart = async () => {
		try {
			const cartRes = await axios.get(`/v2/api/${process.env.REACT_APP_API_PATH}/cart`);
			setCartData(cartRes.data.data);
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		getCart();
	}, []);


    //加入購物車
    const addToCart = async (id) => {
		const data = {
			data: {
				product_id: id,
				qty: cartQuantity,
			},
		};
		setIsLoading(true);
		try {
			const res = await axios.post(`/v2/api/${process.env.REACT_APP_API_PATH}/cart`, data);
			console.log("res.data: ", res.data);
			getCart();
			dispatch(
				createAsyncMessage(res.data)
			);
            //如果願望清單內有包含該新加入購物車的產品，要從願望清單內去除
            const findItem = wish.wishlistItems?.find(item => item.id === id);
            dispatch(
                removeWishItem(findItem)
            );
			setIsLoading(false);
            navigate("/cart");
		} catch (err) {
			dispatch(createAsyncMessage(err.response.data));
			setIsLoading(false);
		}
	};


	return (
		<div className='d-flex flex-column min-vh-100'>
			<PaymentContext.Provider value={selectValue}>
				<Navbar cartData={cartData} />
				<MessageToast />
				<main
					// className='d-flex flex-column min-vh-100'
					className='flex-grow-1 flex-shrink-0'
				>
					<Outlet context={{ getCart, cartData, addToCart, cartQuantity, setCartQuantity }} />
				</main>
				<Footer />
			</PaymentContext.Provider>
		</div>
	);
}

export default FrontLayout;