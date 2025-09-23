import { useState } from "react";
import { useVault } from "../state/VaultProvider";

export default function Dashboard() {
  const { isUnlocked, unlock, lock } = useVault();
  const [pw, setPw] = useState("");
  const [err, setErr] = useState<string | null>(null);

  return (
    <section>
      <h2>Dashboard</h2>
      {!isUnlocked ? (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setErr(null);
            try {
              await unlock(pw);
              setPw("");
            } catch (e) {
              setErr((e as Error).message);
            }
          }}
          style={{ display: "flex", gap: 8, alignItems: "center" }}
        >
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="Enter passphrase"
          />
          <button type="submit">Unlock</button>
          {err && <span style={{ color: "crimson" }}>{err}</span>}
        </form>
      ) : (
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <p style={{ margin: 0 }}>Vault is unlocked.</p>
          <button onClick={() => lock()}>Lock</button>
        </div>
      )}
      <p>Welcome to FinPal. Your data stays private and encrypted on your device.</p>
    </section>
  );
}

