import React, { useEffect, useState } from 'react';
import { OptionChoices, Question } from '@interfaces/question.interface';
import { defaultQuestion, choicesData, additionalOptionsMap, moreOptionsArr } from '@components/dashboard/defaults'
import AnswerOptions from '@components/dashboard/answerOptions'
import { swap } from '@helpers';
const MyComponent: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([
    {
      ...defaultQuestion,
      title: "Question A",
      answerOptions: [
        { value: 'Option 1', error: false, image: '', previewImage: '' },
        { value: 'Option 2', error: false, image: '', previewImage: '' },
        { value: 'Option 3', error: false, image: '', previewImage: '' },
        { value: 'Option 4', error: false, image: '', previewImage: '' }
      ]
    },
    {
      ...defaultQuestion,
      title: "Question B"
    },
  ]);

  const setQuestionValue = (payload: any, index: number) => {
    setQuestions(prevState => {
      const temp = [...prevState]
      temp[index ?? 0] = { ...temp[index ?? 0], ...payload }
      return temp;
    })
  }
  useEffect(() => {
    const move = (index: number, direction: "up" | "down") => {
      const nextIndex = direction === "up" ? index - 1 : index + 1
      console.log({ index, nextIndex, ans1: questions[index].answerOptions, ans2: questions[nextIndex].answerOptions })
      const temp = swap([...questions], index, nextIndex)
      console.log({ temp })
      setQuestions(temp)
    }
    move(0, "down")
  }, [])
  return (
    <div>
      {questions.map((row, i) => {
        return <>
          {row.title}
          <br />
          <AnswerOptions
            selected={false}
            questionProps={row}
            optionsValue={row.answerOptions}
            setOptionsValue={(newValue: OptionChoices[]) => {
              // setQuestionValue({ answerOptions: newValue })
            }}
            otherOptionValue={row.otherOption}
            setOtherOptionValue={(newValue: boolean) => {
              // setQuestionValue({ otherOption: newValue })
            }}
          />
        </>
      })}
    </div>
  )
};

export default MyComponent;



