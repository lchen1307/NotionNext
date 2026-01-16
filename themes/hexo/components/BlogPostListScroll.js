import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { getListByPage } from '@/lib/utils'
import { useEffect, useRef, useState } from 'react'
import CONFIG from '../config'
import BlogPostCard from './BlogPostCard'
import BlogPostListEmpty from './BlogPostListEmpty'
import Card from './Card'

/**
 * 博客列表（滚动分页）
 * 所有文章放在同一个 Card 中，模拟「一整页纸」效果
 */
const BlogPostListScroll = ({
  posts = [],
  currentSearch,
  showSummary = siteConfig('HEXO_POST_LIST_SUMMARY', null, CONFIG),
  siteInfo
}) => {
  const { NOTION_CONFIG, locale } = useGlobal()
  const [page, updatePage] = useState(1)

  const POSTS_PER_PAGE = siteConfig('POSTS_PER_PAGE', null, NOTION_CONFIG)
  const postsToShow = getListByPage(posts, page, POSTS_PER_PAGE)

  const targetRef = useRef(null)

  let hasMore = false
  if (posts) {
    hasMore = page * POSTS_PER_PAGE < posts.length
  }

  const handleGetMore = () => {
    if (hasMore) {
      updatePage(p => p + 1)
    }
  }

  // 自动滚动加载
  const scrollTrigger = () => {
    requestAnimationFrame(() => {
      if (!targetRef.current) return
      const scrollBottom = window.scrollY + window.innerHeight
      const containerBottom = targetRef.current.offsetTop + targetRef.current.clientHeight
      if (scrollBottom > containerBottom - 200) {
        handleGetMore()
      }
    })
  }

  useEffect(() => {
    window.addEventListener('scroll', scrollTrigger)
    return () => window.removeEventListener('scroll', scrollTrigger)
  })

  if (!postsToShow || postsToShow.length === 0) {
    return <BlogPostListEmpty currentSearch={currentSearch} />
  }

  return (
    <Card className='w-full'>
      {/* 整张“纸”的内容区域 */}
      <div
        ref={targetRef}
        className='px-8 md:px-12 py-8 md:py-10 divide-y divide-gray-200 dark:divide-gray-700'
      >
        {/* 文章列表 */}
        {postsToShow.map((post, index) => (
          <BlogPostCard
            key={post.id}
            index={index}
            post={post}
            showSummary={showSummary}
            siteInfo={siteInfo}
          />
        ))}

        {/* 加载更多 */}
        <div
          onClick={handleGetMore}
          className='pt-6 text-center text-sm cursor-pointer select-none
                     text-gray-500 dark:text-gray-400 hover:text-indigo-500'
        >
          {hasMore ? locale.COMMON.MORE : locale.COMMON.NO_MORE}
        </div>
      </div>
    </Card>
  )
}

export default BlogPostListScroll
