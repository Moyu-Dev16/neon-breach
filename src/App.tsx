import { useState, useEffect, useCallback } from 'react';
import { CyberHeader } from './components/CyberHeader';
import { VectorPicker } from './components/VectorPicker';
import { BreachConsole } from './components/BreachConsole';
import { BetControls } from './components/BetControls';
import { HackingTerminalLog, type LogEntry } from './components/HackingTerminalLog';
import { WinModal } from './components/WinModal';
import { LootCodexModal, INITIAL_LOOT_ITEMS } from './components/LootCodexModal';
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
const LOOT_STORAGE_KEY = 'neon_breach_unlocked_loot_v2';

export function App() {
  const { hostApi, snapshot, isStandalone } = useCasinoHost();

  // Audio & Speed settings
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [ambientEnabled, setAmbientEnabled] = useState(false);
  const [fastMode, setFastMode] = useState(false);

  // Game configuration
  const [selectedMode, setSelectedMode] = useState<IntrusionMode>(1); // Default: OVERCLOCK SURGE
  const [wager, setWager] = useState<number>(10.0);

  // Heat & Streak state
  const [streak, setStreak] = useState<number>(0);
  const [heatLevel, setHeatLevel] = useState<number>(1);
  const [totalPlundered, setTotalPlundered] = useState<number>(0);

  // Loot Codex state
  const [codexOpen, setCodexOpen] = useState<boolean>(false);
  const [unlockedLootIds, setUnlockedLootIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(LOOT_STORAGE_KEY);
      return saved ? JSON.parse(saved) : ['loot-1'];
    } catch {
      return ['loot-1'];
    }
  });

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
      text: 'NEON BREACH Arcade Deck v2.0 Initialized.',
    },
    {
      id: 'init-2',
      time: new Date().toLocaleTimeString(),
      type: 'info',
      text: 'Verified 96.5000% Theoretical RTP across 4 Intrusion Vectors.',
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

  // Save unlocked loot
  useEffect(() => {
    try {
      localStorage.setItem(LOOT_STORAGE_KEY, JSON.stringify(unlockedLootIds));
    } catch {}
  }, [unlockedLootIds]);

  // Sync demo balance to storage
  useEffect(() => {
    try {
      localStorage.setItem(DEMO_BALANCE_KEY, demoBalance.toString());
    } catch {}
  }, [demoBalance]);

  // Unlock relic helper
  const tryUnlockLoot = useCallback((lootId: string, logMsg: string) => {
    setUnlockedLootIds((prev) => {
      if (prev.includes(lootId)) return prev;
      soundFx.playLootFound();
      addLog('success', `🏆 [RELIC DISCOVERED] ${logMsg}`);
      return [...prev, lootId];
    });
  }, [addLog]);

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

      const delayMs = fastMode ? 180 : 1400;
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

          // Update Streak & Heat
          const nextStreak = streak + 1;
          setStreak(nextStreak);
          const nextHeat = Math.min(4, Math.floor(nextStreak / 2) + 1);
          setHeatLevel(nextHeat);

          const nextTotal = totalPlundered + winAmount;
          setTotalPlundered(nextTotal);

          addLog(
            'success',
            `[BREACH CONFIRMED] Roll: ${res.roll} < ${res.threshold}. Payout: +${winAmount.toFixed(2)} ${symbol} (${res.multiplier.toFixed(2)}x) • STREAK: ${nextStreak}!`
          );
          soundFx.playSuccess(res.multiplier);
          if (!fastMode) setWinModalVisible(true);

          // Check Loot Unlocks
          if (selectedMode === 0) tryUnlockLoot('loot-1', 'Ghost Rootkit v1.2 retrieved!');
          if (selectedMode === 1) tryUnlockLoot('loot-2', 'Cryo-Frequency Injector retrieved!');
          if (selectedMode === 2) tryUnlockLoot('loot-3', 'Quantum Phase Drill extracted!');
          if (selectedMode === 3) tryUnlockLoot('loot-4', 'ZERO-DAY KERNEL 0xFE ACQUIRED (20x JACKPOT)!');
          if (nextStreak >= 3) tryUnlockLoot('loot-5', 'Triple-Threat Cipher Key unlocked (3 Streak)!');
          if (nextStreak >= 5) tryUnlockLoot('loot-6', 'Neuro-Link Datapad unlocked (5 Streak)!');
          if (nextHeat >= 4) tryUnlockLoot('loot-7', 'DEFCON-1 Override Dongle unlocked!');
          if (nextTotal >= 500) tryUnlockLoot('loot-8', 'Genesis Vault Token unlocked (>500 Plunder)!');
        } else {
          setPayoutAmount('0.00');
          setStreak(0);
          setHeatLevel(1);
          addLog(
            'danger',
            `[ICE LOCKDOWN] Roll: ${res.roll} >= ${res.threshold}. Intrusion neutralized by security ICE.`
          );
          soundFx.playAlarm();
        }
      }, delayMs);
      return;
    }

    // Host Mode Execution via Penpal
    try {
      addLog('info', 'Routing transaction to Chain Host Smart Vault...');
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
    <div className="min-h-screen bg-[#05070c] text-[#d6e2fb] flex flex-col justify-between selection:bg-cyan-500 selection:text-black">
      {/* Top Header */}
      <CyberHeader
        balanceFormatted={activeBalance.toFixed(2)}
        symbol={symbol}
        isStandalone={isStandalone}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        ambientEnabled={ambientEnabled}
        setAmbientEnabled={setAmbientEnabled}
        fastMode={fastMode}
        setFastMode={setFastMode}
        onOpenCodex={() => setCodexOpen(true)}
        unlockedLootCount={unlockedLootIds.length}
        totalLootCount={INITIAL_LOOT_ITEMS.length}
        streak={streak}
      />

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto w-full px-4 py-6 sm:py-8 space-y-6">
        {/* Banner for standalone mode */}
        {isStandalone && (
          <div className="rounded-2xl border-2 border-amber-500/30 bg-amber-950/20 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-amber-300 shadow-[0_4px_20px_rgba(245,158,11,0.08)]">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">🎮</span>
              <span>
                <strong>ARCADE SANDBOX ACTIVE:</strong> Live local &amp; web standalone deck with 1,000 DEMO chUSD credits.
                When embedded on Chain.wtf, host bridge automatically synchronizes on-chain Base L2 wallets &amp; VRF.
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setDemoBalance(DEFAULT_DEMO_BALANCE);
                addLog('info', 'Demo credits recharged to 1,000.00 DEMO-chUSD.');
                soundFx.playClick(800);
              }}
              className="px-3 py-1.5 rounded-xl bg-amber-900/60 hover:bg-amber-800/80 active:translate-y-0.5 text-amber-200 border border-amber-500/40 cursor-pointer shrink-0 font-bold transition-all"
            >
              🔄 RECHARGE 1,000 CREDITS
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
          heatLevel={heatLevel}
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

      {/* Darknet Loot Codex Modal */}
      <LootCodexModal
        isOpen={codexOpen}
        onClose={() => setCodexOpen(false)}
        unlockedIds={unlockedLootIds}
      />

      {/* Cyberpunk Footer */}
      <footer className="border-t border-cyan-500/15 bg-[#04060a] py-6 px-4 text-center text-xs font-mono text-white/40">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            Crafted for <strong className="text-cyan-400 font-bold">Chain Jam Vol. 1</strong> by{' '}
            <strong className="text-white/80 font-bold">Moyu-Dev16</strong> • Built on Base L2
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
              Chain Jam Gallery
            </a>
            <span>•</span>
            <span className="text-emerald-400 font-bold">RTP 96.5000% Math Verified</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
