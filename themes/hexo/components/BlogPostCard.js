import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import SmartLink from '@/components/SmartLink'
import CONFIG from '../config'
import { BlogPostCardInfo } from './BlogPostCardInfo'

/**
 * 单篇文章条目（不再自带白色 Card）
 * 由外层 BlogPostListPage / Scroll 统一包一个大 Card
 */
const BlogPostCard = ({ index, post, showSummary, siteInfo }) => {
const showPreview =
siteConfig('HEXO_POST_LIST_PREVIEW', null, CONFIG) && post.blockMap

if (
post &&
!post.pageCoverThumbnail &&
siteConfig('HEXO_POST_LIST_COVER_DEFAULT', null, CONFIG)
) {
post.pageCoverThumbnail = siteInfo?.pageCover
}

const showPageCover =
siteConfig('HEXO_POST_LIST_COVER', null, CONFIG) &&
post?.pageCoverThumbnail &&
!showPreview
  //   const delay = (index % 2) * 200

return (
    <div
      className={`${siteConfig('HEXO_POST_LIST_COVER_HOVER_ENLARGE', null, CONFIG) ? ' hover:scale-110 transition-all duration-150' : ''}`}>
      <div
        key={post.id}
        data-aos='fade-up'
        data-aos-easing='ease-in-out'
        data-aos-duration='500'
        data-aos-once='false'
        data-aos-anchor-placement='top-bottom'
        id='blog-post-card'
        className={`group md:h-56 w-full flex justify-between md:flex-row flex-col-reverse ${siteConfig('HEXO_POST_LIST_IMG_CROSSOVER', null, CONFIG) && index % 2 === 1 ? 'md:flex-row-reverse' : ''}
                    overflow-hidden border dark:border-black rounded-xl bg-white dark:bg-hexo-black-gray`}>
        {/* 文字内容 */}
        <BlogPostCardInfo
          index={index}
          post={post}
          showPageCover={showPageCover}
          showPreview={showPreview}
          showSummary={showSummary}
        />
    <article
      key={post.id}
      data-aos='fade-up'
      data-aos-easing='ease-in-out'
      data-aos-duration='500'
      data-aos-once='false'
      data-aos-anchor-placement='top-bottom'
      className={`
        w-full
        flex justify-between
        md:flex-row flex-col-reverse
        py-10
        ${siteConfig('HEXO_POST_LIST_IMG_CROSSOVER', null, CONFIG) && index % 2 === 1
          ? 'md:flex-row-reverse'
          : ''}
      `}
    >
      {/* 文字内容 */}
      <BlogPostCardInfo
        index={index}
        post={post}
        showPageCover={showPageCover}
        showPreview={showPreview}
        showSummary={showSummary}
      />

        {/* 图片封面 */}
        {showPageCover && (
          <div className='md:w-5/12 overflow-hidden'>
            <SmartLink href={post?.href}>
              <>
                <LazyImage
                  priority={index === 1}
                  alt={post?.title}
                  src={post?.pageCoverThumbnail}
                  className='h-56 w-full object-cover object-center group-hover:scale-110 duration-500'
                />
              </>
            </SmartLink>
          </div>
        )}
      </div>
    </div>
      {/* 图片封面（如果开启） */}
      {showPageCover && (
        <div className='md:w-5/12 overflow-hidden rounded-lg'>
          <SmartLink href={post?.href}>
            <LazyImage
              priority={index === 1}
              alt={post?.title}
              src={post?.pageCoverThumbnail}
              className='h-56 w-full object-cover object-center transition-transform duration-500 hover:scale-105'
            />
          </SmartLink>
        </div>
      )}
    </article>
)
}

export default BlogPostCard
