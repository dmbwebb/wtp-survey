# Switching Point Detection Logic

## What is a Switching Point?

A switching point is when we can confidently predict ALL remaining answers based on the current choice.

## Token Order Semantics (v0.50+)

- **TOKEN_AMOUNTS** = [0, -2, -3, -5, -8, -10] (all payment amounts, ordered from least to most costly)
- **Descending order**: Present tokens from least to most costly: 0, -2, -3, -5, -8, -10 (best offer first)
- **Ascending order**: Present tokens from most to least costly: -10, -8, -5, -3, -2, 0 (worst offer first)

## Offer Attractiveness (Participant Perspective)

All offers involve paying tokens to avoid limiting the app. From most attractive to least attractive:
- 0 tokens: No cost to not limit (BEST)
- -2 tokens: Pay $2,000 COP to not limit
- -3 tokens: Pay $3,000 COP to not limit
- -5 tokens: Pay $5,000 COP to not limit
- -8 tokens: Pay $8,000 COP to not limit
- -10 tokens: Pay $10,000 COP to not limit (WORST)

## All Cases for Switching Point Detection

### Descending Order (Best→Worst: 0, -2, -3, -5, -8, -10)

Starting with the LEAST costly offer and moving to MORE costly offers.

#### First Question (0 tokens - best offer)

| User Choice | Meaning | Predict Future? | Switching Point? |
|-------------|---------|-----------------|------------------|
| 'tokens' | Accept 0 cost | NO - might reject more costly offers | ❌ NO |
| 'limit' | Reject 0 cost (free offer) | YES - will reject all more costly offers | ✅ YES |

**Logic**: If unwilling to pay 0 to avoid limiting, unwilling to pay any positive amount either.

#### Later Questions (after consistent previous choices)

| Previous Choices | Current Choice | Meaning | Switching Point? |
|------------------|----------------|---------|------------------|
| All 'tokens' | 'limit' | Was accepting, now rejecting → found threshold | ✅ YES |
| All 'limit' | 'tokens' | Inconsistent behavior (violates rationality) | ❌ NO |

### Ascending Order (Worst→Best: -10, -8, -5, -3, -2, 0)

Starting with the MOST costly offer and moving to LESS costly offers.

#### First Question (-10 tokens - worst offer)

| User Choice | Meaning | Predict Future? | Switching Point? |
|-------------|---------|-----------------|------------------|
| 'tokens' | Accept -10 (most costly) | YES - will accept all less costly offers | ✅ YES |
| 'limit' | Reject -10 | NO - might accept less costly offers | ❌ NO |

**Logic**: If willing to pay 10 tokens to avoid limiting, will pay any lesser amount too.
If unwilling to pay 10 tokens, might still be willing to pay 8, 5, 3, 2, or 0.

#### Later Questions (after consistent previous choices)

| Previous Choices | Current Choice | Meaning | Switching Point? |
|------------------|----------------|---------|------------------|
| All 'limit' | 'tokens' | Was rejecting, now accepting → found threshold | ✅ YES |
| All 'tokens' | 'limit' | Inconsistent behavior (violates rationality) | ❌ NO |

## Current Code Issues

The code logic appears correct, but the user is experiencing a bug where choosing 'limit' at -10 tokens (first question, ascending order) triggers a switching point confirmation.

Possible causes:
1. tokenOrder value is incorrect or cached
2. previousChoices is not empty when it should be
3. Logic error in condition evaluation
