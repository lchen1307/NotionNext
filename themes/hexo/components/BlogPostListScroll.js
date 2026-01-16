import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { getListByPage } from '@/lib/utils'
import { useEffect, useRef, useState } from 'react'
import CONFIG from '../config'
import BlogPostCard from './BlogPostCard'
import BlogPostListEmpty from './BlogPostListEmpty'

/**
 * 博客列表滚动分页（整体 Card 版）
 */
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
  const hasMore = posts && page * POSTS_PER_PAGE < posts.length
  const targetRef = useRef(null)

  const handleGetMore = () => {
    if (hasMore) setPage(p => p + 1)
  }

  // 滚动自动加载
  useEffect(() => {
    const onScroll = () => {
      const scrollBottom = window.scrollY + window.innerHeight
      const height = targetRef.current?.offsetHeight || 0
      if (scrollBottom > height + 200) {
        handleGetMore()
      }
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [hasMore])

  if (!postsToShow || postsToShow.length === 0) {
    return <BlogPostListEmpty currentSearch={currentSearch} />
  }

  return (
    <div
      id="container"
      ref={targetRef}
      className="w-full flex justify-center"
    >
      {/* ⭐️ 关键：外层「大 Card」 */}
      <div
        className="
          w-full
          max-w-5xl
          bg-white
          dark:bg-hexo-black-gray
          rounded-2xl
          shadow-xl
          px-6
          py-6
          space-y-4
        "
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
          className="
            text-center
            py-4
            cursor-pointer
            text-sm
            text-gray-500
            hover:text-gray-800
            dark:text-gray-400
          "
        >
          {hasMore ? locale.COMMON.MORE : locale.COMMON.NO_MORE}
        </div>
      </div>
    </div>
  )
}

export default BlogPostListScroll
