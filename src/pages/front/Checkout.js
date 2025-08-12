import { useState, useContext } from 'react';
import { useForm } from "react-hook-form";

// import { Input } from "../../components/FormElement";
import axios from "axios";
import { useOutletContext, Link, useNavigate } from 'react-router-dom';
import { thousandFormat } from "../../store";
import { PaymentContext } from './FrontLayout';
import { Navigate } from 'react-router-dom';


const Checkout = () => {
    // const [select, setSelect] = useState("");
    const {select, handleSelected} = useContext(PaymentContext);

    const {cartData} = useOutletContext();
    console.log(cartData);
    const navigate = useNavigate();
	const api = `/v2/api/${process.env.REACT_APP_API_PATH}`;
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		mode: "onTouched",
	});
    console.log(errors);
    
	const onSubmit = async (data) => {
        console.log(data);
        const {email, name, tel, address} = data;
        // console.log(name, email, tel, address);
		const form = {
			data: {
				user: {
					email,
                    name,
					tel,
					address,
				},
			},
		};
		try {
			const res = await axios.post(`${api}/order`, form);
            console.log(res);
            console.log(res.data.orderId)
            navigate(`/success/${res.data.orderId}`)
		} catch (err) {
			console.log(err);
		}
	};



    const inputRules = [
		{
			id: "email",
			labelText: "Email",
			type: "email",
			rules: {
				required: "Email 為必填",
				pattern: {
					value: /^\S+@\S+$/i,
					message: "Email 格式不正確",
				},
			},
		},
		{
			id: "name",
			labelText: "Username",
			type: "text",
			rules: {
				required: "使用者名稱為必填",
				maxLength: {
					value: 10,
					message: "使用者名稱長度不超過 10",
				},
			},
		},
		{
			id: "tel",
			labelText: "Tel",
			type: "tel",
			rules: {
				required: "電話為必填",
				minLength: {
					value: 6,
					message: "電話不少於 6 碼",
				},
				maxLength: {
					value: 12,
					message: "電話不超過 12 碼",
				},
			},
		},
		{
			id: "address",
			labelText: "Address",
			type: "text",
			rules: {
				required: "地址為必填",
			},
		},
	];

    const checkRules = [
		{
			id: "gridRadios1",
			name: "gridRadio",
			value: "WebATM",
			labelText: "WebATM",
			rules: {
				required: true,
			},
		},
		{
			id: "gridRadios2",
			name: "gridRadio",
			value: "ATM",
			labelText: "ATM",
			rules: {
				required: true,
			},
		},
		{
			id: "gridRadios3",
			name: "gridRadio",
			value: "ApplePay",
			labelText: "ApplePay",
			rules: {
				required: true,
			},
		},
	];


	return (
		<div className='bg-light pt-5 pb-7'>
			<div className='container'>
				<div className='row justify-content-center flex-md-row flex-column-reverse'>
					{cartData?.carts?.length === 0 ? (
						<Navigate to='/products' />
					) : (
						<>
							<form className='col-md-6' onSubmit={handleSubmit(onSubmit)}>
								<div className='bg-white p-4'>
									<h4 className='fw-bold'>Contact information</h4>

									{inputRules.map(({ id, labelText, type, rules }) => (
										<div className='mb-2' key={id}>
											<label htmlFor={id} className='form-label'>
												{labelText}
											</label>
											<input
												id={id}
												type={type}
												className={`form-control ${errors[id] && "is-invalid"}`}
												{...register(id, rules)}
											/>
											{errors[id] && (
												<div className='invalid-feedback'>{errors[id]?.message}</div>
											)}
										</div>
									))}

									<div className='mb-2'>
										<p className='mt-4'>Payment</p>
										{/* react-hook-form use in radio */}
										{checkRules.map(({ id, name, value, labelText, rules }) => (
											<div className='form-check mb-2' key={id}>
												<input
													className={`form-check-input ${errors[name] && "is-invalid"}`}
													type='radio'
													name={name}
													id={id}
													value={value}
													{...register(name, rules)}
													onClick={(e) => handleSelected(e)}
												/>
												{/* Radio 使用 Name 欄位 */}
												<label className='form-check-label' htmlFor={id}>
													{labelText}
												</label>
												{errors[name] && (
													<div className='invalid-feedback'>{errors[name]?.message}</div>
												)}
											</div>
										))}
									</div>
								</div>

								<div className='d-flex flex-column-reverse flex-md-row mt-4 justify-content-between align-items-md-center align-items-end w-100'>
									<button
										onClick={() => {
											navigate(-1);
										}}
										className='btn text-dark mt-md-0 mt-3'
									>
										<i className='fas fa-chevron-left me-2'></i>BACK
									</button>
									<button type='submit' className='btn btn-dark py-3 px-7 rounded-0'>
										GET PAYED
									</button>
								</div>
							</form>

							<div className='col-md-4'>
								<div className='border p-4 mb-5'>
									<h4 className='mb-4'>Order Detail</h4>
									{cartData?.carts?.map((item) => (
										<div className='d-flex mb-3' key={item.product.id}>
											<img
												src={item.product.imageUrl}
												alt={item.product.title}
												className='me-1'
												style={{ width: "48px", height: "48px", objectFit: "cover" }}
											/>
											<div className='w-100'>
												<div className='d-flex justify-content-between fw-bold'>
													<p className='mb-0'>{item.product.title}</p>
													<p className='mb-0'>x {item.qty}</p>
												</div>
												<div className='d-flex justify-content-between'>
													<p className='text-muted mb-0'>
														<small>NT$ {thousandFormat(item.product.price)}</small>
													</p>
													<p className='mb-0'>NT$ {thousandFormat(item.final_total)}</p>
												</div>
											</div>
										</div>
									))}
									<table className='table mt-4 border-top border-bottom text-muted'>
										<tbody>
											<tr>
												<th scope='row' className='border-0 px-0 pt-4 font-weight-normal'>
													Subtotal
												</th>
												<td className='text-end border-0 px-0 pt-4'>
													NT$ {thousandFormat(cartData?.total)}
												</td>
											</tr>
											<tr>
												<th scope='row' className='border-0 px-0 pt-0 pb-4 font-weight-normal'>
													Payment
												</th>
												<td className='text-end border-0 px-0 pt-0 pb-4'>{select}</td>
											</tr>
										</tbody>
									</table>
									<div className='d-flex justify-content-between mt-4'>
										<p className='mb-0 h4 fw-bold'>Total</p>
										<p className='mb-0 h4 fw-bold'>NT$ {thousandFormat(cartData?.final_total)}</p>
									</div>
								</div>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default Checkout;
