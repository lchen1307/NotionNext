import React from 'react'
import ReactECharts from 'echarts-for-react'
import { formatDateFmt } from '@/lib/utils/formatDate'
import { useGlobal } from '@/lib/global'

const HeatMap = ({ posts }) => {
  const { isDarkMode } = useGlobal()
  
  if (!posts || posts.length === 0) return null

  // Process data: Map date -> wordCount
  const dataMap = new Map()
  
  posts.forEach(post => {
      if (!post.publishDate) return
      const date = formatDateFmt(post.publishDate, 'yyyy-MM-dd')
      const count = post.wordCount || 0 
      
      if (dataMap.has(date)) {
          dataMap.set(date, dataMap.get(date) + count)
      } else {
          dataMap.set(date, count)
      }
  })

  const data = []
  for (const [key, value] of dataMap) {
      data.push([key, value]) // value in words
  }

  // Date range: Last 12 months
  const endDate = new Date()
  const startDate = new Date()
  startDate.setMonth(startDate.getMonth() - 11) // Last 12 months including current
  startDate.setDate(1) // Start from beginning of the month

  // Color scheme
  // Light: Low -> High
  // Dark: Low -> High
  // Using purple/indigo shades to match Hexo theme
  const colors = isDarkMode 
    ? ['#333333', '#4f46e5'] // Dark mode colors
    : ['#ebedf0', '#928CEE'] // Light mode colors

  const option = {
    tooltip: {
        position: 'top',
        formatter: function (p) {
            const format = formatDateFmt(new Date(p.data[0]), 'yyyy-MM-dd')
            return `${format}: ${p.data[1]} 字`
        }
    },
    visualMap: {
        min: 0,
        max: 5000, // Assumption: 5000 words is a "high" activity day. Can be dynamic.
        type: 'piecewise',
        orient: 'horizontal',
        left: 'center',
        top: 0,
        textStyle: {
            color: isDarkMode ? '#ccc' : '#333'
        },
        inRange: {
            color: colors
        },
        showLabel: false,
        itemWidth: 10,
        itemHeight: 10,
        itemGap: 5
    },
    calendar: {
        top: 40,
        left: 30,
        right: 30,
        cellSize: ['auto', 13],
        range: [formatDateFmt(startDate, 'yyyy-MM-dd'), formatDateFmt(endDate, 'yyyy-MM-dd')],
        itemStyle: {
            borderWidth: 0.5,
            borderColor: isDarkMode ? '#1e1e1e' : '#fff',
            color: 'transparent'
        },
        yearLabel: { show: false },
        dayLabel: {
            firstDay: 1, // Start week on Monday
            nameMap: 'cn', // Use Chinese day names
            color: isDarkMode ? '#ccc' : '#333'
        },
        monthLabel: {
            color: isDarkMode ? '#ccc' : '#333'
        },
        splitLine: {
            show: false
        }
    },
    series: {
        type: 'heatmap',
        coordinateSystem: 'calendar',
        data: data,
        itemStyle: {
            borderRadius: 2
        }
    }
  }

  return (
    <div className="w-full bg-white dark:bg-hexo-black-gray rounded-xl p-4 shadow-card mb-4 transition-colors duration-200">
       <div className="font-bold text-lg mb-2 flex items-center gap-2 dark:text-gray-200">
           <i className='fas fa-chart-line' />
           <span>博客热力图</span>
       </div>
       <ReactECharts option={option} style={{ height: '180px', width: '100%' }} opts={{ renderer: 'svg' }} />
    </div>
  )
}

export default HeatMap
