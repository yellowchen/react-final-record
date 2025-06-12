import {NavLink} from "react-router-dom";


const Navbar = ({cartData}) => {

    return (
		<div className='bg-white sticky-top flex-shrink-0'>
			<div className='container'>
				<nav className='navbar px-0 navbar-expand-lg navbar-light bg-white'>
					{/* logo置中 */}
					<NavLink
						className='navbar-brand position-absolute'
						to='/'
						style={{
							left: "50%",
							transform: "translate(-50%, -50%)",
							top: "1.5rem",
						}}
					>
						:- ))
					</NavLink>

					{/* 麵包 */}
					<button
						className='navbar-toggler'
						type='button'
						data-bs-toggle='collapse'
						data-bs-target='#navbarNav'
						aria-controls='navbarNav'
						aria-expanded='false'
						aria-label='Toggle navigation'
					>
						<span className='navbar-toggler-icon'></span>
					</button>

					{/* 會被隱藏的內容 */}
					<div
						className='collapse navbar-collapse bg-white custom-header-md-open mt-2'
						id='navbarNav'
						style={{
							transition: ".3s ease-out",
						}}
					>
						<ul className='navbar-nav'>
							<li className='nav-item active mb-md-2 me-2'>
								<NavLink className='nav-link border-bottom border-2' to='/products'>
									Product
								</NavLink>
							</li>
							<li className='nav-item active mb-md-2 me-2'>
								<NavLink className='nav-link border-bottom border-2' to='/wishlist'>
									<i className='far fa-heart'></i>
								</NavLink>
							</li>
						</ul>
					</div>

					{/* 購物車 */}
					<div
						className='d-flex position-absolute'
						style={{
							top: "1.5rem",
							right: "0",
						}}
					>
						<NavLink className='nav-link position-relative' to='/cart'>
							<i className='bi bi-bag-fill'></i>
							<span className='position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger'>
								{cartData?.carts?.length}
							</span>
						</NavLink>
					</div>
				</nav>
			</div>
		</div>
	);
}

export default Navbar;