
import { useDispatch, useSelector } from 'react-redux';
import { useOutletContext, Link } from 'react-router-dom';
import { removeWishItem } from '../slice/WishSlice';
import { useEffect } from 'react';


const Wish = ({ item }) => {
	const { addToCart } = useOutletContext();
	const dispatch = useDispatch();
    const wish = useSelector((state) => state.wishlists);

	const handleRemoveWishItem = (wishItem) => {
		dispatch(removeWishItem(wishItem));
	};
    useEffect(() => {
		localStorage.setItem("wishlistItems", JSON.stringify(wish.wishlistItems));
	}, [wish]);

	return (
		<div className='d-flex mt-4 bg-light'>
			<Link to={`/product/${item.id}`}>
				<img
					src={item.imageUrl}
					style={{
						maxHeight: "100px",
						maxWidth: "100px",
						objectFit: "cover",
						aspectRatio: 1 / 1,
					}}
				/>
			</Link>
			<div className='w-100 p-3 position-relative'>
				<button
					type='button'
					className='btn position-absolute'
					style={{
						top: "10px",
						right: "10px",
					}}
					onClick={() => handleRemoveWishItem(item)}
				>
					<i className='bi bi-x-lg'></i>
				</button>
				<p className='mb-0 fw-bold'>
					{item.title}
					<br />
					<small>$ {item.price}</small>
				</p>
				<div>
					<button
						className='btn ps-0'
						onClick={() => {
							addToCart(item.id);
						}}
					>
						<i className='bi bi-bag-fill'></i>
					</button>
					<button className='btn ps-0' onClick={() => handleRemoveWishItem(item)}>
						<i className='bi bi-trash3'></i>
					</button>
				</div>
			</div>
		</div>
	);
};

export default Wish;
