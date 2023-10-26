import { Question } from '@interfaces/question.interface';
import { createContext } from 'react';

export const QuestionsContext = createContext({
  selected: false,
  row: {} as Question,
  i: 0,
  isSectionHeader: false,
  setMoveModalOpen: (val: boolean) => { }
});