export const ModalInput = ({ item, handleChange, data }) => {
    const { id, labelText, type, name, placeholder} = item;
	return (
		<>
			<label className='w-100 form-label' htmlFor={id}>
				{labelText}
				<input
					className='form-control'
					type={type}
					id={id}
					name={name}
					placeholder={placeholder}
					value={data[id] || ""}
					onChange={handleChange}
                    
				/>
			</label>
		</>
	);
};

export const ModalSelect = ({id, name, handleChange, data}) => {
    return (
		<div className='form-check'>
			<label htmlFor={id} className='w-100 form-check-label'>
				<input
					className='form-check-input'
					type='checkbox'
					id={id}
					name={name}
					checked={!!data[id]}
					onChange={handleChange}
				/>
				是否啟用
			</label>
		</div>
	);
}

export const Input = ({ id, labelText, type, name, placeholder, value, onChange }) => {
	return (
		<>
			<label className='w-100 form-label' htmlFor={id}>
				{labelText}
				<input
					className='form-control'
					type={type}
					id={id}
					name={name}
					placeholder={placeholder}
					value={value || ""}
					onChange={onChange}
				/>
			</label>
		</>
	);
};

export const FormInput = ({ item, register, errors }) => {
	const { id, labelText, type, rules } = item;
	return (
		<div className='mb-3'>
			<label className='form-label mb-0' htmlFor={id}>
				{labelText}
				<input
					type={type}
					id={id}
					className={`form-control ${errors[id] && "is-invalid"}`}
					{...register(id, rules)}
				/>
				{errors[id] && <div className='invalid-feedback'>{errors[id]?.message}</div>}
			</label>
		</div>
	);
};

export const FormSelect = ({ item, register, errors, setPayment }) => {
	const { id, name, value, labelText, rules } = item;
	return (
		<div className='form-check mb-2'>
			{/* Radio 使用 Name 欄位 */}
			<label className='form-check-label' htmlFor={id}>
				<input
					className={`form-check-input ${errors[name] && "is-invalid"}`}
					type='radio'
					name={name}
					id={id}
					value={value}
					{...register(name, rules)}
					onClick={(e) => {
						setPayment(e.target.value);
					}}
				/>
				{labelText}
			</label>
			{errors[name] && <div className='invalid-feedback'>{errors[name]?.message}</div>}
		</div>
	);
};
