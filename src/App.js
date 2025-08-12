import {Routes, Route, Navigate} from "react-router-dom";
import Login from "./pages/Login";

import Dashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminCoupons from './pages/admin/AdminCoupons';
import AdminOrders from "./pages/admin/AdminOrders";
import AdminArticles from "./pages/admin/AdminArticles";

import FrontLayout from './pages/front/FrontLayout';
import Home from './pages/front/Home';
import Products from "./pages/front/Products";
import ProductDetail from './pages/front/ProductDetail';
import Cart from './pages/front/Cart';
import Checkout from './pages/front/Checkout';
import Success from "./pages/front/Success";
import Wishlist from './pages/front/Wishlist';
// import ProtectedRoutes from "./components/ProtectedRoutes";
import NotFound from './pages/front/NotFound';


function App() {

    

	return (
		<div className='App'>
			<Routes>
				<Route path='/' element={<FrontLayout />}>
					<Route index element={<Home />} />
					<Route path='products' element={<Products />} />
					<Route path='product/:id' element={<ProductDetail />} />
					<Route path='wishlist' element={<Wishlist />} />

					<Route path='cart' element={<Cart />} />
					<Route path='checkout' element={<Checkout />} />
					<Route path='success/:orderId' element={<Success />} />
					<Route path='notFound' element={<NotFound />} />
					<Route path='*' element={<Navigate to='/NotFound' />} />
				</Route>
				<Route path='/login' element={<Login />} />
				<Route path='/admin' element={<Dashboard />}>
					<Route path='products' element={<AdminProducts />} />
					<Route path='coupons' element={<AdminCoupons />} />
					<Route path='orders' element={<AdminOrders />} />
					<Route path='articles' element={<AdminArticles />} />
				</Route>
			</Routes>
		</div>
	);
}

export default App;
