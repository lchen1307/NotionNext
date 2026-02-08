import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { getGlobalData, getPost } from '@/lib/db/getSiteData'
import { checkSlugHasMorThanTwoSlash, processPostData } from '@/lib/utils/post'
import { idToUuid } from 'notion-utils'
import Slug from '..'

/**
 * 保留路由：防止被当作文章路径进入 slug-props
 * （按需增减，最重要是 oops）
 */
const RESERVED = new Set(['oops', '404', '500', 'api'])

/**
 * 判断是否像 Notion PageId（32 位 hex，可带 '-'）
 */
function looksLikeNotionPageId(str) {
  if (!str || typeof str !== 'string') return false
  const compact = str.replace(/-/g, '')
  return /^[0-9a-fA-F]{32}$/.test(compact)
}

/**
 * 根据notion的slug访问页面
 * 解析三级以上目录 /article/2023/10/29/test
 */
const PrefixSlug = props => {
  return <Slug {...props} />
}

/**
 * 编译渲染页面路径
 */
export async function getStaticPaths() {
  if (!BLOG.isProd) {
    return { paths: [], fallback: true }
  }

  const from = 'slug-paths'
  const { allPages } = await getGlobalData({ from })

  const paths = allPages
    ?.filter(row => checkSlugHasMorThanTwoSlash(row))
    .map(row => {
      const parts = row.slug.split('/')
      return {
        params: {
          prefix: parts[0],
          slug: parts[1],
          suffix: parts.slice(2)
        }
      }
    })

  return { paths, fallback: true }
}

/**
 * 抓取页面数据
 */
export async function getStaticProps({ params: { prefix, slug, suffix }, locale }) {
  // ✅ 拦截保留路由，避免 slug-props-oops 等触发构建崩溃
  if (
    RESERVED.has(prefix) ||
    RESERVED.has(slug) ||
    (suffix || []).some(s => RESERVED.has(s))
  ) {
    return { notFound: true }
  }

  const suffixArr = Array.isArray(suffix) ? suffix : [suffix]
  const fullSlug = `${prefix}/${slug}/${suffixArr.join('/')}`
  const lastSlug = suffixArr[suffixArr.length - 1] // 最后一段，例如 test
  const from = `slug-props-${fullSlug}`
  const props = await getGlobalData({ from, locale })

  // 在列表内查找文章
  props.post = props?.allPages?.find(p => {
    return (
      p.type.indexOf('Menu') < 0 &&
      (
        // 常见匹配：全路径、最后一段、或 Notion 的 uuid 形式
        p.slug === fullSlug ||
        p.slug === lastSlug ||
        p.id === idToUuid(fullSlug)
      )
    )
  })

  /**
   * 列表内找不到：兜底尝试把某个参数当作 pageId 直接拉
   * 注意：必须先通过 looksLikeNotionPageId 校验，否则会把脏值传进 Notion API
   */
  if (!props?.post) {
    const candidates = [lastSlug, fullSlug, slug]
    let pageId = null
    for (const c of candidates) {
      if (looksLikeNotionPageId(c)) {
        pageId = c
        break
      }
    }

    if (pageId) {
      const post = await getPost(pageId)
      props.post = post
    }
  }

  if (!props?.post) {
    props.post = null
  } else {
    await processPostData(props, from)
  }

  return {
    props,
    revalidate: process.env.EXPORT
      ? undefined
      : siteConfig(
          'NEXT_REVALIDATE_SECOND',
          BLOG.NEXT_REVALIDATE_SECOND,
          props.NOTION_CONFIG
        )
  }
}

export default PrefixSlug
