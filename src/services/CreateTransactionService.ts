import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Category from '../models/Category';

import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title?: string;
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
    const transactionRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getRepository(Category);

    const { total } = await transactionRepository.getBalance();

    if (type === 'outcome' && total < value) {
      throw new AppError('Not balance for outcome transaction');
    }

    let checkCategory = await categoryRepository.findOne({
      where: { title: category },
    });

    if (!checkCategory) {
      checkCategory = categoryRepository.create({ title: category });
      await categoryRepository.save(checkCategory);
    }

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category: checkCategory,
    });
    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
