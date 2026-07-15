type TitledSourceFile = { title: string }

export type ComponentSourceGroup<T extends TitledSourceFile> = {
  dir: string
  items: Array<{ file: T; index: number }>
}

const dirName = (title: string) => title.slice(0, title.lastIndexOf('/'))

export function groupComponentSourceFiles<T extends TitledSourceFile>(
  files: readonly T[],
): ComponentSourceGroup<T>[] {
  const groups = new Map<string, ComponentSourceGroup<T>>()

  files.forEach((file, index) => {
    const dir = dirName(file.title)
    const group = groups.get(dir)

    if (group) {
      group.items.push({ file, index })
      return
    }

    groups.set(dir, { dir, items: [{ file, index }] })
  })

  return [...groups.values()]
}
