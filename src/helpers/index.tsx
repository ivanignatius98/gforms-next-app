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

export const getLayoutY = (curr: HTMLDivElement) => {
  return curr.getBoundingClientRect().y ?? 0
}