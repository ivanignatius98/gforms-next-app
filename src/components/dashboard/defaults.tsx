export const defaultQuestion = {
  title: '',
  type: { label: "Multiple Choices", value: "multiple_choices" },
  answerOptions: [{ value: 'Option 1', error: false, image: '', previewImage: '' }],
  gridRowOptions: [{ value: 'Row 1' }],
  gridColumnOptions: [{ value: 'Column 1' }],
  linearValueOptions: {
      min: { label: "1", value: "1" },
      max: { label: "5", value: "5" },
      minLabel: '',
      maxLabel: ''
  },
  image: '',
  previewImage: '',
  imageAlignment: 'left',
  otherOption: false,
  shuffleOption: false,
  requireEachRow: false
}