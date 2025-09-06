import axios from "axios";
import keys from "../config/keys.js";

/**
 * Interface for the AI/ML anomaly microservice:
 * POST { transaction: {...} } -> { confidence: 0.0-1.0, reasons: [...] }
 * POST { transactions: [...] } -> { alerts: [{ transactionId: '...', confidence: 0.0-1.0, reasons: [...] }] }
 */

const anomalyService = {
    // Flag a single transaction
    async flagIfAnomalous(transaction) {
        try {
            // Send the single transaction to the AI/ML service
            const resp = await axios.post(keys.anomalyServiceUrl, { transaction }, { timeout: 4000 });
            const { confidence, reasons = [] } = resp.data;
            
            // Convert confidence score to a boolean flag for simple checks
            const isAnomalous = confidence > 0.7; // Example threshold
            
            return { anomalous: isAnomalous, reasons, confidence };
        } catch (err) {
            console.warn("AI/ML Anomaly detection unavailable. Falling back to simple rules.", err.message);
            
            // Fallback to your existing simple rule-based logic
            const amount = Math.abs(transaction.amount || 0);
            if (transaction.type === "expense" && amount > 1000000) {
                return { anomalous: true, reasons: ["High value transaction (fallback)"], confidence: 0.9 };
            }
            return { anomalous: false, reasons: [], confidence: 0.0 };
        }
    },

    // Check a batch of transactions
    async checkBatch(transactions) {
        try {
            // Send the entire batch to the AI/ML service
            const resp = await axios.post(`${keys.anomalyServiceUrl}/batch`, { transactions }, { timeout: 8000 });
            
            // The AI/ML service returns an array of alerts with confidence scores
            return resp.data.alerts || [];
        } catch (err) {
            console.warn("AI/ML Batch detection unavailable. Falling back to simple statistical check.", err.message);
            
            // Fallback to your existing statistical method
            const grouped = {};
            transactions.forEach(tx => {
                if (!grouped[tx.category]) grouped[tx.category] = [];
                grouped[tx.category].push(tx.amount);
            });

            const alerts = [];
            transactions.forEach(tx => {
                const arr = grouped[tx.category] || [tx.amount];
                const avg = arr.reduce((a,b) => a+b, 0) / arr.length;
                if (tx.type === "expense" && tx.amount > 3 * avg) {
                    alerts.push({ 
                        id: tx._id, 
                        message: `Unusual ${tx.category} expense`, 
                        confidence: 0.75, // Assign a fixed confidence score to the fallback alert
                        reasons: [`Unusual amount (${tx.amount}) compared to average (${avg.toFixed(2)})`]
                    });
                }
            });
            return alerts;
        }
    }
};

export default anomalyService;