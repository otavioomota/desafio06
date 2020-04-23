import { getCustomRepository, getRepository } from 'typeorm';
import TransactionsRespository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';

import Category from '../models/Category';
import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRespository);

    const categoriesRepository = getRepository(Category);

    if (type !== 'income' && type !== 'outcome') {
      throw new AppError('Type is not valid !');
    }

    const balance = await transactionsRepository.getBalance();

    if (type === 'outcome' && balance.total < value) {
      throw new AppError('Balance insufficent !');
    }
    let categoryInfo = await categoriesRepository.findOne({
      where: { title: category },
    });

    if (!categoryInfo) {
      categoryInfo = categoriesRepository.create({
        title: category,
      });

      await categoriesRepository.save(categoryInfo);
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: categoryInfo.id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
