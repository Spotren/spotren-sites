import { useEffect, useId, useRef, useState } from 'react'
import { cn } from '~/lib/utils'

type LanguageOption = {
  value: string
  label: string
  shortLabel: string
}

type LanguageSelectProps = {
  label: string
  locale: string
  basePath: string
  options: ReadonlyArray<LanguageOption>
}

function withLocalePath(locale: string, pathname: string) {
  const normalized = pathname === '' ? '/' : pathname.startsWith('/') ? pathname : `/${pathname}`

  if (locale === 'en') {
    return normalized
  }

  if (normalized === '/') {
    return `/${locale}`
  }

  return `/${locale}${normalized}`
}

export default function LanguageSelect({ label, locale, basePath, options }: LanguageSelectProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement | null>(null)
  const buttonId = useId()
  const selectedOption = options.find((option) => option.value === locale) ?? options[0]

  useEffect(() => {
    if (!open) {
      return
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open])

  return (
    <div className="relative" ref={rootRef}>
      <button
        aria-controls={`${buttonId}-menu`}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={label}
        className={cn(
          'relative inline-flex h-8 items-center rounded-[1rem] border border-border/70 bg-background/80 pl-8 pr-7 text-[0.78rem] text-foreground shadow-[0_14px_36px_rgba(0,0,0,0.16)] backdrop-blur-sm transition-colors hover:bg-background/95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35',
          open && 'bg-background/95'
        )}
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <span className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-foreground/60 icon-[material-symbols--translate-rounded]" />
        <span className="min-w-0 truncate text-center font-medium lowercase">{selectedOption.shortLabel}</span>
        <span
          className={cn(
            'pointer-events-none absolute right-2.5 top-1/2 size-3 -translate-y-1/2 text-foreground/55 icon-[ph--caret-down-bold] transition-transform',
            open && 'rotate-180'
          )}
        />
      </button>

      {open ? (
        <div
          className="absolute right-0 top-full z-40 mt-2 min-w-[14rem] overflow-hidden rounded-[1rem] border border-border/70 bg-background/95 p-2 shadow-[0_18px_40px_rgba(0,0,0,0.24)] backdrop-blur-md"
          id={`${buttonId}-menu`}
          role="menu"
        >
          {options.map((option) => {
            const isSelected = option.value === selectedOption.value

            return (
              <button
                className={cn(
                  'grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-[0.6rem] px-2.5 py-2 text-left text-[0.88rem] transition-colors',
                  isSelected ? 'text-foreground' : 'text-foreground/82 hover:bg-accent/50'
                )}
                key={option.value}
                onClick={() => {
                  setOpen(false)
                  if (option.value !== selectedOption.value) {
                    window.location.href = withLocalePath(option.value, basePath)
                  }
                }}
                role="menuitemradio"
                type="button"
              >
                <span className="truncate">{option.label}</span>
                {isSelected ? (
                  <span className="size-4 text-foreground icon-[ph--check-bold]" />
                ) : (
                  <span className="size-4" />
                )}
              </button>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
