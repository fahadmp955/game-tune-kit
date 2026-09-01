# ⚡ Technical Working Mechanisms & Pipelines — GameTuneKit

This document details the core mathematical models, client-side execution pipelines, and workflow mechanisms for GameTuneKit utilities.

---

## 1. Modular Calculation Architecture

Every utility is built around a pure mathematical function (Engine module) decoupled completely from the UI React view layer:

```text
[ React UI View ] <---> [ Custom React Hook (e.g. useLTVCalculator) ] <---> [ Pure Math Engine (e.g. computeLTV) ]
                                                                                   |
                                                                        [ Standardized Math Output DTO ]
```

---

## 2. Deep Dive: Key Utility Calculation Pipelines

### A. Utility #01: LTV Calculator (Power-Law Retention Curve)

1. **Formula Engine:**
   - Fits observed D1, D7, D30 retention checkpoints to the power-law equation:
     \[
     R(t) = a \cdot t^{-b}
     \]
   - Calculates decay coefficient \(b\) via logarithmic linear regression:
     \[
     b = \frac{N \sum (\ln t \cdot \ln R_t) - (\sum \ln t)(\sum \ln R_t)}{N \sum (\ln t)^2 - (\sum \ln t)^2}
     \]
   - Integrates retention over time horizon \(T \in \{30, 90, 180, 365\}\):
     \[
     \text{Lifespan}(T) = 1 + \sum_{t=1}^{T} R(t)
     \]
   - Computes cumulative LTV:
     \[
     \text{LTV}(T) = \text{Lifespan}(T) \times \text{Daily ARPU}
     \]

2. **Output Stream:**
   - Array of daily coordinates \((t, R(t), \text{Cumulative LTV}(t))\) for Recharts interactive rendering.
   - Benchmark comparison flags (e.g., D1 < 35% warning indicator for casual genre).

---

### B. Utility #08: Purchasing Power Parity (PPP) Price Calculator

1. **Formula Engine:**
   - Input: Base Price in USD (\(P_{\text{base}}\)), Target Country (\(C\)).
   - Lookup Country Big Mac Index / World Bank Price Level Ratio (\(\text{PPP}_{C}\)).
   - Calculates raw parity price:
     \[
     P_{\text{raw}} = P_{\text{base}} \times \text{PPP}_{C}
     \]
   - Applies Store Price Tier Rounding Rule (e.g., Apple/Google ending in `.99` or `.00` regional tier mapping).

2. **Output Stream:**
   - Suggested regional localized price.
   - Percentage adjustment relative to standard exchange rate conversion.
   - Revenue impact elasticity simulation (Volume multiplier vs Price reduction).

---

### C. Utility #14: Loot & Drop-Rate Calculator

1. **Formula Engine:**
   - Binomial distribution model: Probability \(p\) of drop per attempt, \(n\) attempts.
   - Probability of getting at least 1 drop in \(n\) pulls:
     \[
     P(\text{at least 1}) = 1 - (1 - p)^n
     \]
   - Attempts needed for \(X\%\) confidence:
     \[
     n = \frac{\ln(1 - X)}{\ln(1 - p)}
     \]

2. **Output Stream:**
   - Cumulative distribution function (CDF) chart showing 50%, 80%, 90%, 95%, 99% probability thresholds.
   - Expected average cost & currency required.

---

### D. Utility #15: Pity System Calculator

1. **Formula Engine:**
   - Models Base Rate \(p_0\), Soft Pity threshold \(T_{\text{soft}}\), Soft Pity increment \(\Delta p\), Hard Pity threshold \(T_{\text{hard}}\).
   - Rate at pull \(k\):
     \[
     p(k) = \begin{cases} 
     p_0 & k < T_{\text{soft}} \\
     p_0 + (k - T_{\text{soft}} + 1) \cdot \Delta p & T_{\text{soft}} \le k < T_{\text{hard}} \\
     1.0 & k \ge T_{\text{hard}}
     \end{cases}
     \]
   - Calculates expected pull count \(E[K] = \sum_{k=1}^{T_{\text{hard}}} k \cdot P(K = k)\).

---

## 3. Preset Sharing & URL State Mechanism

- Inputs are encoded into a compact compressed query parameter (`?state=<base64-json>`).
- Opening a shared URL auto-populates all calculator fields, generating exact identical charts and output metrics.
