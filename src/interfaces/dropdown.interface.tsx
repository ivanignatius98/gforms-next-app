export interface Content {
  icon?: JSX.Element,
  label: JSX.Element | string
}
export interface Item extends Content {
  value: string
  group?: number
}
export interface ListItem {
  onClick: Function;
  content: Content
}
export interface DropdownItemsList {
  header?: string
  items: ListItem[]
}

export interface contents {
  content: Item
}
export interface SelectItems {
  header?: string
  items: contents[]
}