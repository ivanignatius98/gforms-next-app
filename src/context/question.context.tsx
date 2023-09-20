import { Question } from '@interfaces/question.interface';
import { createContext } from 'react';

export const QuestionsContext = createContext({
  selected: false,
  viewportWidth: 0,
  row: {} as Question,
  i: 0
});