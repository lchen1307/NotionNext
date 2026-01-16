import dynamic from 'next/dynamic'
import { useMemo } from 'react'
import { siteConfig } from '@/lib/config'
import CONFIG from '../config'

const CalendarHeatmap = dynamic(
  () => import('react-calendar-heatmap'),
  { ssr: false }
)

import 'react-calendar-heatmap/dist/styles.css'

export default function BlogHeatmap({ posts }) {
  const values = useMemo(() => {
    const map = {}
    posts?.forEach(post => {
      if (!post?.date?.start_date) return
      const day = post.date.start_date
      map[day] = (map[day] || 0) + 1
    })

    return Object.keys(map).map(date => ({
      date,
      count: map[date]
    }))
  }, [posts])

  if (!values.length) return null

  return (
    <div className='mb-12'>
      <h2 className='text-xl font-medium text-center mb-6'>
        博客热力图
      </h2>

      <div className='overflow-x-auto flex justify-center'>
        <CalendarHeatmap
          startDate={new Date(new Date().setFullYear(new Date().getFullYear() - 1))}
          endDate={new Date()}
          values={values}
          classForValue={value => {
            if (!value) return 'color-empty'
            if (value.count >= 4) return 'color-github-4'
            if (value.count >= 3) return 'color-github-3'
            if (value.count >= 2) return 'color-github-2'
            return 'color-github-1'
          }}
          showWeekdayLabels
        />
      </div>
    </div>
  )
}
