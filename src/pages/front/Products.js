import {useState, useEffect} from "react";
import {Link, useNavigate, useOutletContext} from "react-router-dom";
// import ReactLoading from "react-loading";
import axios from "axios";
import Pagination from './../../components/Pagination';
import Loading from './../../components/Loading';
import { useDispatch, useSelector } from 'react-redux';
import { toggleWishItem, removeWishItem } from "../../slice/WishSlice";


const Products = () => {

	const [products, setProducts] = useState([]);
	const [pagination, setPagination] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch();
    console.log(dispatch);

    const {addToCart} = useOutletContext();
    const wish = useSelector((state) => state.wishlists);
	console.log("wish: ", wish);

    const navigate = useNavigate();

	//取得產品的行為
	const getProducts = async (page = 1) => {
        setIsLoading(true);
		try {
			//B取得產品列表
			const productRes = await axios.get(`/v2/api/${process.env.REACT_APP_API_PATH}/products?page=${page}`); //04 在後台API要進行驗證時，就會透過前面的這組toke來進行驗證，進而後面取得登入後才可取得的產品資料
			console.log(productRes);
			setProducts(productRes.data.products);
			setPagination(productRes.data.pagination);
            setIsLoading(false);
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		getProducts(1)
	}, []);

    //toggle wishlist
    const toggleWishlist = (wishItem) => {
        dispatch(toggleWishItem(wishItem));
	};

    useEffect(() => {
		localStorage.setItem("wishlistItems", JSON.stringify(wish.wishlistItems));
	}, [wish]);


    const pureHeart = {
		// right: "16px",
		// top: "6px",
		// fontSize: "1.5rem",
        color: "#ccc"
	};

    const colorHeart = {
        ...pureHeart,
        color: "red"
    }

	return (
		<>
			<div className='container mt-md-5 mt-3 mb-7'>
				<Loading isLoading={isLoading} />
				<div className='row'>
					{products.map((item) => (
						<div className='col-md-3' key={item.id}>
							<div
								className='card border-2 mb-4 px-0 position-relative'
							>
								<Link to={`/product/${item.id}`}>
									<img
										src={item.imageUrl}
										className='card-img-top rounded-0 object-cover'
										alt={item.title}
										style={{
											height: "200px",
										}}
									/>
								</Link>
								<div className='card-body px-1'>
									<h4 className='mb-0 mt-2 d-flex flex-column justify-content-between align-items-center'>
										<p>
											<Link to={`/product/${item.id}`}>
												{item.title}
												<h5 className='text-muted text-center mt-2'> $ {item.price}</h5>
											</Link>
										</p>
										<div>
											<Link to={`/product/${item.id}`} className='btn'>
												<i class='bi bi-info-circle'></i>
											</Link>
											<button
												type='button'
												className='btn btn-outline-light'
												onClick={() => {
													toggleWishlist(item);
												}}
											>
												{wish?.wishlistItems?.some((wish) => wish.id === item.id) ? (
													<i className='bi bi-suit-heart-fill' style={colorHeart}></i>
												) : (
													<i className='bi bi-suit-heart-fill' style={pureHeart}></i>
												)}
											</button>
											<button
												className='btn btn-outline-light'
												onClick={() => {
													addToCart(item.id);
												}}
												style={{ color: "#000" }}
											>
												<i className='bi bi-bag-fill'></i>
											</button>
										</div>
									</h4>
								</div>
							</div>
						</div>
					))}
				</div>
				<nav className='d-flex justify-content-center'>
					<Pagination pagination={pagination} changePage={getProducts} />
				</nav>
			</div>
		</>
	);
}

export default Products;