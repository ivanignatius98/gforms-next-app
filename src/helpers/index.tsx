export const debounce = (func: Function, wait: number) => {
  let timeout: any
  return function (...args: any) {
    let context = func
    let later = () => {
      timeout = null
      func.apply(func, args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (!timeout) func.apply(context, args)
  }
}

export const getLayoutY = (curr: HTMLDivElement | null) => {
  if (!curr) return 0
  return curr.getBoundingClientRect().y
}

export const swap = (arr: any[], index1: number, index2: number) => {
  let temp = [...arr]
  const swap = temp[index2]
  temp[index2] = temp[index1]
  temp[index1] = swap
  return temp
}

export const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(' ')
}

export const isTouchEvent = (event: any) => {
  return event.touches && event.touches.length > 0
}
export const getYCoordFromEvent = (event: any) => {
  return isTouchEvent(event) ? event.touches[0].clientY : event.clientY
}

export const separateSingleRowFromArray = (array: any, index: number) => {
  const data = [...array]
  const [separated] = data.splice(index, 1)
  return { separated, data }
}