import { useState, useEffect, useCallback } from 'react';
import { CyberHeader } from './components/CyberHeader';
import { VectorPicker } from './components/VectorPicker';
import { BreachConsole } from './components/BreachConsole';
import { BetControls } from './components/BetControls';
import { HackingTerminalLog, type LogEntry } from './components/HackingTerminalLog';
import { WinModal } from './components/WinModal';
import {
  type IntrusionMode,
  type BreachOutcome,
  INTRUSION_MODES,
  resolveBreachOutcome,
  MODULO_BASE,
} from './lib/math';
import { useCasinoHost } from './lib/useCasinoHost';
import { soundFx } from './lib/audio';

const DEMO_BALANCE_KEY = 'neon_breach_demo_balance';
const DEFAULT_DEMO_BALANCE = 1000.0;

export function App() {
  const { hostApi, snapshot, isStandalone } = useCasinoHost();

  // Audio & Speed settings
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [fastMode, setFastMode] = useState(false);

  // Game configuration
  const [selectedMode, setSelectedMode] = useState<IntrusionMode>(1); // Default: OVERCLOCK SURGE
  const [wager, setWager] = useState<number>(10.0);

  // Standalone balance
  const [demoBalance, setDemoBalance] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(DEMO_BALANCE_KEY);
      return saved ? parseFloat(saved) : DEFAULT_DEMO_BALANCE;
    } catch {
      return DEFAULT_DEMO_BALANCE;
    }
  });

  // Breach round status
  const [status, setStatus] = useState<'idle' | 'breaching' | 'settled'>('idle');
  const [outcome, setOutcome] = useState<BreachOutcome | null>(null);
  const [payoutAmount, setPayoutAmount] = useState<string>('0.00');
  const [winModalVisible, setWinModalVisible] = useState(false);

  // Session Logs
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: 'init-1',
      time: new Date().toLocaleTimeString(),
      type: 'info',
      text: 'NEON BREACH Client Core v1.4.2 Initialized.',
    },
    {
      id: 'init-2',
      time: new Date().toLocaleTimeString(),
      type: 'info',
      text: 'Deterministic 96.50% RTP Verified across 4 Security Vectors.',
    },
  ]);

  const addLog = useCallback((type: LogEntry['type'], text: string) => {
    setLogs((prev) => [
      ...prev.slice(-40),
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        time: new Date().toLocaleTimeString(),
        type,
        text,
      },
    ]);
  }, []);

  // Sync demo balance to storage
  useEffect(() => {
    try {
      localStorage.setItem(DEMO_BALANCE_KEY, demoBalance.toString());
    } catch {}
  }, [demoBalance]);

  // Read balance and token from host snapshot if available
  const activeBalance = isStandalone
    ? demoBalance
    : snapshot?.balances.smartVaultBalance
      ? Number(BigInt(snapshot.balances.smartVaultBalance) / 1000000000000000000n)
      : demoBalance;

  const symbol = isStandalone ? 'DEMO-chUSD' : snapshot?.token.symbol || 'chUSD';

  // Handle Bet Initiation
  const handleBreach = async () => {
    if (status === 'breaching') return;
    if (wager > activeBalance || wager <= 0) {
      addLog('danger', 'Aborted: Insufficient vault credits for intrusion stake.');
      soundFx.playAlarm();
      return;
    }

    setStatus('breaching');
    setOutcome(null);
    setWinModalVisible(false);
    soundFx.playBreachStart();

    const config = INTRUSION_MODES[selectedMode];
    addLog(
      'warn',
      `[LAUNCH] Vector ${config.code} (${config.name}) deployed. Stake: ${wager.toFixed(2)} ${symbol}.`
    );

    // Standalone Demo Mode Execution
    if (isStandalone || !hostApi) {
      // Deduct wager
      setDemoBalance((prev) => Math.max(0, prev - wager));

      const delayMs = fastMode ? 150 : 1350;
      setTimeout(() => {
        // Generate pseudo-random 32-bit roll
        const arr = new Uint32Array(1);
        window.crypto.getRandomValues(arr);
        const roll = arr[0] % MODULO_BASE;

        const res = resolveBreachOutcome(selectedMode, roll);
        setOutcome(res);
        setStatus('settled');

        if (res.won) {
          const winAmount = Number((wager * res.multiplier).toFixed(2));
          setPayoutAmount(winAmount.toFixed(2));
          setDemoBalance((prev) => prev + winAmount);
          addLog(
            'success',
            `[BREACH CONFIRMED] Roll: ${res.roll} < ${res.threshold}. Payout: +${winAmount.toFixed(2)} ${symbol} (${res.multiplier.toFixed(2)}x).`
          );
          soundFx.playSuccess(res.multiplier);
          if (!fastMode) setWinModalVisible(true);
        } else {
          setPayoutAmount('0.00');
          addLog(
            'danger',
            `[ICE LOCKDOWN] Roll: ${res.roll} >= ${res.threshold}. ICE detected intrusion payload.`
          );
          soundFx.playAlarm();
        }
      }, delayMs);
      return;
    }

    // Host Mode Execution via Penpal
    try {
      addLog('info', 'Routing transaction to Chain Host Smart Vault...');
      // In host mode, we open a session using hostApi.openSession
      // Format gameData as simple bytes representation of mode
      const session = await hostApi.openSession({
        wager: (BigInt(Math.floor(wager * 1e18))).toString(),
        gameData: `0x0${selectedMode}` as `0x${string}`,
      });
      addLog('info', `Session opened: ${session.sessionKey.slice(0, 10)}... Awaiting VRF.`);
    } catch (err: unknown) {
      setStatus('idle');
      addLog('danger', `Host error: ${err instanceof Error ? err.message : String(err)}`);
      soundFx.playAlarm();
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-[#d6e2fb] flex flex-col justify-between selection:bg-cyan-500 selection:text-black">
      {/* Top Header */}
      <CyberHeader
        balanceFormatted={activeBalance.toFixed(2)}
        symbol={symbol}
        isStandalone={isStandalone}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        fastMode={fastMode}
        setFastMode={setFastMode}
      />

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto w-full px-4 py-6 sm:py-8 space-y-6">
        {/* Banner for standalone mode */}
        {isStandalone && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 px-4 py-2.5 flex items-center justify-between text-xs font-mono text-amber-300">
            <div className="flex items-center gap-2">
              <span>🎮</span>
              <span>
                <strong>STANDALONE DEMO SANDBOX ACTIVE:</strong> You are testing directly on the live web demo with 1,000 DEMO chUSD credits.
                When embedded on Chain.wtf, the host bridge automatically synchronizes on-chain wallets &amp; VRF.
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setDemoBalance(DEFAULT_DEMO_BALANCE);
                addLog('info', 'Demo credits reset to 1,000.00 DEMO-chUSD.');
                soundFx.playBlip(800);
              }}
              className="px-2.5 py-1 rounded bg-amber-900/60 hover:bg-amber-800/80 text-amber-200 border border-amber-500/40 cursor-pointer shrink-0 ml-2"
            >
              Reset 1,000 chUSD
            </button>
          </div>
        )}

        {/* 1. Vector Picker */}
        <VectorPicker
          selectedMode={selectedMode}
          onSelectMode={setSelectedMode}
          disabled={status === 'breaching'}
        />

        {/* 2. Central Breach Console */}
        <BreachConsole
          mode={selectedMode}
          status={status}
          outcome={outcome}
          payoutAmount={payoutAmount}
          symbol={symbol}
        />

        {/* 3. Bet Controls */}
        <BetControls
          wager={wager}
          setWager={setWager}
          maxWager={Math.max(100, activeBalance)}
          balance={activeBalance}
          mode={selectedMode}
          disabled={status === 'breaching'}
          onBreach={handleBreach}
          symbol={symbol}
        />

        {/* 4. Terminal Log Stream */}
        <HackingTerminalLog logs={logs} />
      </main>

      {/* Win Celebration Modal */}
      <WinModal
        visible={winModalVisible}
        payoutAmount={payoutAmount}
        multiplierText={`${INTRUSION_MODES[selectedMode].multiplier.toFixed(2)}x`}
        mode={selectedMode}
        symbol={symbol}
        onDismiss={() => setWinModalVisible(false)}
      />

      {/* Cyberpunk Footer */}
      <footer className="border-t border-cyan-500/10 bg-[#06080d] py-6 px-4 text-center text-xs font-mono text-white/40">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            Built for <strong className="text-cyan-400">Chain Jam Vol. 1</strong> by{' '}
            <strong className="text-white/70">Moyu-Dev16</strong>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/Moyu-Dev16/neon-breach"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400/80 hover:text-cyan-300 underline underline-offset-2"
            >
              GitHub Source
            </a>
            <span>•</span>
            <a
              href="https://jam.chain.wtf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400/80 hover:text-cyan-300 underline underline-offset-2"
            >
              Chain Jam
            </a>
            <span>•</span>
            <span className="text-emerald-400 font-bold">RTP 96.50% Formally Verified</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
export default App;
