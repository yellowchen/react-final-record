import { useState, useEffect, useRef} from 'react';
import { useDispatch } from "react-redux";
import axios from "axios";

// import {ModalSelect} from "./FormElements"
import { Input, ModalInput, ModalSelect } from './FormElements';
// import { createAsyncMessage } from "../../slice/messageSlice";
import { ArticleModalRules } from './FormRules';
import { addZero } from './../store';


const ArticleModal = ({ closeModal, type, tempArticle, getArticles}) => {
	const [date, setDate] = useState(new Date());
	console.log(date);

	//tag
	const [tags, setTags] = useState([]);
	const [typing, setTyping] = useState(false);
	const [editLast, setEditLast] = useState(false);
	const tagInputRef = useRef(null);

	const [tempData, setTempData] = useState({
		title: "",
		image: "",
		create_at: "",
		author: "",
		isPublic: true,
		content: "",
		tag: [],
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
				tag: [],
			});
			setDate(new Date(new Date().setDate(new Date().getDate()))); //將當前時間多加一天
		} else if (type === "edit") {
			setTempData(tempArticle);
			setDate(new Date(tempArticle.create_at));
		}
	}, [type, tempArticle]);
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

	//addTag
	console.log("tags: ", tags);
	console.log("tempDataTag: ", tempData.tag);
	const handleTag = async (e) => {
		e.preventDefault();
		if (e.key === "Enter") {
			let tagText = tagInputRef.current.textContent;
			console.log(tagText);
			if (tagText !== "" && !tags.includes(tagText)) {
				if (tempData.tag.length === 0) {
					await setTags((prevState) => [...prevState, tagText]);
				} else if (tempData.tag.length > 0) {
					await setTags([...tempData.tag, tagText]);
				}
				await setTempData({
					...tempData,
					tag: tags,
				});

				tagInputRef.current.textContent = "";
			} else {
				alert("Your tag is empty.");
			}
		} else if (e.key === "Backspace") {
			if (tagInputRef.current.textContent === "" && tags.length > 0) {
				if (editLast) {
					console.log("editLast in: ", editLast);
					let lastTag = tags[tags.length - 1];
					await setTags((tags) => tags.filter((item) => lastTag !== item));
					setTempData({
						...tempData,
						tag: tags,
					});
					tagInputRef.current.textContent = lastTag;

					//將輸入鍵移至尾端
					let range = document.createRange();
					let sel = window.getSelection();
					range.setStart(tagInputRef.current.childNodes[0], tagInputRef.current.textContent.length);
					range.collapse(true);
					sel.removeAllRanges();
					sel.addRange(range);
					tagInputRef.current.focus();

					setEditLast(false);
				} else {
					setEditLast(true);
				}
			}
		}
		console.log("editLast out: ", editLast);
	};

	console.log("typing: ", typing);

	const removeTag = async (index) => {
		await setTags(tags.filter((_, i) => i !== index));
		console.log("remove tag: ", tags);
		setTempData({
			...tempData,
			tag: tags,
		});
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
												<div className='w-100 form-label'>
													標籤
													<div className='d-flex flex-wrap gap-2 align-items-center'>
														{tempData?.tag &&
															tempData?.tag?.map((item, index) => (
																<div key={index} className='d-inline-block tag'>
																	<span className=''>{item}</span>
																	<span
																		className='d-inline-block '
																		onClick={() => removeTag(index)}
																		style={{
																			borderRadius: "50%",
																			color: "red",
																			marginLeft: "10px",
																			textAlign: "center",
																			cursor: "pointer",
																		}}
																	>
																		&times;
																	</span>
																</div>
															))}
														{typing ? (
															// <input
															//
															// 	className='form-control'
															// 	type='text'
															// 	id='tag'
															// 	name='tag'
															// 	value={tagInput}
															// 	onKeyDown={handleAddTag}
															// 	onChange={(e) => {
															// 		setTagInput(e.target.value);
															// 	}}
															// />
															<span
																className='tag-edit'
																ref={tagInputRef}
																onKeyUp={handleTag}
																onBlur={() => {
																	setTyping(false);
																}}
																contentEditable
															></span>
														) : (
															<button
																className='btn tag-btn'
																type='button'
																onClick={() => {
																	setTyping(true);
																	setTimeout(() => {
																		tagInputRef.current.focus();
																	}, 200);
																}}
															>
																+
															</button>
														)}
													</div>
												</div>
											</div>
											<div>
												<label htmlFor='content'>文章內容</label>
												<textarea
													className='form-control'
													placeholder='請入文章內容'
													id='content'
													name='content'
													style={{ height: "100px" }}
													value={tempData.content}
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