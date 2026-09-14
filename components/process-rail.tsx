import type { CSSProperties } from "react"
import { processRail } from "@/lib/site-data"
import { cn } from "@/lib/utils"

export function ProcessRail({ className }: { className?: string }) {
  return (
    <ol
      className={cn(
        "grid overflow-visible gap-6 pb-3 pt-4 md:min-h-[290px] md:grid-flow-col md:auto-cols-fr md:gap-3 md:pb-4 md:pt-5 lg:gap-4",
        className,
      )}
      data-process-rail
      data-process-stage
    >
      {processRail.map((step, i) => {
        const Icon = step.icon
        const isLast = i === processRail.length - 1
        return (
          <li
            key={step.title}
            className="reveal-panel process-motion-step relative flex overflow-visible gap-4 md:flex-col md:gap-3 md:pt-3"
            data-process-step
            style={{ "--motion-index": i } as CSSProperties}
          >
            <div className="flex flex-col items-center overflow-visible md:w-full">
              <div className="process-motion-node flex size-11 shrink-0 items-center justify-center rounded-sm border border-primary bg-primary/10 text-primary">
                <Icon className="size-5" aria-hidden="true" />
              </div>
            </div>
            {!isLast && (
              <span
                className="process-motion-line absolute left-[calc(50%+28px)] top-[34px] hidden h-0.5 w-[calc(100%-40px)] overflow-hidden bg-border md:block"
                aria-hidden="true"
              />
            )}
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
