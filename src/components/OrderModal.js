import { useState, useEffect, useContext } from "react";
import axios from "axios";

import { MessageContext, handleSuccessMessage, handleErrorMessage } from "../store/messageStore";


const OrderModal = ({ closeOrderModal, getOrders, tempOrder }) => {
    console.log(tempOrder);

    const [isLoading, setIsLoading] = useState(false);  //?
    const [tempData, setTempData] = useState({  //tempData是當前在OrderModal修改的內容；tempOrder是從api引入的客戶訂單資料
        is_paid: "",
        status: 0,
        ...tempOrder
    })

    const [, dispatch] = useContext(MessageContext);

    const api = `/v2/api/${process.env.REACT_APP_API_PATH}`;

    useEffect(() => {
        setTempData({
            ...tempOrder,
            is_paid: tempOrder.is_paid,
            status: tempOrder.status
        })
    }, [tempOrder]);

    console.log("tempData", tempData);

    const handleChange = (e) => {  //???
        console.log("e-change:", e);
        const {name, value, checked} = e.target;
        if(["is_paid"].includes(name)) {
            setTempData((prevState) => ({
                ...prevState,
                [name]: checked
            }))
        }else {
            setTempData((prevState) => ({
                ...prevState,
                [name]: value
            }))
        }
    }

    const submit = async() => {
        setIsLoading(true);
        try {
            const res = await axios.put(`${api}/admin/order/${tempOrder.id}`, {
                data: tempData
            });
            handleSuccessMessage(dispatch, res);
            setIsLoading(false);
            closeOrderModal();
            getOrders();
        }catch(err) {
            console.log(err);
            setIsLoading(false);
            handleErrorMessage(dispatch, err);
        }
    }

	return (
		<div
			id='orderModal'
			className='modal fade'
			tabIndex='-1'
			aria-labelledby='exampleModalLabel'
			aria-hidden='true'
		>
			<div className='modal-dialog modal-lg'>
				<div className='modal-content'>
					<div className='modal-header'>
						<h1 className='modal-title fs-5' id='exampleModalLabel'>
							編輯 {tempData.id}
						</h1>
						<button type='button' className='btn-close' aria-label='Close' onClick={closeOrderModal} />
					</div>
					<div className='modal-body'>
						<div className='mb-3 row'>
							<span className='col-sm-2 col-form-label'>Email</span>
							<div className='col-sm-10'>
								<input
									readOnly
									type='email'
									className='form-control-plaintext'
									id='staticEmail'
									defaultValue={tempData?.user?.email}
								/>
							</div>
						</div>
						<div className='mb-3 row'>
							<span className='col-sm-2 col-form-label'>訂購者</span>
							<div className='col-sm-10'>
								<input
									readOnly
									type='text'
									className='form-control-plaintext'
									defaultValue={tempData?.user?.name}
								/>
							</div>
						</div>
						<div className='mb-3 row'>
							<span className='col-sm-2 col-form-label'>外送地址</span>
							<div className='col-sm-10'>
								<input
									readOnly
									type='text'
									className='form-control-plaintext'
									id='staticEmail'
									defaultValue={tempData?.user?.address}
								/>
							</div>
						</div>
						<div className='mb-3 row'>
							<span className='col-sm-2 col-form-label'>留言</span>
							<div className='col-sm-10'>
								<input
									readOnly
									type='text'
									col='30'
									className='form-control-plaintext'
									defaultValue={tempData.message}
								/>
							</div>
						</div>
						{tempData.products && (
							<table className='table'>
								<thead>
									<tr>
										<th>品項名稱</th>
										<th>數量</th>
									</tr>
								</thead>
								<tbody>
									{Object.values(tempData.products).map((cart) => (
										<tr key={cart.id}>
											<td>{cart.product.title}</td>
											<td>{cart.qty}</td>
										</tr>
									))}
								</tbody>
								<tfoot>
									<tr>
										<td className='border-0 text-end'>總金額</td>
										<td className='border-0'>$ {tempData.total}</td>
									</tr>
								</tfoot>
							</table>
						)}
						<div>
							<h5 className='mt-4'>修改訂單狀態</h5>
							<div className='form-check mb-4'>
								<label htmlFor='form-check-label' htmlFor='is_paid'>
									<input
										type='checkbox'
										className='form-check-input'
										name='is_paid'
										id='is_paid'
										checked={!!tempData.is_paid}
										onChange={handleChange}
										disabled={isLoading}
									/>
									付款狀態 ({tempData.is_paid ? "已付款" : "未付款"})
								</label>
							</div>
							<div className='mb-4'>
								<span className='col-sm-2 col-form-label'>外送進度</span>
								<select
									name='status'
									className='form-select'
									value={tempData.status}
									onChange={handleChange}
									disabled={isLoading}
								>
									<option value={0}>未確認</option>
									<option value={1}>已確認</option>
									<option value={2}>外送中</option>
									<option value={3}>已送達</option>
								</select>
							</div>
						</div>
					</div>
					<div className='modal-footer'>
						<button type='button' className='btn btn-secondary' onClick={closeOrderModal}>
							關閉
						</button>
						<button type='button' className='btn btn-primary' onClick={submit}>
							儲存
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default OrderModal;