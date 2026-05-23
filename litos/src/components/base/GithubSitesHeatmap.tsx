'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '~/lib/utils'
import Tooltip, { TooltipProvider } from './Tooltip.tsx'

// API from https://github.com/grubersjoe/github-contributions-api
interface HeatmapDay {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

interface HeatmapResponse {
  total: {
    [year: number]: number
    [year: string]: number // 'lastYear'
  }
  days: Array<HeatmapDay>
}

interface ErrorData {
  error: string
}

interface Props {
  username: string
  tooltipEnabled: boolean
  dateLocale: string
  dateFormat: 'long' | 'numeric' | 'dot' | 'long-pt'
  restDayLabel: string
  siteSingularLabel: string
  sitePluralLabel: string
}

// ERROR图案配置
const ERROR_PATTERN = [
  [1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1],
  [1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
  [1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1],
  [1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
  [1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1],
] as const

// Generate fallback heatmap data for the error state.
function generateErrorHeatmap(): HeatmapResponse {
  const days = Array.from({ length: 371 }, (_, index): HeatmapDay => {
    const weekIndex = Math.floor(index / 7)
    const dayIndex = index % 7

    // 计算居中位置
    const patternStartWeek = Math.floor((53 - 19) / 2)
    const patternStartRow = Math.floor((7 - 5) / 2)
    const relativeWeek = weekIndex - patternStartWeek
    const relativeRow = dayIndex - patternStartRow

    let count = 0
    if (relativeWeek >= 0 && relativeWeek < 19 && relativeRow >= 0 && relativeRow < 5) {
      count = ERROR_PATTERN[relativeRow]?.[relativeWeek] === 1 ? 10 : 0 // 10表示最深色
    }

    return {
      date: '1',
      count,
      level: 0,
    }
  })

  return { days, total: { lastYear: 0 } }
}

function generatePlaceholderHeatmap(): HeatmapResponse {
  const days = Array.from({ length: 371 }, (_, index): HeatmapDay => ({
      date: new Date(Date.now() - (371 - index) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      count: 0,
      level: 0,
    }))

  return { days, total: { lastYear: 0 } }
}

async function fetchHeatmap(username: string): Promise<HeatmapResponse> {
  const response = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`)
  const data: { contributions: Array<HeatmapDay>; total: HeatmapResponse['total'] } | ErrorData = await response.json()

  if (!response.ok) {
    throw Error(`Fetching GitHub site heatmap data for "${username}" failed: ${(data as ErrorData).error}`)
  }

  const payload = data as { contributions: Array<HeatmapDay>; total: HeatmapResponse['total'] }

  return {
    days: payload.contributions,
    total: payload.total,
  }
}

export default function GithubSitesHeatmap({ username, tooltipEnabled, dateLocale, dateFormat, restDayLabel, siteSingularLabel, sitePluralLabel }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [data, setData] = useState<HeatmapResponse | null>(generatePlaceholderHeatmap())
  const [errorVisible, setErrorVisible] = useState(true)

  const scrollToRight = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollLeft = containerRef.current.scrollWidth
    }
  }, [])

  const fetchData = useCallback(() => {
    fetchHeatmap(username)
      .then(setData)
      .then(scrollToRight)
      .then(() => {
        setErrorVisible(false)
      })
      .catch(() => {
        setData(generateErrorHeatmap())
      })
  }, [username])

  useEffect(fetchData, [fetchData])

  const weeks =
    data?.days.reduce<HeatmapDay[][]>((acc, day, index) => {
      const weekIndex = Math.floor(index / 7)
      if (!acc[weekIndex]) {
        acc[weekIndex] = []
      }
      acc[weekIndex].push(day)
      return acc
    }, []) || []

  return (
    <TooltipProvider>
      <div ref={containerRef} className="grid grid-flow-col gap-1 overflow-x-auto py-2 px-2 max-md:px-0 scroll-smooth">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-rows-7 gap-1">
            {week.map((day, dayIndex) => {
              const { date, count } = day
              const currentDate = new Date(date)
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
                          }
                    ).format(currentDate)

              const siteLabel = count === 1 ? siteSingularLabel : sitePluralLabel
              const tooltipContent = `${formattedDate} — ${
                count === 0 ? restDayLabel : `${count} ${siteLabel}`
              }`

              return (
                <Tooltip key={dayIndex} content={tooltipContent} disabled={!tooltipEnabled || errorVisible}>
                  <div
                    className={cn(
                      'size-2 relative transition-colors duration-500 rounded-[1px]',
                      count === 0
                        ? 'bg-emerald-100/70 dark:bg-emerald-950/80'
                        : count < 3
                          ? 'bg-[#09cd3a]/20 dark:bg-[#09cd3a]/28'
                          : count < 5
                            ? 'bg-[#09cd3a]/38 dark:bg-[#09cd3a]/46'
                            : count < 8
                              ? 'bg-[#09cd3a]/62 dark:bg-[#09cd3a]/70'
                              : count < 12
                                ? 'bg-[#09cd3a]/82 dark:bg-[#09cd3a]/88'
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
