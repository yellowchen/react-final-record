import {useState, useEffect, useContext} from "react";
import { useOutletContext, Link } from "react-router-dom";
import axios from "axios";
import { useDispatch } from 'react-redux';
import { createAsyncMessage } from "../../slice/messageSlice";
import { thousandFormat } from "../../store";


const Cart = () => {
	const {cartData, getCart} = useOutletContext();
	const [loadingItems, setLoadingItems] = useState([]);

    const api = `/v2/api/${process.env.REACT_APP_API_PATH}`;
    
    const dispatch = useDispatch();

    const updateCartItem = async(item, quantity) => {
		console.log(item);
        const data = {
			data: {
				product_id: item.product_id,
				qty: quantity,
			},
		};
		setLoadingItems([...loadingItems, item.id]);    
        try {
            const res = await axios.put(`${api}/cart/${item.id}`, data)
            console.log(res.data);

            dispatch(createAsyncMessage(res.data))

			setLoadingItems(loadingItems.filter(loadingObj => loadingObj.id !== item.id));
			//當AJAX結束後，就要把這格item.id去除-->當我的讀取項目與item.id不同時，就把它去除掉
			getCart();
        }catch(err) {
            console.log(err);
            dispatch(createAsyncMessage(err.response.data));
        }
    }


	const removeCartItem = async(id) => {
		try {	
			const res = await axios.delete(`${api}/cart/${id}`);
			getCart();
		}catch(err) {
			console.log(err)
		}
	}

    console.log(cartData);
    const { carts, final_total, total } = cartData;
    console.log("carts", carts);
    

    return (
		<>
			<div className='container'>
				<div className='row justify-content-center'>
					{carts?.length === 0 ? (
						<div className='text-center mt-5'>
							<h4>Your Carts is empty</h4>
							<Link to='/products'>Continue Shopping</Link>
						</div>
					) : (
						<div
							className='col-md-6 bg-white py-5'
							style={{
								minHeight: "calc(100vh - 56px - 76px)",
							}}
						>
							<div className='d-flex justify-content-between'>
								<h2 className='mt-2'>Your Products</h2>
							</div>

							{carts?.map((item) => (
								<div className='d-flex mt-4 bg-light' key={item.id}>
									<img
										src={item.product.imageUrl}
										style={{
											maxHeight: "200px",
											maxWidth: "200px",
											objectFit: "cover",
											aspectRatio: 1 / 1,
										}}
									/>
									<div className='w-100 p-3 position-relative'>
										<button
											type='button'
											className='btn position-absolute'
											style={{
												top: "10px",
												right: "10px",
											}}
											onClick={() => removeCartItem(item.id)}
										>
											<i className='bi bi-x-lg'></i>
										</button>
										<p className='mb-0 fw-bold'>{item.product.title}</p>
										<p className='mb-1 text-muted' style={{ fontSize: "14px" }}>
											{item.product.content}
										</p>
										<div className='d-flex justify-content-between align-items-center w-100'>
											<div className='input-group w-50 align-items-center'>
												{/* SELECT樣式 */}
												{/* 下拉式選單裡面的型別會是字串，因此後續要轉成數字 */}
												<select
													name=''
													className='form-select'
													id=''
													value={item.qty}
													onChange={(e) => updateCartItem(item, e.target.value * 1)}
													disabled={loadingItems.includes(item.id)}
													//當有包含item.id時，按鍵就會短暫的不能使用，在ajax結束後，才會恢復正常
												>
													{[...new Array(20)].map((i, num) => (
														<option value={num + 1} key={num}>
															{num + 1}
														</option>
													))}
												</select>
											</div>
											<p className='mb-0 ms-auto'>NT$ {thousandFormat(item.total)}</p>
										</div>
									</div>
								</div>
							))}

							{/* Coupon */}

							<div className='d-flex justify-content-between mt-4'>
								<p className='mb-0 h4 fw-bold'>Total</p>
								<p className='mb-0 h4 fw-bold'>NT$ {thousandFormat(final_total)}</p>
							</div>
							<Link to='/checkout' className='btn btn-dark w-100 mt-4 rounded-0 py-3'>
								Fill File
							</Link>
						</div>
					)}
				</div>
			</div>
		</>
	);
}

export default Cart;