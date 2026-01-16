import Live2D from '@/components/Live2D'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import dynamic from 'next/dynamic'
import CONFIG from '../config'
import { AnalyticsCard } from './AnalyticsCard'
import Announcement from './Announcement'
import Card from './Card'
import Catalog from './Catalog'
import CategoryGroup from './CategoryGroup'
import { InfoCard } from './InfoCard'
import LatestPostsGroup from './LatestPostsGroup'
import TagGroups from './TagGroups'

const HexoRecentComments = dynamic(() => import('./HexoRecentComments'))
const FaceBookPage = dynamic(
  () => {
    let facebook = <></>
    try {
      facebook = import('@/components/FacebookPage')
    } catch (err) {
      console.error(err)
    }
    return facebook
  },
  { ssr: false }
)

/**
 * Hexo主题右侧栏
 * 说明：
 * - 已注释「作者信息卡（InfoCard / 一只芝士鱼）」
 * - 已注释「最新发布（LatestPostsGroup）」
 * - 其余组件保持不变
 */
export default function SideRight(props) {
  const {
    post,
    currentCategory,
    categories,
    latestPosts,
    tags,
    currentTag,
    showCategory,
    showTag,
    rightAreaSlot,
    notice,
    className
  } = props

  const { locale } = useGlobal()

  // 文章全屏模式：不显示右侧栏
  if (post && post?.fullWidth) {
    return null
  }

  return (
    <div
      id='sideRight'
      className={`lg:w-80 lg:pt-8 ${post ? 'lg:pt-0' : 'lg:pt-4'} ${className || ''}`}>
      <div className='sticky top-8 space-y-4'>

        {/* 文章目录（仅文章页且 TOC 较长时显示） */}
        {post && post.toc && post.toc.length > 1 && (
          <Card>
            <Catalog toc={post.toc} />
          </Card>
        )}

        {/* ===============================
            ❌ 作者信息卡
            =============================== */}
        {/*
        <InfoCard {...props} />
        */}

        {/* 站点统计卡片（如果开启） */}
        {siteConfig('HEXO_WIDGET_ANALYTICS', null, CONFIG) && (
          <AnalyticsCard {...props} />
        )}

        {/* 分类模块 */}
        {showCategory && (
          <Card>
            <div className='ml-2 mb-1'>
              <i className='fas fa-th' /> {locale.COMMON.CATEGORY}
            </div>
            <CategoryGroup
              currentCategory={currentCategory}
              categories={categories}
            />
          </Card>
        )}

        {/* 标签模块 */}
        {showTag && (
          <Card>
            <TagGroups tags={tags} currentTag={currentTag} />
          </Card>
        )}

        {/* ===============================
            ❌ 最新发布模块
            =============================== */}
        {/*
        {siteConfig('HEXO_WIDGET_LATEST_POSTS', null, CONFIG) &&
          latestPosts &&
          latestPosts.length > 0 && (
            <Card>
              <LatestPostsGroup {...props} />
            </Card>
          )}
        */}

        {/* 公告 */}
        <Announcement post={notice} />

        {/* 最近评论（Waline） */}
        {siteConfig('COMMENT_WALINE_SERVER_URL') &&
          siteConfig('COMMENT_WALINE_RECENT') && <HexoRecentComments />}

        {/* 右侧扩展插槽 */}
        {rightAreaSlot}

        {/* Facebook 页面 */}
        <FaceBookPage />

        {/* Live2D 看板娘 */}
        <Live2D />
      </div>
    </div>
  )
}
