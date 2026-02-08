import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { getGlobalData, getPost } from '@/lib/db/getSiteData'
import { checkSlugHasOneSlash, processPostData } from '@/lib/utils/post'
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
 * 解析二级目录 /article/about
 */
const PrefixSlug = props => {
  return <Slug {...props} />
}

export async function getStaticPaths() {
  if (!BLOG.isProd) {
    return { paths: [], fallback: true }
  }

  const from = 'slug-paths'
  const { allPages } = await getGlobalData({ from })

  const paths = allPages
    ?.filter(row => checkSlugHasOneSlash(row))
    .map(row => {
      const [prefix, slug] = row.slug.split('/')
      return { params: { prefix, slug } }
    })

  return { paths, fallback: true }
}

export async function getStaticProps({ params: { prefix, slug }, locale }) {
  // ✅ 拦截保留路由，避免 slug-props-oops 这类触发构建崩溃
  if (RESERVED.has(prefix) || RESERVED.has(slug)) {
    return { notFound: true }
  }

  const fullSlug = `${prefix}/${slug}`
  const from = `slug-props-${fullSlug}`
  const props = await getGlobalData({ from, locale })

  // 在列表内查找文章
  props.post = props?.allPages?.find(p => {
    return (
      p.type.indexOf('Menu') < 0 &&
      (p.slug === slug || p.slug === fullSlug || p.id === idToUuid(fullSlug))
    )
  })

  // 列表内找不到：尝试把 slug / fullSlug 当作 pageId（必须先校验格式）
  // 注意：这只是兜底，通常 prefix/slug 不是 pageId；但防止用户直接用 pageId 访问
  if (!props?.post) {
    // 候选：优先 slug（更可能是纯 pageId），再尝试 fullSlug
    const candidates = [slug, fullSlug]
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
