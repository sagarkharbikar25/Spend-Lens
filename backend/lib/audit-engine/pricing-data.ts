/**
 * Single source of truth for list pricing (USD / month unless noted).
 * Citations: PRICING_DATA.md
 */
export const PRICING = {
  cursor: {
    proPerUser: 20,
    businessPerUser: 40,
  },
  githubCopilot: {
    individual: 10,
    businessPerUser: 19,
  },
  claude: {
    proPerUser: 20,
    maxPerUser: 100,
    teamPerUser: 25,
  },
  chatgpt: {
    plusPerUser: 20,
    teamPerUser: 25,
  },
  gemini: {
    pro: 19.99,
    ultra: 249.99,
  },
  windsurf: {
    pro: 15,
    teamsPerUser: 30,
  },
  api: {
    /** Below this monthly API spend, usage is likely light */
    lightSpendThreshold: 25,
    /** Above this, worth a finance review */
    heavySpendThreshold: 200,
  },
} as const;
