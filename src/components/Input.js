const Input = ({ labelText, type, id, name, placeholder, value, onChange }) => {
	return (
		<>
			<label className='w-100' htmlFor={id}>
				{labelText}
				<input
					type={type}
					id={id}
					name={name}
					placeholder={placeholder}
					className='form-control'
					value={value}
					onChange={onChange}
				/>
			</label>
		</>
	);
};

export default Input;