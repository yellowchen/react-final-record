import { useState, useEffect} from 'react';
import { useDispatch } from "react-redux";
import axios from "axios";

// import {ModalSelect} from "./FormElements"
import { Input, ModalInput, ModalSelect } from './FormElements';
// import { createAsyncMessage } from "../../slice/messageSlice";
import { ArticleModalRules } from './FormRules';
import { addZero } from './../store';


const ArticleModal = ({ closeModal, type, tempArticle, getArticles, getArticle, content }) => {
    console.log("tempArticle: ", tempArticle)
	const [date, setDate] = useState(new Date());
	console.log(date);
	const [tempData, setTempData] = useState({
		title: "",
		image: "",
		create_at: "",
		author: "",
		isPublic: true,
		content: "",
	});

	//04 Message推播處理
	const dispatch = useDispatch();

	//01 判斷是格式是新增還是修改
	useEffect(() => {
		if (type === "create") {
			setTempData({
				title: "",
				image: "",
				create_at: "",
				author: "",
				isPublic: true,
				content: "",
			});
			setDate(new Date(new Date().setDate(new Date().getDate()))); //將當前時間多加一天
		} else if (type === "edit") {
			setTempData(tempArticle);
			setDate(new Date(tempArticle.create_at));
		}
	}, [type, tempArticle, content]);
    console.log("tempData: ", tempData);

	//02 <input>輸入值轉型與否
	const handleChange = (e) => {
		const { value, name } = e.target;
		console.log("article-e.target: ", e.target);
		if (name === "isPublic") {
			setTempData((prevState) => ({
				...prevState,
				[name]: e.target.checked,
			}));
		} else {
			setTempData((prevState) => ({
				...prevState,
				[name]: value,
			}));
		}
	};
	console.log("articleTemp: ",tempData);

	//設定選擇的時間範圍(起碼不能小於當前日期)
	const handleDateRange = (e) => {
		if (new Date(e.target.value).getTime() < new Date().getTime()) {
			alert("創建日期不能小於當前日期");
		} else {
			setDate(new Date(e.target.value));
		}
	};

	//上傳圖片
	const uploadFile = async (e) => {
		const file = e.target.files[0];
		if (!file) return;
		const formData = new FormData();
		formData.append("file-to-upload", file);
		try {
			const imgUrl = await uploadImg(formData);
			setTempData({
				...tempData,
				image: imgUrl,
			});
		} catch (err) {
			console.log(err);
		}
	};
	const uploadImg = async (formData) => {
		const imgRes = await axios.post(`/v2/api/${process.env.REACT_APP_API_PATH}/admin/upload`, formData);
        // console.log(imgRes);
		return imgRes.data.imageUrl;
	};
	//刪除圖片
	const delImage = (image) => {
		setTempData({
			...tempData,
			image: "",
		});
	};

	//03 遞交輸入內容(新增產品內容、修產品改內容)
	const submit = async () => {
		try {
			//create
			let api = `/v2/api/${process.env.REACT_APP_API_PATH}/admin/article`;
			let method = "post";

			//edit
			if (type === "edit") {
				//全域變數
				api = `/v2/api/${process.env.REACT_APP_API_PATH}/admin/article/${tempArticle.id}`;
				method = "put";
			}

			const res = await axios[method](api, {
				data: {
					...tempData,
					create_at: date.getTime(),
				}, //資料沒寫全，就會failed axios
			});

			console.log(res);
			// dispatch(createAsyncMessage(res.data));
			closeModal();
			getArticles();
		} catch (err) {
			console.log(err);
			// dispatch(createAsyncMessage(err.response.data));
		}
	};
	//有更改資料，卻直接關閉檔案，資料保持原樣
	const handleCancel = (tempArticle) => {
		setTempData(tempArticle);
		closeModal();
	};

	return (
		<>
			<div
				className='modal fade'
				id='articleModal'
				tabIndex='-1'
				aria-labelledby='articleModalLabel'
				aria-hidden='true'
			>
				<div className='modal-dialog modal-lg'>
					<div className='modal-content'>
						{/* Header */}
						<div className='modal-header'>
							<div className='modal-title' id='articleModalLabel'>
								<h5>{type === "create" ? "建立新文章" : `編輯${tempArticle.title}`}</h5>
							</div>
							<button
								type='button'
								className='btn btn-close'
								data-bs-dismiss='modal'
								aria-label='Close'
							></button>
						</div>
						{/* Body */}
						<div className='modal-body'>
							<div className='row'>
								{/* LEFT */}
								<div className='col-sm-4 d-flex flex-column gap-2'>
									<Input
										id='customFile'
										labelText='上傳圖片'
										type='file'
										name='file-to-upload'
										placeholder=''
										value={""}
										onChange={uploadFile}
									/>
									{tempData.image && (
										<div className='text-center position-relative'>
											<img
												className='img-fluid rounded-2 mb-3'
												style={{ width: "200px", aspectRatio: "1/1" }}
												src={tempData.image || null}
												alt={tempData.title}
											/>
											<button
												type='button'
												onClick={delImage}
												className='btn btn-sm btn-close position-absolute'
												style={{ top: ".5rem", right: "1.8rem" }}
											></button>
											<p className='text-secondary'>《圖片預覽》</p>
										</div>
									)}
								</div>
								{/* RIGHT */}
								<div className='col-sm-8 d-flex flex-column gap-2'>
									<div className='row mb-2'>
										<div className='col-md-6'>
											<Input
												id='due_date'
												labelText='創建日期'
												type='date'
												name='due_date'
												placeholder='請輸入創建日期'
												value={`${date.getFullYear().toString()}-${addZero(
													date.getMonth() + 1
												)}-${addZero(date.getDate())}`}
												onChange={handleDateRange}
											/>
										</div>
										<div className='row mb-2'>
											{ArticleModalRules.map((item) => (
												<div className='col-md-6' key={item.id}>
													<ModalInput
														item={item}
														data={tempData}
														handleChange={handleChange}
													/>
												</div>
											))}
											<div>
												<label htmlFor='content'>文章內容</label>
												<textarea
													className='form-control'
													placeholder='請入文章內容'
													id='content'
													name='content'
													style={{ height: "100px" }}
													value={content}
													onChange={handleChange}
												></textarea>
											</div>
										</div>
									</div>
									<hr />
									<ModalSelect
										id='isPublic'
										name='isPublic'
										data={tempData}
										handleChange={handleChange}
									/>
								</div>
							</div>
						</div>
						{/* Footer */}
						<div className='modal-footer'>
							<button
								type='button'
								className='btn btn-secondary'
								data-bs-dismiss='modal'
								onClick={() => handleCancel(tempArticle)}
							>
								Close
							</button>
							<button type='button' className='btn btn-primary' onClick={submit}>
								Save changes
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default ArticleModal