import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react";
import { isUnlocked as vaultIsUnlocked, unlock as vaultUnlock, lock as vaultLock } from "../security/vault";

type VaultContextValue = {
	isUnlocked: boolean;
	unlock: (passphrase: string) => Promise<void>;
	lock: () => void;
};

const VaultContext = createContext<VaultContextValue | undefined>(undefined);

export function VaultProvider({ children }: { children: ReactNode }) {
	const [unlocked, setUnlocked] = useState<boolean>(vaultIsUnlocked());

	const unlock = useCallback(async (passphrase: string) => {
		await vaultUnlock(passphrase);
		setUnlocked(true);
	}, []);

	const lock = useCallback(() => {
		vaultLock();
		setUnlocked(false);
	}, []);

	const value = useMemo(() => ({ isUnlocked: unlocked, unlock, lock }), [unlocked, unlock, lock]);

	return <VaultContext.Provider value={value}>{children}</VaultContext.Provider>;
}

export function useVault() {
	const ctx = useContext(VaultContext);
	if (!ctx) throw new Error("useVault must be used within VaultProvider");
	return ctx;
}

