import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import SmartLink from '@/components/SmartLink'
import CONFIG from '../config'
import { BlogPostCardInfo } from './BlogPostCardInfo'

const BlogPostCard = ({ index, post, showSummary, siteInfo }) => {
  const showPreview =
    siteConfig('HEXO_POST_LIST_PREVIEW', null, CONFIG) && post.blockMap

  // 没有封面时使用站点默认封面
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

  return (
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
        py-5 md:py-6
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

      {/* 图片封面（如果开启） */}
      {showPageCover && (
        <div className='md:w-5/12 overflow-hidden rounded-lg'>
          <SmartLink href={post?.href}>
            <LazyImage
              priority={index === 1}
              alt={post?.title}
              src={post?.pageCoverThumbnail}
              className='h-40 md:h-44 w-full object-cover object-center transition-transform duration-500 hover:scale-105'
            />
          </SmartLink>
        </div>
      )}
    </article>
  )
}

export default BlogPostCard
