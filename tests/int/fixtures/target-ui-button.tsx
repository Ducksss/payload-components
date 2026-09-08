import type { ComponentProps } from 'react'

export function Button({ children, ...props }: ComponentProps<'button'>) {
  return <button {...props}>{children}</button>
}
