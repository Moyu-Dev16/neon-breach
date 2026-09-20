// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "./ICasinoGameV2.sol";

/**
 * @title NeonBreachGame
 * @author Moyu-Dev16
 * @notice Original Cyberpunk Casino Intrusion Game for Chain Jam Vol. 1.
 *         Players breach a megacorp ICE vault via 4 distinct Intrusion Vectors.
 *         Every mode strictly guarantees a verified theoretical RTP of 96.50%.
 */
contract NeonBreachGame is ICasinoGameV2 {
  error NeonBreach__InvalidWager();
  error NeonBreach__InvalidMode();
  error NeonBreach__NoPlayerAction();

  uint256 public constant MODULO_BASE = 12000;
  uint256 public constant TARGET_RTP_BPS = 9650; // 96.50%

  struct GameBet {
    uint8 mode; // 0: GHOST_BYPASS, 1: OVERCLOCK_SURGE, 2: QUANTUM_DRILL, 3: ZERO_DAY_EXPLODE
  }

  struct GameOutcome {
    bool won;
    uint8 mode;
    uint256 payout;
    uint256 roll;
    uint256 threshold;
    uint256 multiplierBps;
  }

  function getModeParams(uint8 mode)
    public
    pure
    returns (
      uint256 multiplierBps,
      uint256 winThreshold,
      uint256 probabilityWad
    )
  {
    if (mode == 0) {
      // GHOST BYPASS (Stealth) - 1.20x
      // Prob: 193/240 = 9650/12000 = 80.416666%
      // RTP: (193/240) * 1.20 = 96.50%
      return (12000, 9650, 804166666666666667);
    } else if (mode == 1) {
      // OVERCLOCK SURGE (Balanced) - 2.00x
      // Prob: 193/400 = 5790/12000 = 48.25%
      // RTP: (193/400) * 2.00 = 96.50%
      return (20000, 5790, 482500000000000000);
    } else if (mode == 2) {
      // QUANTUM DRILL (High Risk) - 5.00x
      // Prob: 193/1000 = 2316/12000 = 19.30%
      // RTP: (193/1000) * 5.00 = 96.50%
      return (50000, 2316, 193000000000000000);
    } else if (mode == 3) {
      // ZERO-DAY EXPLODE (Jackpot) - 20.00x
      // Prob: 193/4000 = 579/12000 = 4.825%
      // RTP: (193/4000) * 20.00 = 96.50%
      return (200000, 579, 48250000000000000);
    } else {
      revert NeonBreach__InvalidMode();
    }
  }

  function decodeGameData(bytes calldata gameData) public pure returns (GameBet memory bet) {
    if (gameData.length == 0) return GameBet(0);
    return abi.decode(gameData, (GameBet));
  }

  function quoteCaps(
    uint256 wager,
    bytes calldata gameData
  ) external pure override returns (uint256 maxEscrowStake, uint256 maxReservedProfit) {
    if (wager == 0) revert NeonBreach__InvalidWager();
    GameBet memory bet = decodeGameData(gameData);
    (uint256 multiplierBps,,) = getModeParams(bet.mode);
    uint256 maxPayout = (wager * multiplierBps) / 10000;
    maxReservedProfit = maxPayout > wager ? maxPayout - wager : 0;
    return (wager, maxReservedProfit);
  }

  function quoteRiskParams(
    uint256 wager,
    bytes calldata gameData
  )
    external
    pure
    override
    returns (
      uint256 maxPayout,
      uint256 probabilityWad,
      uint256 expectedPayout,
      uint256 bodyVarianceScaled
    )
  {
    if (wager == 0) revert NeonBreach__InvalidWager();
    GameBet memory bet = decodeGameData(gameData);
    (uint256 multiplierBps,, uint256 probWad) = getModeParams(bet.mode);
    maxPayout = (wager * multiplierBps) / 10000;
    probabilityWad = probWad;
    expectedPayout = (wager * TARGET_RTP_BPS) / 10000;
    bodyVarianceScaled = 0;
  }

  function onSessionStart(
    SessionContext calldata ctx
  ) external pure override returns (StepResult memory stepResult) {
    if (ctx.wagerBase == 0) revert NeonBreach__InvalidWager();
    GameBet memory bet = decodeGameData(ctx.gameData);
    (uint256 multiplierBps,,) = getModeParams(bet.mode);

    uint256 maxPayout = (ctx.wagerBase * multiplierBps) / 10000;
    uint256 maxReservedProfit = maxPayout > ctx.wagerBase ? maxPayout - ctx.wagerBase : 0;

    stepResult.newGameState = ctx.gameData;
    stepResult.escrowDelta = 0;
    stepResult.reservedProfitDelta = int256(maxReservedProfit);
    stepResult.nextPhase = SessionPhase.WAITING_RANDOMNESS;
    stepResult.requestRandomnessNow = true;
    stepResult.payout = 0;
  }

  function onPlayerAction(
    SessionContext calldata,
    bytes calldata
  ) external pure override returns (StepResult memory) {
    revert NeonBreach__NoPlayerAction();
  }

  function onRandomness(
    SessionContext calldata ctx,
    bytes32 randomness
  ) external pure override returns (StepResult memory stepResult) {
    GameBet memory bet = decodeGameData(ctx.gameData);
    (uint256 multiplierBps, uint256 winThreshold,) = getModeParams(bet.mode);

    uint256 roll = uint256(randomness) % MODULO_BASE;
    bool won = roll < winThreshold;
    uint256 payout = won ? (ctx.wagerBase * multiplierBps) / 10000 : 0;

    GameOutcome memory outcome = GameOutcome({
      won: won,
      mode: bet.mode,
      payout: payout,
      roll: roll,
      threshold: winThreshold,
      multiplierBps: multiplierBps
    });

    stepResult.newGameState = abi.encode(outcome);
    stepResult.escrowDelta = 0;
    stepResult.reservedProfitDelta = 0;
    stepResult.nextPhase = SessionPhase.SETTLED;
    stepResult.requestRandomnessNow = false;
    stepResult.payout = payout;
  }

  function quoteForfeitPayout(SessionContext calldata) external pure override returns (uint256) {
    return 0;
  }
}
