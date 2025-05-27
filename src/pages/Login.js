import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
	const navigate = useNavigate();

    const [data, setData] = useState({
        username: "",
        password: ""
    });

	const [loginState, setLoginState] = useState({});

    const handleChange = (e) => {
		console.log(e);
        const {name, value} = e.target;
        console.log("name: ", name, "value: ", value);
        //e.target.name & e.target.value
        setData({
            ...data,
            [name]: value
        })
        console.log(data);
    }

    //按鍵按下後會發生兩件事情：A登入 + B取得產品列表
    const submit = async(e) => {
		try {
			//A登入
			const res = await axios.post(`/v2/admin/signin`, data); //01 使用登入API
			const { token, expired } = res.data; //02 從登入的資訊中取得token
			console.log(res.data);

			// axios.defaults.headers.common["Authorization"] = AUTH_TOKEN; //axios的預設值在Headers裡面，必須夾帶一個驗證的資訊(每次發生請求時，預設值都會把token補上)

			//【存入token至cookie】
			//1 命名hexToken賦予token
			//2 將原本expired是一串數字的格式，使用new Date()轉換
			document.cookie = `hexToken=${token}; expires=${new Date(expired)};`;
			// console.log(document.cookie);

			res?.data?.success && navigate("/admin/products");
		}catch(err) {
			// alert("Wrong Account or Password")
			console.log(err.response.data.message);
			setLoginState(err.response.data)
		}
    }

	const enterKey = (e) => {
		console.log(e);
		if (e.key === "Enter") {
			submit();
		}
	};

	return (
		<div className='container py-5'>
			<div className='row justify-content-center'>
				<div className='col-md-6'>
					<h2>登入帳號</h2>

					<div className={`alert alert-danger ${loginState?.message ? "d-block" : "d-none"}`} role='alert'>
						{loginState?.message}
					</div>
					<div className='mb-2'>
						<label htmlFor='email' className='form-label w-100'>
							Email
							<input id='email' className='form-control' name='username' onChange={handleChange} />
						</label>
					</div>
					<div className='mb-2'>
						<label htmlFor='password' className='form-label w-100'>
							密碼
							<input
								type='password'
								className='form-control'
								name='password'
								id='password'
								placeholder='name@example.com'
								onChange={handleChange}
								onKeyDown={enterKey}
							/>
						</label>
					</div>
					<button type='button' className='btn btn-primary' onClick={submit}>
						登入
					</button>
				</div>
			</div>
		</div>
	);
}

export default Login;
