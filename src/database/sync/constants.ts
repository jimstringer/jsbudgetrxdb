export const REPLICATION_IDENTIFIERS = Object.freeze({
  EXPENSES: 'expenses-replication',
  CATEGORY: 'category-replication',
});

export const REPLICATION_CONFIG = Object.freeze({
  retryTime: 5 * 1000,
  live: true,
  waitForLeadership: true,
});
