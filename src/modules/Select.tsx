import React from 'react'
import Select from 'react-select'

const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' }
]
interface GroupedOption {
  readonly label: string;
  readonly options: readonly ColourOption[] | readonly FlavourOption[];
}

const groupedOptions: readonly GroupedOption[] = [
  {
    label: 'Colours',
    options: options,
  },
  {
    label: 'Flavours',
    options: options,
  },
];

const Component: React.FC = () => {
  return <Select options={groupedOptions} />
}
export default Component