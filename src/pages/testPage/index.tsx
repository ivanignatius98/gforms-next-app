import React, { useState } from 'react';
import { OptionChoices, Question } from '@interfaces/question.interface';
import { defaultQuestion, choicesData, additionalOptionsMap, moreOptionsArr } from '@components/dashboard/defaults'


const MyComponent: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([
    {
      ...defaultQuestion,
      title: "Question A",
    },
    {
      ...defaultQuestion,
      title: "Question B",
    },
  ]);
  const [answerOptionsMap, setAnswerOptionsMap] = useState<OptionChoices[][]>(
    [
      [
        { value: 'Option 1', error: false, image: '', previewImage: '' },
        { value: 'Option 2', error: false, image: '', previewImage: '' },
        { value: 'Option 3', error: false, image: '', previewImage: '' }
      ],
      [
        { value: 'Option 4', error: false, image: '', previewImage: '' },
        { value: 'Option 5', error: false, image: '', previewImage: '' }
      ],
      // Add more options for other questions as needed
    ]
  );

  const swapAdjacentKeys = (index: number) => {
    const entries = [...answerOptionsMap];

    if (index >= 0 && index < entries.length - 1) {
      const temp = entries[index];
      entries[index] = entries[index + 1];
      entries[index + 1] = temp;
      setAnswerOptionsMap(entries); // Update the state with the new Map
    }
  };

  return (
    <div>
      {questions.map((row, i) => <>
        <ul>
          {answerOptionsMap[i].map((option, optionIndex) => (
            <li key={optionIndex}>{option.value}</li>
          ))}
        </ul>
      </>)}
      {/* Render your component here */}
      {/* Example: Display the options for question 1 */}
      <button onClick={() => swapAdjacentKeys(0)}>Swap with Next</button>
      <button onClick={() => console.log(answerOptionsMap)}>Log State</button>
    </div>
  );
};

export default MyComponent;



