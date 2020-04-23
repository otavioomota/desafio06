import { getCustomRepository } from 'typeorm';
import { isUuid } from 'uuidv4';
import TransactionsRepository from '../repositories/TransactionsRepository';

import AppError from '../errors/AppError';

interface Request {
  id: string;
}
class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    if (!isUuid(id)) {
      throw new AppError('ID is not valid !');
    }

    const transaction = await transactionsRepository.findOne({ id });

    if (!transaction) {
      throw new AppError('User does not exist !');
    }

    await transactionsRepository.delete({ id });
  }
}

export default DeleteTransactionService;
