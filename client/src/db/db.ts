import Dexie, { Table } from "dexie";

export type StoredItem = {
	id?: number;
	kind: "transaction" | "category" | "budget" | "alert";
	ivB64: string;
	dataB64: string;
	createdAt: string;
	updatedAt: string;
};

export class FinpalDB extends Dexie {
	items!: Table<StoredItem, number>;

	constructor() {
		super("finpal-db");
		this.version(1).stores({
			items: "++id, kind, createdAt"
		});
	}
}

export const db = new FinpalDB();

