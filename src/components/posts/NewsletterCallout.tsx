import { Input } from '@/components/ui/input'
import { cn } from '@/utilities/ui'

type Props = {
  action?: string
  buttonLabel?: string
  className?: string
  description?: string
  emailName?: string
  method?: 'get' | 'post'
  placeholder?: string
  title?: string
}

export const NewsletterCallout = ({
  action = '/api/newsletter',
  buttonLabel = 'Subscribe',
  className,
  description = 'Get the next article and kit release notes in your inbox.',
  emailName = 'email',
  method = 'post',
  placeholder = 'you@example.com',
  title = 'Subscribe for updates',
}: Props) => {
  return (
    <section className={cn('rounded-lg border border-border/70 bg-card/40 p-6 sm:p-8', className)}>
      <div className="grid gap-6 lg:grid-cols-[1fr_minmax(18rem,0.7fr)] lg:items-end">
        <div className="grid gap-3">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Newsletter</p>
          <h2 className="text-3xl font-medium tracking-[-0.05em]">{title}</h2>
          {description ? <p className="max-w-2xl text-sm leading-7 text-muted-foreground">{description}</p> : null}
        </div>

        <form action={action} method={method} className="flex flex-col gap-3 sm:flex-row">
          <Input
            aria-label="Email address"
            className="h-11 bg-background"
            name={emailName}
            placeholder={placeholder}
            type="email"
          />
          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            {buttonLabel}
          </button>
        </form>
      </div>
    </section>
  )
}
