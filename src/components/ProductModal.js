import { useState, useEffect, useContext } from 'react';
import axios from "axios";
import Input from './Input';
import { MessageContext, handleSuccessMessage, handleErrorMessage } from '../store/messageStore';

const ProductModal = ({ closeProductModal, getProducts, type, tempProduct }) => {
    const [tempData, setTempData] = useState({
			title: "",
			category: "",
			origin_price: 100,
			price: 300,
			unit: "",
			description: "",
			content: "",
			is_enabled: 1, //0與1的切換
			imageUrl: "",
		});

	//const [message, dispatch] = useContext(MessageContext);
	//這邊的message只是state的一個代稱，可以自己變化名稱
	//message在這個元件中不會使用到，可以刪掉，但後面的逗點要保留
	const [, dispatch] = useContext(MessageContext);

	useEffect(() => {
		if(type === "create") {
			//初始化資料
			setTempData({
				title: "",
				category: "",
				origin_price: 100,
				price: 300,
				unit: "",
				description: "",
				content: "",
				is_enabled: 1, //0與1的切換
				imageUrl: "",
			});
		}else if(type === "edit") {
			setTempData(tempProduct)
		}
	}, [type, tempProduct])

    const submit = async () => {
        try {
            //create
			let api = `/v2/api/${process.env.REACT_APP_API_PATH}/admin/product`;
			let method = "post";

            //edit
            if (type === "edit") {
                //全域變數
				api = `/v2/api/${process.env.REACT_APP_API_PATH}/admin/product/${tempProduct.id}`;
				method = "put";
			}

            const res = await axios[method](api, {
				data: tempData, //資料沒寫全，就會failed axios
			});

			//帶出更新成功的訊息
			handleSuccessMessage(dispatch, res);
            closeProductModal();
            getProducts();  //取得遠端產品資料
        } catch (err) {
			//帶出更新失敗的訊息
			handleErrorMessage(dispatch, err);
        }
    };

    const handleChange = (e) => {
		//console.log(e)
		const { value, name } = e.target;
		//console.log(typeof +e.target.checked);

		if (["price", "origin_price"].includes(name)) {
			//在價格部分，送出結果時，一定要是數字型別
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

	const uploadFile = async (e) => {
		const file = e.target.files[0];
		if (!file) return;
		const formData = new FormData();
		formData.append("file-to-upload", file);
		// console.log(formData);
		try {
			const imgUrl = await uploadImg(formData);
			setTempData({  //setTempData? setTempProduct?
				...tempData,
				imageUrl: imgUrl,
			});
		} catch (err) {
			console.log(err);
		}
	};

	const uploadImg = async (formData) => {
		const imgRes = await axios.post(`/v2/api/${process.env.REACT_APP_API_PATH}/admin/upload`, formData);
		// console.log(imgRes.data.imageUrl);
		return imgRes.data.imageUrl;
	}
	// console.log(tempProduct);

	//圖片呈現在modal中

	return (
		<div id='productModal' className='modal fade' tabIndex='-1' aria-labelledby='exampleModalLabel' aria-hidden='true'>
			<div className='modal-dialog modal-lg'>
				<div className='modal-content'>
					<div className='modal-header'>
						<h1 className='modal-title fs-5' id='exampleModalLabel'>
							{type === "create" ? "建立新商品" : `編輯 ${tempData.title}`}
						</h1>
						<button type='button' className='btn-close' aria-label='Close' onClick={closeProductModal} />
					</div>
					<div className='modal-body'>
						<div className='row'>
							<div className='col-sm-4'>
								<div className='form-group mb-2'>
									<label className='w-100' htmlFor='image'>
										輸入圖片網址
										<input
											type='text'
											name='imageUrl'
											id='image'
											placeholder='請輸入圖片連結'
											className='form-control'
										/>
									</label>
								</div>
								<div className='form-group mb-2'>
									<Input
										labelText='或 上傳圖片'
										type='file'
										id='customFile'
										name='file-to-upload'
										placeholder=''
										value={""}
										onChange={uploadFile}
									/>
								</div>
								<img src={tempData.imageUrl} alt='' className='img-fluid' />
							</div>
							<div className='col-sm-8'>
								<div className='form-group mb-2'>
									<Input
										labelText='標題'
										type='text'
										id='title'
										name='title'
										placeholder='請輸入標題'
										value={tempData.title}
										onChange={handleChange}
									/>
								</div>
								<div className='row'>
									<div className='form-group mb-2 col-md-6'>
										<Input
											labelText='分類'
											type='text'
											id='category'
											name='category'
											placeholder='請輸入分類'
											value={tempData.category}
											onChange={handleChange}
										/>
									</div>
									<div className='form-group mb-2 col-md-6'>
										<Input
											labelText='單位'
											type='unit'
											id='unit'
											name='unit'
											placeholder='請輸入單位'
											value={tempData.unit}
											onChange={handleChange}
										/>
									</div>
								</div>
								<div className='row'>
									<div className='form-group mb-2 col-md-6'>
										<Input
											labelText='原價'
											type='number'
											id='origin_price'
											name='origin_price'
											placeholder='請輸入原價'
											value={tempData.origin_price}
											onChange={handleChange}
										/>
									</div>
									<div className='form-group mb-2 col-md-6'>
										<Input
											labelText='售價'
											type='number'
											id='price'
											name='price'
											placeholder='請輸入售價'
											value={tempData.price}
											onChange={handleChange}
										/>
									</div>
								</div>
								<hr />
								<div className='form-group mb-2'>
									<Input
										labelText='產品描述'
										type='text'
										id='description'
										name='description'
										placeholder='請輸入產品描述'
										value={tempData.description}
										onChange={handleChange}
									/>
								</div>
								<div className='form-group mb-2'>
									<Input
										labelText='說明內容'
										type='text'
										id='content'
										name='content'
										placeholder='請輸入說明內容'
										value={tempData.content}
										onChange={handleChange}
									/>
								</div>
								<div className='form-group mb-2'>
									<div className='form-check'>
										<label className='w-100 form-check-label' htmlFor='is_enabled'>
											是否啟用
											<input
												type='checkbox'
												id='is_enabled'
												name='is_enabled'
												placeholder='請輸入產品說明內容'
												className='form-check-input'
												checked={!!tempData.is_enabled}
												onChange={handleChange}
											/>
										</label>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className='modal-footer'>
						<button type='button' className='btn btn-secondary' onClick={closeProductModal}>
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

export default ProductModal;
