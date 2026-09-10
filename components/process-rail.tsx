import { processRail } from "@/lib/site-data"
import { cn } from "@/lib/utils"

export function ProcessRail({ className }: { className?: string }) {
  return (
    <ol
      className={cn(
        "grid gap-6 md:grid-flow-col md:auto-cols-fr md:gap-3 lg:gap-4",
        className,
      )}
    >
      {processRail.map((step, i) => {
        const Icon = step.icon
        const isLast = i === processRail.length - 1
        return (
          <li key={step.title} className="reveal-panel relative flex gap-4 md:flex-col md:gap-3">
            <div className="flex flex-col items-center md:w-full">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-sm border border-primary bg-primary/10 text-primary">
                <Icon className="size-5" aria-hidden="true" />
              </div>
              {!isLast && (
                <span
                  className="mt-2 hidden h-px w-full flex-1 bg-border md:block"
                  aria-hidden="true"
                />
              )}
            </div>
            <div className="pb-2 md:pb-0 md:text-center">
              <span className="font-mono text-[10px] uppercase tracking-wider text-accent">
                Step {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-1 text-sm font-bold leading-snug text-foreground">{step.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground md:mx-auto md:max-w-[11rem]">
                {step.description}
              </p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
