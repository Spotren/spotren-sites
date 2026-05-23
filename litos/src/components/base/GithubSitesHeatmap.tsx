'use client'

import { useEffect, useRef } from 'react'
import type { RepoHeatmapSnapshot } from '~/lib/github-org-repo-heatmap'
import { buildRepoHeatmapGrid } from '~/lib/github-org-repo-heatmap'
import { cn } from '~/lib/utils'
import Tooltip, { TooltipProvider } from './Tooltip.tsx'

interface Props {
  data: RepoHeatmapSnapshot
  tooltipEnabled: boolean
  dateLocale: string
  dateFormat: 'long' | 'numeric' | 'dot' | 'long-pt'
  restDayLabel: string
  siteSingularLabel: string
  sitePluralLabel: string
}

const ERROR_PATTERN = [
  [1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1],
  [1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
  [1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1],
  [1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
  [1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1],
] as const

function generateErrorHeatmapGrid() {
  return Array.from({ length: 371 }, (_, index) => {
    const weekIndex = Math.floor(index / 7)
    const dayIndex = index % 7
    const patternStartWeek = Math.floor((53 - 19) / 2)
    const patternStartRow = Math.floor((7 - 5) / 2)
    const relativeWeek = weekIndex - patternStartWeek
    const relativeRow = dayIndex - patternStartRow

    let count = 0
    if (relativeWeek >= 0 && relativeWeek < 19 && relativeRow >= 0 && relativeRow < 5) {
      count = ERROR_PATTERN[relativeRow]?.[relativeWeek] === 1 ? 12 : 0
    }

    return {
      date: '1970-01-01',
      count,
      level: count > 0 ? 4 : 0,
    }
  })
}

export default function GithubSitesHeatmap({ data, tooltipEnabled, dateLocale, dateFormat, restDayLabel, siteSingularLabel, sitePluralLabel }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const hasValidData = Array.isArray(data?.repos)
  const grid = hasValidData ? buildRepoHeatmapGrid(data) : generateErrorHeatmapGrid()

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollLeft = containerRef.current.scrollWidth
    }
  }, [grid.length])

  const weeks = grid.reduce<typeof grid[]>((accumulator, day, index) => {
    const weekIndex = Math.floor(index / 7)
    if (!accumulator[weekIndex]) {
      accumulator[weekIndex] = []
    }
    accumulator[weekIndex].push(day)
    return accumulator
  }, [])

  return (
    <TooltipProvider>
      <div ref={containerRef} className="grid grid-flow-col gap-1 overflow-x-auto py-2 px-2 max-md:px-0 scroll-smooth">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-rows-7 gap-1">
            {week.map((day, dayIndex) => {
              const { date, count } = day
              const currentDate = new Date(`${date}T00:00:00.000Z`)
              const formattedDate =
                dateFormat === 'dot'
                  ? new Intl.DateTimeFormat(dateLocale, {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                    })
                      .format(currentDate)
                      .replaceAll('/', '.')
                  : dateFormat === 'long-pt'
                    ? new Intl.DateTimeFormat(dateLocale, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      }).format(currentDate)
                  : new Intl.DateTimeFormat(
                      dateLocale,
                      dateFormat === 'numeric'
                        ? {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                          }
                        : {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          },
                    ).format(currentDate)

              const siteLabel = count === 1 ? siteSingularLabel : sitePluralLabel
              const tooltipContent = `${formattedDate} — ${count === 0 ? restDayLabel : `${count} ${siteLabel}`}`

              return (
                <Tooltip key={dayIndex} content={tooltipContent} disabled={!tooltipEnabled || !hasValidData}>
                  <div
                    className={cn(
                      'size-2 relative transition-colors duration-500 rounded-[1px]',
                      count === 0
                        ? 'bg-emerald-100/70 dark:bg-emerald-950/80'
                        : count < 3
                          ? 'bg-[#09cd3a]/20 dark:bg-[#09cd3a]/28'
                          : count < 6
                            ? 'bg-[#09cd3a]/38 dark:bg-[#09cd3a]/46'
                            : count < 11
                              ? 'bg-[#09cd3a]/62 dark:bg-[#09cd3a]/70'
                              : 'bg-[#09cd3a]'
                    )}
                  />
                </Tooltip>
              )
            })}
          </div>
        ))}
      </div>
    </TooltipProvider>
  )
}
