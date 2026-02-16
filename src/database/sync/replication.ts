import { replicateRxCollection } from 'rxdb/plugins/replication';
import type { JsBudgetDatabase } from '../db';
import { REPLICATION_IDENTIFIERS, REPLICATION_CONFIG } from './constants';
import api from '../../services/api';
import { buildQueryString } from '../../utils/common';

const createReplicationHandler = (
  endpoint: string,
  customParams?: Record<string, unknown>
) => ({
  push: {
    handler: async (docs: unknown[]) => {
      const response = await api.post(`/sync${endpoint}/push`, docs);
      return response.data;
    },
  },
  pull: {
    handler: async (lastCheckpoint: unknown, batchSize: number = 100) => {
      const queryParams = {
        limit: batchSize,
        checkpoint: lastCheckpoint ? JSON.stringify(lastCheckpoint) : '',
        ...customParams,
      };

      const response = await api.get(
        `/sync${endpoint}/pull?${buildQueryString(queryParams)}`
      );
      return response.data;
    },
  },
});

export const setupReplication = (database: JsBudgetDatabase) => {
  const expenseHandler = createReplicationHandler('/expenses', {
    // custom query params here
    
  });
  const expenseReplication = replicateRxCollection({
    collection: database.expenses,
    replicationIdentifier: REPLICATION_IDENTIFIERS.EXPENSES,
    ...REPLICATION_CONFIG,
    push: expenseHandler.push,
    pull: expenseHandler.pull,
  });

  const categoryHandler = createReplicationHandler('/categories', {
    // custom query params here
  });

  const categoryReplication = replicateRxCollection({
    collection: database.categories,
    replicationIdentifier: REPLICATION_IDENTIFIERS.CATEGORY,
    ...REPLICATION_CONFIG,
    push: categoryHandler.push,
    pull: categoryHandler.pull,
  });

  

  return {
    expenseReplication,
    categoryReplication,
    start: () => {
      expenseReplication.start();
      categoryReplication.start();
    },
    stop: () => {
      expenseReplication.cancel();
      categoryReplication.cancel();
    },
  };
};
