import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionRepository = getCustomRepository(TransactionsRepository);

    const checkTransactionExist = await transactionRepository.findOne({
      where: { id },
    });

    if (!checkTransactionExist) {
      throw new AppError('Transaction is not exist');
    }

    await transactionRepository.remove(checkTransactionExist);
  }
}

export default DeleteTransactionService;
