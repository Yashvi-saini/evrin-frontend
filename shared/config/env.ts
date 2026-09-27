export const ENV = {
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  APP_NAME: 'EVRIN',
  APP_FULL_NAME: 'Regime-Aware Rainfall Intelligence',
  PROBLEM_STATEMENT: 'PS 26080 — SIH 2026',
  VERSION: '1.0.0-prototype',
};
