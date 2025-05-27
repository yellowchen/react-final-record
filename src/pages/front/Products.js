import {useState, useEffect} from "react";
import {Link} from "react-router-dom";
// import ReactLoading from "react-loading";
import axios from "axios";
import Pagination from './../../components/Pagination';
import Loading from './../../components/Loading';

const Products = () => {
	const [products, setProducts] = useState([]);
	const [pagination, setPagination] = useState({});
    const [isLoading, setIsLoading] = useState(false)

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
	}, [])

	return (
		<>
			<div className='container mt-md-5 mt-3 mb-7'>
				<Loading isLoading={isLoading}/>
				<div className='row'>
					{products.map((item) => (
						<div className='col-md-3' key={item.id}>
							<div className='card border-0 mb-4 px-1 position-relative'>
								<img
									src={item.imageUrl}
									className='card-img-top rounded-0 object-cover'
									alt={item.title}
									style={{
										// width: "200px",
										height: "200px",
										border: "1px solid #000",
									}}
								/>
								<a href='#' className='text-dark'>
									<i
										className='far fa-heart position-absolute'
										style={{ right: "16px", top: "16px" }}
									></i>
								</a>
								<div className='card-body px-1'>
									<h4 className='mb-0 mt-3'>
										<Link to={`/product/${item.id}`}>{item.title}</Link>
									</h4>
									<p className='text-muted mt-3 text-end'>$ {item.price}</p>
								</div>
							</div>
						</div>
					))}
				</div>
				<nav className='d-flex justify-content-center'>
					{/* <ul className='pagination'>
						<li className='page-item'>
							<a className='page-link' href='#' aria-label='Previous'>
								<span aria-hidden='true'>&laquo;</span>
							</a>
						</li>
						<li className='page-item active'>
							<a className='page-link' href='#'>
								1
							</a>
						</li>
						<li className='page-item'>
							<a className='page-link' href='#'>
								2
							</a>
						</li>
						<li className='page-item'>
							<a className='page-link' href='#'>
								3
							</a>
						</li>
						<li className='page-item'>
							<a className='page-link' href='#' aria-label='Next'>
								<span aria-hidden='true'>&raquo;</span>
							</a>
						</li>
					</ul> */}
					<Pagination pagination={pagination} changePage={getProducts} />
				</nav>
			</div>
		</>
	);
}

export default Products;