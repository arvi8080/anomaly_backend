export type Transaction = {
	date: string; // ISO
	amount: number; // positive income, negative expense
	merchant?: string;
	categoryId?: string;
	note?: string;
};

export type Category = {
	id: string;
	name: string;
};

export type Budget = {
	id: string;
	categoryId?: string; // undefined -> overall budget
	period: "monthly" | "weekly";
	amount: number;
};

export type Anomaly = {
	id: string;
	type: "spike" | "duplicate" | "merchant-change";
	transactionDate: string;
	amount: number;
	message: string;
};

