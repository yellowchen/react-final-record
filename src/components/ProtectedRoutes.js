import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = ({}) => {
    
    return cartData?.carts?.length ? <Outlet /> : <Navigate to='products' />;
}

export default ProtectedRoutes;