import { base64ToBytes, bytesToBase64, deriveKeyFromPassphrase } from "./crypto";

const SALT_KEY = "finpal.v1.salt";
const ITER_KEY = "finpal.v1.iter";

let cachedKey: CryptoKey | null = null;

export function isUnlocked(): boolean {
	return cachedKey !== null;
}

export function getKeyOrThrow(): CryptoKey {
	if (!cachedKey) throw new Error("Vault is locked");
	return cachedKey;
}

export function lock(): void {
	cachedKey = null;
}

export async function unlock(passphrase: string): Promise<void> {
	let saltB64 = localStorage.getItem(SALT_KEY);
	let iterations = Number(localStorage.getItem(ITER_KEY) || "");
	if (!saltB64) {
		// First-time setup
		const salt = crypto.getRandomValues(new Uint8Array(16));
		saltB64 = bytesToBase64(salt);
		iterations = 250000;
		localStorage.setItem(SALT_KEY, saltB64);
		localStorage.setItem(ITER_KEY, String(iterations));
	}
	const salt = base64ToBytes(saltB64);
	cachedKey = await deriveKeyFromPassphrase(passphrase, salt, iterations || 250000);
}

