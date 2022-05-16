export const FormatNew = <T>({id, name}: {id: number | string, name: string}) => {
  return id === name ? {name} : {id}
}
