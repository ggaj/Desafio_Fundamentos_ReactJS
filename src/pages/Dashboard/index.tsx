import React, { useState, useEffect } from 'react';

import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import venda from '../../assets/venda.svg';
import alimentacao from '../../assets/alimentacao.svg';

import total from '../../assets/total.svg';

import api from '../../services/api';

import Header from '../../components/Header';

import formatValue from '../../utils/formatValue';

import { Container, CardContainer, Card, TableContainer } from './styles';

interface Transaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: { title: string };
  createdAt: Date;
}

interface Balance {
  income: string;
  outcome: string;
  total: string;
}

interface Response {
  transactions: Transaction[];
  balance: Balance;
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({} as Balance);

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString().split('-').reverse().join('/');
  };

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      const { data } = await api.get<Response>('transactions');

      const transactionsArr = data.transactions.map(
        (transaction: Transaction) => ({
          ...transaction,
          formattedDate: formatDate(transaction.createdAt),
          formattedValue:
            transaction.type === 'income'
              ? formatValue(transaction.value)
              : `- ${formatValue(transaction.value)}`,
        }),
      );

      setTransactions(transactionsArr);

      setBalance(data.balance);
    }

    loadTransactions();
  }, []);

  return (
    <>
      <Header />
      <Container>
        <CardContainer>
          <Card>
            <header>
              <p>Entradas</p>
              <img src={income} alt="Income" />
            </header>
            <h1 data-testid="balance-income">
              {formatValue(Number(balance.income))}
            </h1>
          </Card>
          <Card>
            <header>
              <p>Saídas</p>
              <img src={outcome} alt="Outcome" />
            </header>
            <h1 data-testid="balance-outcome">
              {formatValue(Number(balance.outcome))}
            </h1>
          </Card>
          <Card total>
            <header>
              <p>Total</p>
              <img src={total} alt="Total" />
            </header>
            <h1 data-testid="balance-total">
              {formatValue(Number(balance.total))}
            </h1>
          </Card>
        </CardContainer>

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Preço</th>
                <th>Categoria</th>
                <th>Data</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map(transaction => (
                <tr key={transaction.id}>
                  <td className="title">{transaction.title}</td>
                  <td
                    className={
                      transaction.type === 'income' ? 'income' : 'outcome'
                    }
                  >
                    {transaction.formattedValue}
                  </td>
                  <td>
                    <div>
                      {transaction.type === 'income' ? (
                        <img src={venda} alt="income" />
                      ) : (
                        <img src={alimentacao} alt="outcome" />
                      )}
                      <span>{transaction.category.title}</span>
                    </div>
                  </td>
                  <td>{transaction.formattedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableContainer>
      </Container>
    </>
  );
};

export default Dashboard;
