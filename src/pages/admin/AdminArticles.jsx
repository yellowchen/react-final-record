import {useEffect, useState, useRef} from "react";
import { Modal } from "bootstrap";
import axios from "axios";

import ArticleModal from "../../components/ArticleModal";
import DeleteModal from "./../../components/DeleteModal";
import Pagination from '../../components/Pagination';

import { createAsyncMessage } from "../../slice/messageSlice";
import { useDispatch } from 'react-redux';



const AdminArticles = () => {
	const [articles, setArticles] = useState([]);
    const [content, setContent] = useState([]);
	const [type, setType] = useState("create");
	const [tempArticle, setTempArticle] = useState({});
	const [pagination, setPagination] = useState({});

	//04 Message推播處理
	const dispatch = useDispatch();

	//01取得所有項目API
	const getArticles = async (page = 1) => {
		try {
			const res = await axios.get(`/v2/api/${process.env.REACT_APP_API_PATH}/admin/articles?page=${page}`);
			console.log("getArticles: ", res.data); //{success: true/false, message:[], products: [...], pagination: {...}}
			setArticles(res.data.articles);
			setPagination(res.data.pagination);
		} catch (err) {
			console.log(err);
		}
	};
	console.log("articles: ", articles);

	//getArticle
	const getArticle = async (id) => {
		try {
			const res = await axios.get(`/v2/api/${process.env.REACT_APP_API_PATH}/admin/article/${id}`);
            console.log("getArticle: ",res.data.article);
            // setTempArticle(res.data.article);
            setContent(res.data.article.content)
		} catch (err) {
			console.log(err);
		}
	};
    // console.log("article: ",article);

	//02刪除單個項目API
	const deleteArticle = async (id) => {
		try {
			const res = await axios.delete(`/v2/api/${process.env.REACT_APP_API_PATH}/admin/article/${id}`);
			// console.log(res);
			if (res.data.success) {
				dispatch(createAsyncMessage(res.data));
				closeDeleteModal();
				getArticles();
			}
		} catch (err) {
			console.log(err);
		}
	};

	//03 各功能Modal製作
	const articleModal = useRef(null);
	const deleteModal = useRef(null);

	useEffect(() => {
		articleModal.current = new Modal("#articleModal", {
			backdrop: "static",
		});
		deleteModal.current = new Modal("#deleteModal", {
			backdrop: "static",
		});
		getArticles();
	}, []);

	//ArticleModal
	const openArticleModal = (type, item) => {
		setType(type);
        getArticle(item.id);
		setTempArticle(item);
		articleModal.current.show();
	};
	const closeArticleModal = () => {
		articleModal.current.hide();
	};

	//DeleteModal
	const openDeleteModal = (item) => {
		setTempArticle(item);
		deleteModal.current.show();
	};
	const closeDeleteModal = () => {
		deleteModal.current.hide();
	};



	return (
		<div className='p-3'>
			<ArticleModal
				closeModal={closeArticleModal}
				type={type}
				tempArticle={tempArticle}
				getArticles={getArticles}
                getArticle={getArticle}
                content={content}
			/>
			<DeleteModal 
                closeModal={closeDeleteModal} 
                tempItem={tempArticle} 
                deleteItem={deleteArticle} 
            />
			<h4>Articles</h4>
			<hr />
			<div className='addNew text-end mb-3'>
				<button
					type='button'
					className='btn btn-outline-primary p-1'
					onClick={() => {
						openArticleModal("create", {});
					}}
				>
					Create New
				</button>
			</div>
			<table className='table text-center align-middle'>
				<thead>
					<tr>
						<th scope='col'>創建時間</th>
						<th scope='col'>作者</th>
						{/* <th scope='col'>描述</th> */}
						<th scope='col'>標題</th>
						<th scope='col'>縮圖</th>
						<th scope='col'>開放狀態</th>
						<th scope='col'>編輯</th>
					</tr>
				</thead>
				<tbody>
					{articles
						.sort((a, b) => (a.create_at > b.create_at ? -1 : 1))
						.map((item) => (
							<tr key={item.id}>
								<td>{new Date(item.create_at).toDateString()}</td>
								<td>{item.author}</td>
								{/* <td>{item.description}</td> */}
								<td>{item.title}</td>
								<td>
									<img
										src={item?.image || null}
										alt={item.title}
										style={{ width: "70px", height: "70px" }}
										className='rounded-1'
									/>
								</td>
								<td>{item.isPublic ? "開放" : "未開放"}</td>
								<td>
									<button
										type='button'
										className='btn btn-outline-primary p-1 m-1'
										onClick={() => {
											openArticleModal("edit", item);
										}}
									>
										Edit
									</button>
									<button
										type='button'
										className='btn btn-outline-danger p-1 m-1'
										onClick={() => {
											openDeleteModal(item);
										}}
									>
										Del
									</button>
								</td>
							</tr>
						))}
				</tbody>
			</table>

			<Pagination changePage={getArticles} pagination={pagination} />
		</div>
	);
}

export default AdminArticles