import { useEffect, useState, useRef, useContext } from 'react';
import axios from "axios";
import { Modal } from "bootstrap";

import CouponModal from '../../components/CouponModal';
import DeleteModal from '../../components/DeleteModal';
import Pagination from '../../components/Pagination';
import { MessageContext, deleteSuccessMessage } from './../../store/messageStore';


const AdminCoupons = () => {
	const [coupons, setCoupons] = useState([]);
	const [pagination, setPagination] = useState({});

	//宣告type變數，決定modal要展開的用途
	const [type, setType] = useState("create"); //create是新增、edit是編輯

	//暫存欄位(當點擊編輯時，要將該商品的資料傳進暫存欄位)
	const [tempCoupon, setTempCoupon] = useState({});

	const [, dispatch] = useContext(MessageContext);

	//bootstrap modal
	const couponModal = useRef(null);
	const deleteModal = useRef(null);

    const api = `/v2/api/${process.env.REACT_APP_API_PATH}`;

	//管理員只要登入後，(只要沒有登出、expired日期沒到)，即便重新進入登入頁面，一樣可以取得遠端的相關資料
	useEffect(() => {
		couponModal.current = new Modal("#couponModal", {
			backdrop: "static",
		});
		deleteModal.current = new Modal("#deleteModal", {
			backdrop: "static",
		});
		// console.log("productModal.current: ", productModal.current);
		getCoupons();
	}, []);


	//取得Coupon的行為
	const getCoupons = async (page = 1) => {
		try {
			//B取得產品列表
			const couponRes = await axios.get(`${api}/admin/coupons?page=${page}`); //04 在後台API要進行驗證時，就會透過前面的這組toke來進行驗證，進而後面取得登入後才可取得的產品資料
			console.log(couponRes);
			setCoupons(couponRes.data.coupons);
			setPagination(couponRes.data.pagination);
		} catch (err) {
			console.log(err);
		}
	};

	//刪除行為
	const deleteCoupon = async(id) => {
		try {
			const res = await axios.delete(`/v2/api/${process.env.REACT_APP_API_PATH}/admin/coupon/${id}`);
			// console.log(res);
			if(res.data.success) {
				deleteSuccessMessage(dispatch, res);
				deleteModal.current.hide();
				getCoupons(); //取得遠端產品資料
			}
		}catch(err) {
			console.log(err);
		}
	};

	//CouponModal
	const openCouponModal = (type, item) => {
		setType(type);
		setTempCoupon(item);
		couponModal.current.show();
	};
	const closeModal = () => {
		couponModal.current.hide();
	};

	//DeleteModal
	const openDeleteModal = (item) => {
		setTempCoupon(item);
		deleteModal.current.show();
	};
	const closeDeleteModal = () => {
		deleteModal.current.hide();
	};

	return (
		<div className='p-3'>
			<CouponModal
				closeModal={closeModal}
				getCoupons={getCoupons}
				type={type}
				setTempCoupon={setTempCoupon}
				tempCoupon={tempCoupon}
			/>
			<DeleteModal 
                close={closeDeleteModal} 
                text={tempCoupon.title} 
                handleDelete={deleteCoupon} 
                id={tempCoupon.id} 
            />
			<h3>優惠券列表</h3>
			<hr />
			<div className='text-end'>
				<button type='button' className='btn btn-primary btn-sm' onClick={() => openCouponModal("create", {})}>
					建立新優惠券
				</button>
			</div>
			<table className='table'>
				<thead>
					<tr>
						<th scope='col'>標題</th>
						<th scope='col'>折扣</th>
						<th scope='col'>到期日</th>
						<th scope='col'>優惠碼</th>
						<th scope='col'>啟用狀態</th>
						<th scope='col'>編輯</th>
					</tr>
				</thead>
				<tbody>
					{coupons.map((item) => (
						<tr key={item.id}>
							<td>{item.title}</td>
							<td>{item.percent}</td>
							<td>{new Date(item.due_date).toDateString()}</td>
							<td>{item.code}</td>
							<td>{item.is_enabled ? "啟用" : "未啟用"}</td>
							<td>
								<button type='button' className='btn btn-primary btn-sm' onClick={() => openCouponModal("edit", item)}>
									編輯
								</button>
								<button
									type='button'
									className='btn btn-outline-danger btn-sm ms-2'
									onClick={() => openDeleteModal(item)}
								>
									刪除
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>

			{/* Pagination */}
			<Pagination pagination={pagination} changePage={getCoupons} />
		</div>
	);
}

export default AdminCoupons;