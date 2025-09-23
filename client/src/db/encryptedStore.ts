import { db, StoredItem } from "./db";
import { encryptJson, decryptJson } from "../security/crypto";
import { getKeyOrThrow } from "../security/vault";

export async function putEncrypted<T extends object>(kind: StoredItem["kind"], obj: T): Promise<number> {
	const key = getKeyOrThrow();
	const now = new Date().toISOString();
	const { ivB64, cipherB64 } = await encryptJson(key, obj);
	return db.items.add({ kind, ivB64, dataB64: cipherB64, createdAt: now, updatedAt: now });
}

export async function getAllDecrypted<T>(kind: StoredItem["kind"]): Promise<Array<T & { __id: number }>> {
	const key = getKeyOrThrow();
	const rows = await db.items.where({ kind }).toArray();
	const out: Array<T & { __id: number }> = [];
	for (const row of rows) {
		const value = await decryptJson<T>(key, row.ivB64, row.dataB64);
		out.push(Object.assign({ __id: row.id! }, value));
	}
	return out;
}

