import {useEffect, useReducer} from "react";
import {Outlet, useNavigate, Link} from "react-router-dom"
import axios from "axios";
import Message from "../../components/Message";
import { MessageContext, messageReducer, initState } from "../../store/messageStore";

const Dashboard = () => {
	const navigate = useNavigate();

	const reducer = useReducer(messageReducer, initState);
	//-->原先 const [state, dispatch] = useReducer(namedReducer, initState);

	//登出帳戶，清除cookie
	const logout = () => {
		document.cookie = "hexToken=;"; //"hexToken=;"
		navigate("/login");
	};

	//【取出token】
	const token = document.cookie
		.split("; ") //去除每個cookies彼此間的分隔號(; )，(分割字串、轉成陣列)
		.find((row) => row.startsWith("hexToken=")) //找尋字串startWith "hexToken"，(找到該元素)
		?.split("=")[1]; //去除=，(分割字串、轉成陣列)--> [0]為"hexToken"、[1]為一長串token

	// axios.defaults.headers.common["Authorization"] = AUTH_TOKEN;  //【全域axios預設值】
	// -->axios的預設值在headers裡面，必須夾帶一個驗證的資訊
	axios.defaults.headers.common["Authorization"] = token; //03 每次發生請求之後，預設值都會將token補上

	//【確認token是否正確或過期】
	useEffect(() => {
		//若沒有token
		if (!token) {
			return navigate("/login");  //加了return之後，若沒有token，就會執行跳轉至登入，不會再繼續執行後面的程式碼
		}
		//驗證token
		(async () => {
			try {
				await axios.post(`/v2/api/user/check`);
			} catch (err) {
				console.log(err);
				if (!err.response.data.success) {
					navigate("/login");
				}
			}
		})();
	}, [navigate, token]);

	return (
		<>
			<MessageContext.Provider value={reducer}>
				<Message />
				<nav className='navbar navbar-expand-lg bg-dark'>
					<div className='container-fluid'>
						<p className='text-white mb-0'>HEX EATS 後台管理系統</p>
						<button
							className='navbar-toggler'
							type='button'
							data-bs-toggle='collapse'
							data-bs-target='#navbarNav'
							aria-controls='navbarNav'
							aria-expanded='false'
							aria-label='Toggle navigation'
						>
							<span className='navbar-toggler-icon' />
						</button>
						<div className='collapse navbar-collapse justify-content-end' id='navbarNav'>
							<ul className='navbar-nav'>
								<li className='nav-item'>
									<button type='button' className='btn btn-sm btn-light' onClick={logout}>
										登出
									</button>
								</li>
							</ul>
						</div>
					</div>
				</nav>
				<div className='d-flex' style={{ minHeight: "calc(100vh - 56px)" }}>
					<div className='bg-light' style={{ width: "200px" }}>
						<ul className='list-group list-group-flush'>
							<Link className='list-group-item list-group-item-action py-3' to='/admin/products'>
								<i className='bi bi-cup-fill me-2' />
								產品列表
							</Link>
							<Link className='list-group-item list-group-item-action py-3' to='/admin/coupons'>
								<i className='bi bi-ticket-perforated-fill me-2' />
								優惠卷列表
							</Link>
							<Link className='list-group-item list-group-item-action py-3' to='/admin/orders'>
								<i className='bi bi-receipt me-2' />
								訂單列表
							</Link>
							<Link className='list-group-item list-group-item-action py-3' to='/admin/articles'>
								<i className='bi bi-file-earmark-text pe-2'></i>
								文章列表
							</Link>
						</ul>
					</div>
					<div className='w-100'>
						{/* Products */}
						{token && <Outlet />}
						{/* 在由上往下執行的過程中，會先優先子路由、子元件的部分，useEffect()中的內容會比較晚執行，因此這邊要加設判斷，如果沒有token就不執行子路由、子元件 */}
						{/* Products end */}
					</div>
				</div>
			</MessageContext.Provider>
		</>
	);
}

export default Dashboard;