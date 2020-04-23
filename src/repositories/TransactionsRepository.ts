import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const incomeArray: Transaction[] = transactions.filter(
      transaction => transaction.type === 'income',
    );

    const outcomeArray: Transaction[] = transactions.filter(
      transaction => transaction.type === 'outcome',
    );

    const income = incomeArray.reduce((total, transaction) => {
      return total + transaction.value;
    }, 0);

    const outcome = outcomeArray.reduce((total, transaction) => {
      return total + transaction.value;
    }, 0);

    const balance: Balance = {
      income,
      outcome,
      total: income - outcome,
    };

    return balance;
  }
}

export default TransactionsRepository;
