import { Item } from '@interfaces/dropdown.interface';

interface Value {
  value: string
}
interface Label {
  label: string
}
interface ValueLabel extends Value, Label { }

interface OptionLinears {
  min: ValueLabel
  max: ValueLabel
  minLabel: string
  maxLabel: string
}

interface OptionChoices extends Value {
  error: boolean
  image: string | null
  previewImage: string | null
}

export interface Question {
  title: string
  type: Item
  answerOptions: OptionChoices[]
  gridRowOptions: Value[]
  gridColumnOptions: Value[]
  linearValueOptions: OptionLinears
  image: string
  previewImage: string
  imageAlignment: string
  moreOptions: object
  [key: string]: any
}