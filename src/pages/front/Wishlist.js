import {useSelector, useDispatch} from "react-redux"
import { Link, useOutletContext, useNavigate } from 'react-router-dom';
import { removeWishItem, clearAllWishlist } from "../../slice/WishSlice";
import Wish from "../../components/Wish";


const Wishlist = () => {
    const wish = useSelector((state) => state.wishlists);
	console.log("wish: ", wish);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleClearAllWishlist = () => {
        dispatch(clearAllWishlist())
    }

    return (
		<>
			<div className='container'>
				<div className='row justify-content-center'>
					{wish.wishlistItems?.length === 0 ? (
						<div className='text-center mt-5'>
							<h4>Your Wishlist is empty</h4>
							<Link to='/products'>Continue Shopping</Link>
						</div>
					) : (
						<div
							className='col-md-6 bg-white py-5'
							style={{
								minHeight: "calc(100vh - 56px - 76px)",
							}}
						>
							<div className='d-flex justify-content-between align-items-baseline'>
								<h2 className='mt-2'>Your Wishlist</h2>
								<button className='btn' onClick={handleClearAllWishlist}>
									<h5>Clear All</h5>
								</button>
							</div>

							{wish.wishlistItems?.map((item) => (
								<Wish item={item} key={item.id} />
							))}
							<button
								onClick={() => {
									navigate(-1);
								}}
								className='btn btn-dark rounded-circle float-end d-flex justify-content-center align-items-center mb-3'
								style={{ width: "60px", height: "60px" }}
							>
								BACK
							</button>
						</div>
					)}
				</div>
			</div>
		</>
	);
}
 
export default Wishlist;