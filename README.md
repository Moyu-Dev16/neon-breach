# NEON BREACH: CYBER-VAULT ⚡

[![Chain Jam Vol. 1](https://img.shields.io/badge/Chain_Jam-Vol._1-06b6d4?style=for-the-badge&logo=target)](https://jam.chain.wtf)
[![Theoretical RTP](https://img.shields.io/badge/Verified_RTP-96.50%25-10b981?style=for-the-badge&logo=shield)](./MATH_RTP.md)
[![Solidity Version](https://img.shields.io/badge/Solidity-0.8.30-6366f1?style=for-the-badge&logo=solidity)](./contracts/NeonBreachGame.sol)
[![Live Demo](https://img.shields.io/badge/Live_Demo-Play_Now-f59e0b?style=for-the-badge&logo=google-chrome)](https://moyu-dev16.github.io/neon-breach/)

> **NEON BREACH: CYBER-VAULT** is an original cyberpunk on-chain casino intrusion game built for **Chain Jam Vol. 1** on DoraHacks.
> Players breach a megacorp ICE vault across 4 distinct security vectors, powered by Chain's decentralized VRF and a rigorously verified **96.50% theoretical RTP** across all modes.

---

## 🎮 Playable Game Modes & Intrusion Vectors

| Vector Code | Vector Name | Risk Tier | Multiplier | Win Probability | Win Condition (`roll < T`) | Exact RTP |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `VEC-00` | **GHOST BYPASS** | `STEALTH` | **1.20x** | **80.4167%** ($193/240$) | `roll < 9650` | **96.50%** |
| `VEC-01` | **OVERCLOCK SURGE** | `BALANCED` | **2.00x** | **48.2500%** ($193/400$) | `roll < 5790` | **96.50%** |
| `VEC-02` | **QUANTUM DRILL** | `HIGH` | **5.00x** | **19.3000%** ($193/1000$) | `roll < 2316` | **96.50%** |
| `VEC-03` | **ZERO-DAY EXPLODE** | `CRITICAL` | **20.00x** | **4.8250%** ($193/4000$) | `roll < 579` | **96.50%** |

*(Modulo Base $M = 12,000$. Modulo bias deviation is $< 10^{-73}$. See [`MATH_RTP.md`](./MATH_RTP.md) for the complete derivation.)*

---

## 🚀 Key Features

1. **Original Cyberpunk Hacking Mechanic**:
   - Replaces classic dice, crash, and plinko clones with an immersive ICE terminal breach gameplay loop.
   - Interactive holographic ICE matrix, live scanline animations, and real-time hacking terminal logs.
2. **Dual-Mode Architecture (Host Bridge + Standalone Sandbox)**:
   - **Host Bridge Mode**: Seamlessly integrates with `@chain/casino-sdk/guest` when embedded in the `chain.wtf` parent iframe, automatically consuming user Smart Vault balances, on-chain sessions, and decentralized VRF.
   - **Standalone Demo Mode**: When opened directly by hackathon judges and external visitors at `https://moyu-dev16.github.io/neon-breach/`, smoothly falls back to an interactive local demo sandbox pre-funded with 1,000 DEMO chUSD credits!
3. **Pure Web Audio API Synthesizer**:
   - Built-in audio engine creating 8-bit laser clicks, terminal chirps, intrusion alarms, and synthwave chord progressions directly through JavaScript oscillator nodes. Zero external audio asset dependencies.
4. **Verified Compliance**:
   - Implements `ICasinoGameV2.sol` (`quoteCaps`, `quoteRiskParams`, `onSessionStart`, `onRandomness`, `quoteForfeitPayout`).
   - Compliant `game.manifest.json` served at origin.
   - Embeds `<script async src="https://jam.chain.wtf/widget.js"></script>` for official tracking.

---

## 🛠️ Project Structure

```
neon-breach/
├── contracts/
│   ├── ICasinoGameV2.sol         # Canonical Chain casino game interface
│   └── NeonBreachGame.sol        # On-chain game logic with 96.50% RTP math
├── public/
│   └── game.manifest.json        # Official SDK manifest
├── src/
│   ├── components/
│   │   ├── BetControls.tsx       # Stake inputs, presets, breach trigger
│   │   ├── BreachConsole.tsx     # Holographic terminal & matrix scanline
│   │   ├── CyberHeader.tsx       # Status, balance, SFX & fast mode toggles
│   │   ├── HackingTerminalLog.tsx# Real-time RPC and session stream
│   │   ├── VectorPicker.tsx      # Vector selection cards with risk tiers
│   │   └── WinModal.tsx          # Victory celebration overlay
│   ├── lib/
│   │   ├── audio.ts              # Web Audio API retro synthesizer
│   │   ├── math.ts               # Discrete probability & RTP functions
│   │   ├── math.test.ts          # Unit tests for 96.50% RTP verification
│   │   └── useCasinoHost.ts      # Dual-mode host bridge & demo sandbox hook
│   ├── sdk/                      # @chain/casino-sdk guest bridge & types
│   ├── App.tsx                   # Main game application
│   ├── index.css                 # Cyberpunk styling & scanlines
│   └── main.tsx
├── index.html                    # HTML entry with official Chain Jam widget
├── MATH_RTP.md                   # Formal mathematical RTP proof
├── package.json
└── vite.config.ts
```

---

## 🧪 Testing & Verification

Run mathematical and state transition unit tests:
```bash
npm test
```

Build production static assets:
```bash
npm run build
```

---

## 📜 License
MIT © 2026 Moyu-Dev16. Built for Chain Jam Vol. 1.
