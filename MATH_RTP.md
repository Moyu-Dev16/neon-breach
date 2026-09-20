# NEON BREACH: CYBER-VAULT — Mathematical Model & Verified RTP Proof

**Author**: Moyu-Dev16  
**Target RTP**: **96.50%**  
**Contract**: [`contracts/NeonBreachGame.sol`](./contracts/NeonBreachGame.sol)  
**Specification**: Chain Casino SDK (`ICasinoGameV2.sol`)

---

## 1. Mathematical Design Philosophy

In traditional Web3 games, many implementations suffer from:
1. **Floating-point rounding errors**: Dividing decimals causes drift between contract state and player display.
2. **Modulo bias**: Naive `randomness % n` on small bytes introduces unequal distribution.
3. **Inconsistent RTP across modes**: Different risk profiles yielding fluctuating house edges.

In **NEON BREACH: CYBER-VAULT**, we design a unified discrete probability space using a canonical modulo base:
$$M = 12,000$$

All 4 intrusion modes utilize this exact denominator $M = 12,000$, ensuring **EXACTLY 96.50% Return to Player (RTP)** across every single mode with zero rounding discrepancy.

---

## 2. Rigorous RTP Derivation per Intrusion Vector

### Target House Edge & Return
- Target RTP: $R = 96.50\% = \frac{965}{1000} = \frac{193}{200}$
- House Edge: $H = 1 - R = 3.50\%$

---

### Mode 0: GHOST BYPASS (Stealth Intrusion)
- **Concept**: Low risk, conservative stealth exploit.
- **Multiplier**: $1.20\times = \frac{6}{5}$ ($12,000$ BPS)
- **Required Win Probability**:
  $$P(\text{Win}) = \frac{R}{\text{Multiplier}} = \frac{193/200}{6/5} = \frac{193}{200} \times \frac{5}{6} = \frac{193}{240}$$
- **Mapping to Modulo $12,000$**:
  $$\text{Win Threshold} = \frac{193}{240} \times 12,000 = 193 \times 50 = 9,650$$
- **On-chain Condition**: `roll < 9650` where `roll = uint256(randomness) % 12000`.
- **Exact RTP Verification**:
  $$\mathbb{E}[\text{Payout}] = P(\text{Win}) \times \text{Multiplier} = \frac{9,650}{12,000} \times 1.20 = \frac{193}{240} \times \frac{6}{5} = \frac{1,158}{1,200} = 0.965000 = 96.50\%$$

---

### Mode 1: OVERCLOCK SURGE (Balanced Intrusion)
- **Concept**: Moderate risk, overclocking network relays for doubled payout.
- **Multiplier**: $2.00\times = 2$ ($20,000$ BPS)
- **Required Win Probability**:
  $$P(\text{Win}) = \frac{R}{\text{Multiplier}} = \frac{193/200}{2} = \frac{193}{400} = 48.25\%$$
- **Mapping to Modulo $12,000$**:
  $$\text{Win Threshold} = \frac{193}{400} \times 12,000 = 193 \times 30 = 5,790$$
- **On-chain Condition**: `roll < 5790` where `roll = uint256(randomness) % 12000`.
- **Exact RTP Verification**:
  $$\mathbb{E}[\text{Payout}] = P(\text{Win}) \times \text{Multiplier} = \frac{5,790}{12,000} \times 2.00 = \frac{193}{400} \times 2 = \frac{193}{200} = 0.965000 = 96.50\%$$

---

### Mode 2: QUANTUM DRILL (High Risk Intrusion)
- **Concept**: Aggressive tunneling through layered megacorp ICE firewalls.
- **Multiplier**: $5.00\times = 5$ ($50,000$ BPS)
- **Required Win Probability**:
  $$P(\text{Win}) = \frac{R}{\text{Multiplier}} = \frac{193/200}{5} = \frac{193}{1,000} = 19.30\%$$
- **Mapping to Modulo $12,000$**:
  $$\text{Win Threshold} = \frac{193}{1,000} \times 12,000 = 193 \times 12 = 2,316$$
- **On-chain Condition**: `roll < 2316` where `roll = uint256(randomness) % 12000`.
- **Exact RTP Verification**:
  $$\mathbb{E}[\text{Payout}] = P(\text{Win}) \times \text{Multiplier} = \frac{2,316}{12,000} \times 5.00 = \frac{193}{1,000} \times 5 = \frac{965}{1,000} = 0.965000 = 96.50\%$$

---

### Mode 3: ZERO-DAY EXPLODE (Critical Jackpot)
- **Concept**: Unleashing a zero-day exploit targeting the central vault core.
- **Multiplier**: $20.00\times = 20$ ($200,000$ BPS)
- **Required Win Probability**:
  $$P(\text{Win}) = \frac{R}{\text{Multiplier}} = \frac{193/200}{20} = \frac{193}{4,000} = 4.825\%$$
- **Mapping to Modulo $12,000$**:
  $$\text{Win Threshold} = \frac{193}{4,000} \times 12,000 = 193 \times 3 = 579$$
- **On-chain Condition**: `roll < 579` where `roll = uint256(randomness) % 12000`.
- **Exact RTP Verification**:
  $$\mathbb{E}[\text{Payout}] = P(\text{Win}) \times \text{Multiplier} = \frac{579}{12,000} \times 20.00 = \frac{193}{4,000} \times 20 = \frac{193}{200} = 0.965000 = 96.50\%$$

---

## 3. Summary Paytable Matrix

| Mode ID | Name | Win Probability ($P$) | Multiplier | Win Condition (`roll < T`) | Exact Theoretical RTP | House Edge |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **0** | **GHOST BYPASS** | $80.4167\%$ ($193/240$) | **$1.20\times$** | `roll < 9650` | **96.5000%** | 3.50% |
| **1** | **OVERCLOCK SURGE** | $48.2500\%$ ($193/400$) | **$2.00\times$** | `roll < 5790` | **96.5000%** | 3.50% |
| **2** | **QUANTUM DRILL** | $19.3000\%$ ($193/1000$) | **$5.00\times$** | `roll < 2316` | **96.5000%** | 3.50% |
| **3** | **ZERO-DAY EXPLODE** | $4.8250\%$ ($193/4000$) | **$20.00\times$** | `roll < 579` | **96.5000%** | 3.50% |

---

## 4. Randomness Uniformity & Modulo Bias Analysis

The random seed is delivered on-chain via Chain's Decentralized VRF as a 256-bit unsigned integer ($2^{256}$).

When reducing $2^{256}$ modulo $M = 12,000$:
$$2^{256} \approx 1.15792 \times 10^{77}$$
The remainder of $2^{256} \pmod{12000} = 16$.
Only the first 16 outcomes out of 12,000 have one extra possible seed out of $\sim 9.649 \times 10^{73}$ seeds.
The deviation from perfect uniformity is:
$$\epsilon = \frac{1}{2^{256} / 12000} \approx 1.036 \times 10^{-74}$$
This makes modulo bias mathematically undetectable by any computational or statistical measure over trillions of games.
