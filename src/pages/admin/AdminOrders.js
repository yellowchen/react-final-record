import {useState, useRef, useEffect, useContext} from "react";
import axios from "axios";
import {Modal} from "bootstrap";

import Pagination from "./../../components/Pagination";
import OrderModal from './../../components/OrderModal';


const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [pagination, setPagination] = useState({});
    const [tempOrder, setTempOrder] = useState({});

    //bootstrap modal
    const orderModal = useRef(null);
    const deleteModal = useRef(null);

    const api = `/v2/api/${process.env.REACT_APP_API_PATH}`;
    
    //modal(不會因點擊背景就modal消失)效果設定
    useEffect(() => {
        orderModal.current = new Modal("#orderModal", {
            backdrop: "static"});
        getOrders();
    }, [])

    //取得訂單的行為
    const getOrders = async(page = 1) => {
        try {
            const orderRes = await axios.get(`${api}/admin/orders?page=${page}`);
            console.log(orderRes);
            setOrders(orderRes.data.orders);
            setPagination(orderRes.data.pagination);
            
        }catch(err) {
            console.log(err)
        }
    }

    //OrderModal
    const openOrderModal = (order) => {
        console.log(order);
        setTempOrder(order);
        orderModal.current.show();
    }
    const closeOrderModal = () => {
        //setTempOrder({}); ??
        orderModal.current.hide();
    }

	return (
		<div className='p-3'>
			{/* OrderModal */}
			<OrderModal 
                closeOrderModal={closeOrderModal} 
                getOrders={getOrders} 
                tempOrder={tempOrder} 
            />
			<h3>訂單列表</h3>
			<hr />
			<table className='table'>
				<thead>
					<tr>
						<th scope='col'>訂單 ID</th>
						<th scope='col'>購買用戶</th>
						<th scope='col'>訂單金額</th>
						<th scope='col'>付款狀態</th>
						<th scope='col'>外送進度</th>
						<th scope='col'>付款日期</th>
						<th scope='col'>留言訊息</th>
						<th scope='col'>編輯</th>
					</tr>
				</thead>
				<tbody>
					{orders.map((item) => (
						<tr key={item.id}>
							<td>{item.id}</td>
							<td>{item.user?.name}</td>
							<td>NT$ {item.total}</td>
							<td>{item.is_paid ? <span className='text-success fw-bold'>付款完成</span> : "未付款"}</td>
							<td>{item.status}</td>
							<td>{item.is_paid}</td>
							<td>{item.message}</td>
							<td>
								<button
									type='button'
									className='btn btn-primary btn-sm'
									onClick={() => openOrderModal(item)}
								>
									查看
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
			{/* <Pagination /> */}
			<Pagination pagination={pagination} changePage={getOrders} />
		</div>
	);
};

export default AdminOrders;
