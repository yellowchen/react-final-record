import { useState, useEffect } from "react";
import {useParams, Link, useOutletContext} from "react-router-dom";
import axios from "axios";
import Loading from './../../components/Loading';
import { useDispatch } from 'react-redux';
import { createMessage, removeMessage, createAsyncMessage } from "../../slice/messageSlice";
import AdminCoupons from './../admin/AdminCoupons';



const ProductDetail = () => {
	
	const [product, setProduct] = useState([]);
	const [cartQuantity, setCartQuantity] = useState(1);
	const [isLoading, setIsLoading] = useState(false);
	const {getCart} = useOutletContext();

    const dispatch = useDispatch();

	//取得產品id
    console.log("useParams: ", useParams());
	const {id} = useParams();

	const api = `/v2/api/${process.env.REACT_APP_API_PATH}`;

	//取得產品
	const getProduct = async (id) => {
        setIsLoading(true);
		try {
			const productRes = await axios.get(`${api}/product/${id}`); //04 在後台API要進行驗證時，就會透過前面的這組toke來進行驗證，進而後面取得登入後才可取得的產品資料
			setProduct(productRes.data.product);
			getCart();
            setIsLoading(false);
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		getProduct(id);
	}, [id]);

	//新增至購物車行為
	const addToCart = async() => {
		const data = {
				data: {
                    product_id: product.id,
                    qty: cartQuantity,
                }
            }
		setIsLoading(true);
		try {
			const res = await axios.post(`${api}/cart`, data);
			console.log("res.data: ", res.data);
			getCart();
			dispatch(
				// createMessage(res.data)
				createAsyncMessage(res.data)
			);
			setIsLoading(false);
		}catch(err) {
            // console.log(err);
			dispatch(
                createAsyncMessage(err.response.data)
            )
			setIsLoading(false);
		}
	}

	return (
		<>
			<div className='container'>
                <Loading isLoading={isLoading}/>
				<div
					className='object-cover'
					style={{
						minHeight: "400px",
						background: `url(${product.imageUrl}) no-repeat center center / cover`,
					}}
				></div>
				<div className='row mt-4 mb-7 justify-content-around'>
					<div className='col-md-7'>
						<h2 className='mb-0'>{product.title}</h2>
						<p className='fw-bold'>NT$ {product.price}</p>
						<p>{product.content}</p>
					</div>
					<div className='col-md-4'>
						<div className='input-group mb-3 border mt-3'>
							<div className='input-group-prepend'>
								<button
									className='btn btn-outline-dark rounded-0 border-0 py-3'
									type='button'
									id='button-addon1'
									onClick={() => setCartQuantity((prev) => (prev === 1 ? 1 : prev - 1))}
								>
									<i className='bi bi-dash-lg'></i>
								</button>
							</div>
							<input
								readOnly
								type='number'
								className='form-control border-0 text-center my-auto shadow-none'
								placeholder=''
								aria-label='Example text with button addon'
								aria-describedby='button-addon1'
								// value='1'
								value={cartQuantity}
							/>
							<div className='input-group-append'>
								<button
									className='btn btn-outline-dark rounded-0 border-0 py-3'
									type='button'
									id='button-addon2'
									onClick={() => setCartQuantity((prev) => prev + 1)}
								>
									<i className='bi bi-plus-lg'></i>
								</button>
							</div>
						</div>
						<button
							type='button'
							className='btn btn-dark w-100 rounded-0 py-3'
							onClick={addToCart}
							disabled={isLoading} //true時，disabled (避免用戶在還沒跑完更新資訊時，重複點選)
						>
							Add To Cart
						</button>
					</div>
				</div>
				<Link
					to='/products'
					className='btn btn-dark rounded-circle float-end d-flex justify-content-center align-items-center'
					style={{ width: "60px", height: "60px"}}
				>
					BACK
				</Link>
			</div>
		</>
	);
};

export default ProductDetail;
