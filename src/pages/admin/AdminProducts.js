import { useEffect, useState, useRef, useContext } from 'react';
import axios from "axios";
import { Modal } from "bootstrap";

import ProductModal from '../../components/ProductModal';
import DeleteModal from '../../components/DeleteModal';
import Pagination from '../../components/Pagination';
import { deleteSuccessMessage, MessageContext } from './../../store/messageStore';


const AdminProducts = () => {
	const [products, setProducts] = useState([]);
	const [pagination, setPagination] = useState({});

	//宣告type變數，決定modal要展開的用途
	const [type, setType] = useState("create"); //create是新增、edit是編輯

	//暫存欄位(當點擊編輯時，要將該商品的資料傳進暫存欄位)
	const [tempProduct, setTempProduct] = useState({});

	const [, dispatch] = useContext(MessageContext);

	//bootstrap modal
	const productModal = useRef(null);
	const deleteModal = useRef(null);


	//設定modal的效果(點擊modal外的背景，也不會因此關掉modal)
	//語法const myModalAlternative = new bootstrap.Modal('#myModal', options)
	//-->引入mdn才要加入bootstrap
	//const myModalAlternative = new Modal('#myModal', options)
	useEffect(() => {
		productModal.current = new Modal("#productModal", {
			backdrop: "static",
		});
		deleteModal.current = new Modal("#deleteModal", {
			backdrop: "static",
		});
		getProducts();
	}, []);

	//取得產品的行為
	const getProducts = async (page = 1) => {
		try {
			//B取得產品列表
			const productRes = await axios.get(`/v2/api/${process.env.REACT_APP_API_PATH}/admin/products?page=${page}`); //04 在後台API要進行驗證時，就會透過前面的這組toke來進行驗證，進而後面取得登入後才可取得的產品資料
			// console.log(productRes);
			setProducts(productRes.data.products);
			setPagination(productRes.data.pagination);
		} catch (err) {
			console.log(err);
		}
	};

	//刪除行為
	const deleteProduct = async (id) => {
		try {
			const res = await axios.delete(`/v2/api/${process.env.REACT_APP_API_PATH}/admin/product/${id}`);
			console.log(res);
			if (res.data.success) {
				//帶出刪除成功的訊息
				deleteSuccessMessage(dispatch, res);
				deleteModal.current.hide();
				getProducts(); //取得遠端產品資料
			}
		} catch (err) {
			console.log(err);
		}
	};

	//ProductModal
	const openProductModal = (type, product) => {
		setType(type);
		setTempProduct(product);
		productModal.current.show();
	};
	const closeProductModal = () => {
		productModal.current.hide();
	};

	//DeleteModal
	const openDeleteModal = (product) => {
		setTempProduct(product);
		deleteModal.current.show();
	};
	const closeDeleteModal = () => {
		deleteModal.current.hide();
	};

	return (
		<div className='p-3'>
			<ProductModal
				closeProductModal={closeProductModal}
				getProducts={getProducts}
				type={type}
				tempProduct={tempProduct}
			/>
			<DeleteModal 
                close={closeDeleteModal} 
                text={tempProduct.title} 
                handleDelete={deleteProduct} 
                id={tempProduct.id} 
            />
			<h3>產品列表</h3>
			<hr />
			<div className='text-end'>
				<button type='button' className='btn btn-primary btn-sm' onClick={() => openProductModal("create", {})}>
					建立新商品
				</button>
			</div>
			<table className='table'>
				<thead>
					<tr>
						<th scope='col'>分類</th>
						<th scope='col'>名稱</th>
						<th scope='col'>售價</th>
						<th scope='col'>啟用狀態</th>
						<th scope='col'>編輯</th>
					</tr>
				</thead>
				<tbody>
					{products.map((item) => (
						<tr key={item.id}>
							<td>{item.category}</td>
							<td>{item.title}</td>
							<td>{item.price}</td>
							<td>{item.is_enabled ? "啟用" : "未啟用"}</td>
							<td>
								<button type='button' className='btn btn-primary btn-sm' onClick={() => openProductModal("edit", item)}>
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
			<Pagination pagination={pagination} changePage={getProducts} />
		</div>
	);
}

export default AdminProducts;

