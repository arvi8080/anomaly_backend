/// <reference lib="webworker" />

export type TransactionInput = {
	date: string;
	amount: number;
	merchant?: string;
	categoryId?: string;
};

export type DetectionMessage = { type: "detect"; transactions: TransactionInput[] };
export type DetectionResult = { type: "result"; anomalies: Array<{ index: number; reason: string }> };

function detectAnomalies(transactions: TransactionInput[]): Array<{ index: number; reason: string }>{
	const anomalies: Array<{ index: number; reason: string }> = [];
	if (transactions.length === 0) return anomalies;

	// Z-score spikes by absolute amount
	const amounts = transactions.map((t) => Math.abs(t.amount));
	const mean = amounts.reduce((a, b) => a + b, 0) / amounts.length;
	const variance = amounts.reduce((a, b) => a + (b - mean) ** 2, 0) / amounts.length;
	const std = Math.sqrt(variance) || 1;
	amounts.forEach((amt, idx) => {
		const z = (amt - mean) / std;
		if (z > 3) anomalies.push({ index: idx, reason: `Spike z=${z.toFixed(2)}` });
	});

	// Potential duplicates (same amount & date & merchant)
	const seen = new Map<string, number>();
	transactions.forEach((t, idx) => {
		const key = `${t.date}|${t.merchant || ""}|${t.amount}`;
		if (seen.has(key)) anomalies.push({ index: idx, reason: `Possible duplicate of #${seen.get(key)}` });
		else seen.set(key, idx);
	});

	// Merchant anomalies: large amount change vs merchant median
	const byMerchant = new Map<string, number[]>();
	transactions.forEach((t) => {
		const m = t.merchant || "?";
		const list = byMerchant.get(m) || [];
		list.push(Math.abs(t.amount));
		byMerchant.set(m, list);
	});
	const merchantMedian = new Map<string, number>();
	byMerchant.forEach((list, m) => {
		const sorted = list.slice().sort((a, b) => a - b);
		const mid = Math.floor(sorted.length / 2);
		const median = sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
		merchantMedian.set(m, median);
	});
	transactions.forEach((t, idx) => {
		const median = merchantMedian.get(t.merchant || "?") || 0;
		const amt = Math.abs(t.amount);
		if (median > 0 && amt > 4 * median) {
			anomalies.push({ index: idx, reason: `Unusual vs merchant median x${(amt / median).toFixed(1)}` });
		}
	});

	return anomalies;
}

self.onmessage = (ev: MessageEvent<DetectionMessage>) => {
	if (ev.data?.type !== "detect") return;
	const anomalies = detectAnomalies(ev.data.transactions);
	const msg: DetectionResult = { type: "result", anomalies };
	self.postMessage(msg);
};

