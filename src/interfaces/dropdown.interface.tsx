export interface Content {
  icon?: JSX.Element,
  label: string
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
