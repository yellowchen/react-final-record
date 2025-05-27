import { useState, useEffect, useContext } from 'react';
import axios from "axios";
import Input from './Input';
import { MessageContext, handleSuccessMessage, handleErrorMessage } from './../store/messageStore';
import { addZero } from '../store';


const CouponModal = ({ closeModal, getCoupons, type, tempCoupon, setTempCoupon }) => {
	const [tempData, setTempData] = useState({
		title: "",
		is_enabled: 1,
		percent: 80,
		due_date: 1555459200,
		code: "testCode",
	});

	//轉換日期格式
	// api --> unix timestamp格式(ex. 1555459200)
	// new Date() --> 儲存的時間格式
	// input --> 實際日期 2024-4-11 (<input>value顯示上的格式需要這樣的呈現)
	const [date, setDate] = useState(new Date());
	console.log(date);
    console.log(- true);
    console.log(Boolean([]));

	const [, dispatch] = useContext(MessageContext);

	useEffect(() => {
		if (type === "create") {
			//初始化資料
			setTempData({
				title: "",
				is_enabled: 1,
				percent: 80,
				due_date: 1555459200,
				code: "testCode",
			});
			setDate(new Date()); //當是新增coupon，日期的顯示會以當天為主
		} else if (type === "edit") {
			setTempData(tempCoupon);
			setDate(new Date(tempCoupon.due_date)); //若是編輯coupon，日期的顯示會以該coupon的due_date為主
		}
	}, [type, tempCoupon]);

	const handleChange = (e) => {
		//console.log(e)
		const { value, name } = e.target;
		//console.log(typeof +e.target.checked);

		if (["num", "percent"].includes(name)) {
			//送出結果時，一定要是數字型別
			setTempData({
				...tempData,
				[name]: Number(value),
			});
		} else if (name === "is_enabled") {
			//is_enabled是判別0 or 1
			//要綁定的是e.target.checked
			setTempData({
				...tempData,
				[name]: +e.target.checked, //e.target.checked是呈現true/false，使用+可以轉成數字0/1
			});
		} else {
			setTempData({
				...tempData,
				[name]: value,
			});
		}
	};

	const submit = async () => {
		try {
			let api = `/v2/api/${process.env.REACT_APP_API_PATH}/admin/coupon`;
			let method = "post";

			if (type === "edit") {
				api = `/v2/api/${process.env.REACT_APP_API_PATH}/admin/coupon/${tempCoupon.id}`;
				method = "put";
			}

			console.log("api: ", api);

			const res = await axios[method](api, {
				data: {
					...tempData,
					due_date: date.getTime(), //這邊會轉換成unix timeStamp
				}, //資料沒寫全，就會failed axios
			});
			//帶出更新成功的訊息
			handleSuccessMessage(dispatch, res);
			closeModal();
			getCoupons(); //取得遠端產品資料
		} catch (err) {
			console.log(err);
			handleErrorMessage(dispatch, err);
		}
	};

	return (
		<div
			id='couponModal'
			className='modal fade'
			tabIndex='-1'
			aria-labelledby='exampleModalLabel'
			aria-hidden='true'
		>
			<div className='modal-dialog modal-lg'>
				<div className='modal-content'>
					<div className='modal-header'>
						<h1 className='modal-title fs-5' id='exampleModalLabel'>
							{type === "create" ? "建立新優惠券" : `編輯 ${tempData.title}`}
						</h1>
						<button type='button' className='btn-close' aria-label='Close' onClick={closeModal} />
					</div>
					<div className='modal-body'>
						<Input
							labelText='標題'
							type='text'
							id='title'
							name='title'
							placeholder='請輸入標題'
							value={tempData.title}
							onChange={handleChange}
						/>
						<div className='row'>
							<div className='col-md-6 mb-2'>
								<Input
									labelText='折扣(%)'
									type='text'
									id='percent'
									name='percent'
									placeholder='請輸入折扣(%)'
									value={tempData.percent}
									onChange={handleChange}
								/>
							</div>
							<div className='col-md-6 mb-2'>
								<label className='w-100' htmlFor='due_date'>
									到期日
									<input
										type='date'
										id='due_date'
										name='due_date'
										placeholder='請輸入到期日'
										className='form-control mt-1'
										value={`${date.getFullYear().toString()}-${addZero(
											date.getMonth() + 1
										)}-${addZero(date.getDate())}`}
										onChange={(e) => {
											setDate(new Date(e.target.value)); //儲存時間，需為"時間格式"
										}}
									/>
								</label>
							</div>
							<div className='col-md-6 mb-2'>
								<Input
									labelText='優惠碼'
									type='text'
									id='code'
									name='code'
									placeholder='請輸入優惠碼'
									value={tempData.code}
									onChange={handleChange}
								/>
							</div>
						</div>
						<label className='form-check-label' htmlFor='is_enabled'>
							是否啟用
							<input
								type='checkbox'
								id='is_enabled'
								name='is_enabled'
								placeholder='請輸入產品說明內容'
								className='form-check-input'
								checked={!!tempData.is_enabled}  //!!將結果轉成純布林值true/false
								onChange={handleChange}
							/>
						</label>
					</div>
					<div className='modal-footer'>
						<button type='button' className='btn btn-secondary' onClick={closeModal}>
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

export default CouponModal;