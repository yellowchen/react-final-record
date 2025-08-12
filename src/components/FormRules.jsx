
export const ProductModalFirstInputRules = [
	{
		id: "category",
		labelText: "分類",
		type: "text",
		name: "category",
		placeholder: "請輸入分類",
	},
	{
		id: "unit",
		labelText: "單位",
		type: "unit",
		name: "unit",
		placeholder: "請輸入單位",
	},
	{
		id: "origin_price",
		labelText: "原價",
		type: "number",
		name: "origin_price",
		placeholder: "請輸入原價",
	},
	{
		id: "price",
		labelText: "售價",
		type: "number",
		name: "price",
		placeholder: "請輸入售價",
	},
];

export const ProductModalSecondInputRules = [
	{
		id: "description",
		labelText: "產品描述",
		type: "text",
		name: "description",
		placeholder: "請輸入產品描述",
	},
	{
		id: "content",
		labelText: "說明內容",
		type: "text",
		name: "content",
		placeholder: "請輸入說明內容",
	},
];

export const CouponModalInputRules = [
	{
		id: "percent",
		labelText: "折扣(%)",
		type: "text",
		name: "percent",
		placeholder: "請輸入折扣(%)",
	},
	{
		id: "code",
		labelText: "優惠碼",
		type: "text",
		name: "code",
		placeholder: "請輸入優惠碼",
	},
];


export const ArticleModalRules = [
	{
		id: "author",
		labelText: "作者",
		type: "text",
		name: "author",
		placeholder: "請輸入作者",
	},
	{
		id: "title",
		labelText: "標題",
		type: "text",
		name: "title",
		placeholder: "請輸入標題",
	},
];

export const InputRules = [
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

export const CheckRules = [
	{
		id: "payRadios1",
		name: "payRadio",
		value: "WebATM",
		labelText: "WebATM",
		rules: {
			required: true,
		},
	},
	{
		id: "payRadios2",
		name: "payRadio",
		value: "ATM",
		labelText: "ATM",
		rules: {
			required: true,
		},
	},
	{
		id: "payRadios3",
		name: "payRadio",
		value: "ApplePay",
		labelText: "ApplePay",
		rules: {
			required: true,
		},
	},
];

