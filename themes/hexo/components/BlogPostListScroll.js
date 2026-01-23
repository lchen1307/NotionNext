import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { getListByPage } from '@/lib/utils'
import { useEffect, useRef, useState } from 'react'
import CONFIG from '../config'
import BlogPostCard from './BlogPostCard'
import BlogPostListEmpty from './BlogPostListEmpty'

const BlogPostListScroll = ({
  posts = [],
  currentSearch,
  showSummary = siteConfig('HEXO_POST_LIST_SUMMARY', null, CONFIG),
  siteInfo
}) => {
  const { NOTION_CONFIG, locale } = useGlobal()
  const [page, setPage] = useState(1)
  const POSTS_PER_PAGE = siteConfig('POSTS_PER_PAGE', null, NOTION_CONFIG)
  const postsToShow = getListByPage(posts, page, POSTS_PER_PAGE)

  const targetRef = useRef(null)

  let hasMore = page * POSTS_PER_PAGE < posts.length

  const handleGetMore = () => {
    if (hasMore) setPage(page + 1)
  }

  // 自动滚动加载
  useEffect(() => {
    const onScroll = () => {
      const scrollBottom = window.scrollY + window.innerHeight
      const height = targetRef.current?.offsetHeight || 0
      if (scrollBottom > height - 200) {
        handleGetMore()
      }
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  })

  if (!postsToShow || postsToShow.length === 0) {
    return <BlogPostListEmpty currentSearch={currentSearch} />
  }

  return (
    /* 🌫 灰色底层 */
    <div className="w-full bg-gray-100 dark:bg-black py-12">
      {/* 🧱 白色浮动 Card */}
      <div
        ref={targetRef}
        className="
          mx-auto
          max-w-5xl
          bg-white dark:bg-hexo-black-gray
          rounded-2xl
          shadow-card
          px-4 md:px-8
          py-10
        "
      >
        {/* 🔗 连续文章流（不再是一个个卡片） */}
        <div className="space-y-0">
          {postsToShow.map(post => (
            <BlogPostCard
              key={post.id}
              post={post}
              showSummary={showSummary}
              siteInfo={siteInfo}
            />
          ))}
        </div>

        {/* ⬇️ 加载更多 */}
        <div
          onClick={handleGetMore}
          className="
            mt-10
            text-center
            text-sm
            text-gray-500
            cursor-pointer
            hover:text-blue-500
          "
        >
          {hasMore ? locale.COMMON.MORE : locale.COMMON.NO_MORE}
        </div>
      </div>
    </div>
  )
}

export default BlogPostListScroll
