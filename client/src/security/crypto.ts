export type DerivedKey = CryptoKey;

export async function generateRandomBytes(length: number): Promise<Uint8Array> {
	const bytes = new Uint8Array(length);
	crypto.getRandomValues(bytes);
	return bytes;
}

export function bytesToBase64(bytes: Uint8Array): string {
	return btoa(String.fromCharCode(...bytes));
}

export function base64ToBytes(b64: string): Uint8Array {
	const bin = atob(b64);
	const out = new Uint8Array(bin.length);
	for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
	return out;
}

export async function deriveKeyFromPassphrase(passphrase: string, salt: Uint8Array, iterations = 250_000): Promise<DerivedKey> {
	const enc = new TextEncoder();
	const baseKey = await crypto.subtle.importKey(
		"raw",
		enc.encode(passphrase),
		{ name: "PBKDF2" },
		false,
		["deriveKey"]
	);
	return crypto.subtle.deriveKey(
		{ name: "PBKDF2", salt, iterations, hash: "SHA-256" },
		baseKey,
		{ name: "AES-GCM", length: 256 },
		false,
		["encrypt", "decrypt"]
	);
}

export async function encryptJson(key: DerivedKey, data: unknown): Promise<{ ivB64: string; cipherB64: string }>
{
	const iv = await generateRandomBytes(12);
	const encoded = new TextEncoder().encode(JSON.stringify(data));
	const cipherBuffer = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoded);
	return { ivB64: bytesToBase64(iv), cipherB64: bytesToBase64(new Uint8Array(cipherBuffer)) };
}

export async function decryptJson<T>(key: DerivedKey, ivB64: string, cipherB64: string): Promise<T> {
	const iv = base64ToBytes(ivB64);
	const cipher = base64ToBytes(cipherB64);
	const plainBuffer = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, cipher);
	const json = new TextDecoder().decode(plainBuffer);
	return JSON.parse(json) as T;
}

