import BLOG from '@/blog.config'
import useNotification from '@/components/Notification'
import OpenWrite from '@/components/OpenWrite'
import { siteConfig } from '@/lib/config'
import { getGlobalData, getPost } from '@/lib/db/getSiteData'
import { useGlobal } from '@/lib/global'
import { getPageTableOfContents } from '@/lib/notion/getPageTableOfContents'
import { getPasswordQuery } from '@/lib/password'
import { checkSlugHasNoSlash, processPostData } from '@/lib/utils/post'
import { DynamicLayout } from '@/themes/theme'
import md5 from 'js-md5'
import { useRouter } from 'next/router'
import { idToUuid } from 'notion-utils'
import { useEffect, useState } from 'react'

/**
 * 仅一级 slug：/about, /oops 等
 */
const RESERVED_PREFIX = new Set(['oops', '404', '500', 'api'])

/**
 * 判断是否像 Notion PageId（32 位 hex，可带 '-'）
 * 例如：2c79d11fc50f815a89d3e7266a1c3d97
 * 或：2c79d11f-c50f-815a-89d3-e7266a1c3d97
 */
function looksLikeNotionPageId(str) {
  if (!str || typeof str !== 'string') return false
  const compact = str.replace(/-/g, '')
  return /^[0-9a-fA-F]{32}$/.test(compact)
}

/**
 * 根据notion的slug访问页面
 * 只解析一级目录例如 /about
 */
const Slug = props => {
  const { post } = props
  const router = useRouter()
  const { locale } = useGlobal()

  // 文章锁🔐
  const [lock, setLock] = useState(post?.password && post?.password !== '')
  const { showNotification, Notification } = useNotification()

  /**
   * 验证文章密码
   */
  const validPassword = passInput => {
    if (!post) return false
    const encrypt = md5(post?.slug + passInput)
    if (passInput && encrypt === post?.password) {
      setLock(false)
      localStorage.setItem('password_' + router.asPath, passInput)
      showNotification(locale.COMMON.ARTICLE_UNLOCK_TIPS)
      return true
    }
    return false
  }

  // 文章加载
  useEffect(() => {
    if (post?.password && post?.password !== '') {
      setLock(true)
    } else {
      setLock(false)
    }

    // 自动提交密码
    const passInputs = getPasswordQuery(router.asPath)
    if (passInputs.length > 0) {
      for (const passInput of passInputs) {
        if (validPassword(passInput)) break
      }
    }
  }, [post])

  // 解锁后生成目录与内容
  useEffect(() => {
    if (lock) return
    if (post?.blockMap?.block) {
      post.content = Object.keys(post.blockMap.block).filter(
        key => post.blockMap.block[key]?.value?.parent_id === post.id
      )
      post.toc = getPageTableOfContents(post, post.blockMap)
    }
  }, [router, lock])

  props = { ...props, lock, validPassword }
  const theme = siteConfig('THEME', BLOG.THEME, props.NOTION_CONFIG)

  return (
    <>
      <DynamicLayout theme={theme} layoutName='LayoutSlug' {...props} />
      {post?.password && post?.password !== '' && !lock && <Notification />}
      <OpenWrite />
    </>
  )
}

export async function getStaticPaths() {
  if (!BLOG.isProd) {
    return { paths: [], fallback: true }
  }

  const from = 'slug-paths'
  const { allPages } = await getGlobalData({ from })

  const paths = allPages
    ?.filter(row => checkSlugHasNoSlash(row))
    .map(row => ({ params: { prefix: row.slug } }))

  return { paths, fallback: true }
}

export async function getStaticProps({ params: { prefix }, locale }) {
  // ✅ 关键修复：拦截保留路由，避免触发 slug-props-oops
  if (RESERVED_PREFIX.has(prefix)) {
    return { notFound: true }
  }

  let fullSlug = prefix
  const from = `slug-props-${fullSlug}`
  const props = await getGlobalData({ from, locale })

  // 伪静态 html 后缀
  if (siteConfig('PSEUDO_STATIC', false, props.NOTION_CONFIG)) {
    if (!fullSlug.endsWith('.html')) {
      fullSlug += '.html'
    }
  }

  // 在列表内查找文章
  props.post = props?.allPages?.find(p => {
    return (
      p.type.indexOf('Menu') < 0 &&
      (p.slug === prefix || p.id === idToUuid(prefix))
    )
  })

  // 列表内找不到：尝试把 prefix 当作 pageId 直接拉（但必须像 Notion PageId）
  if (!props?.post) {
    const pageId = prefix
    if (looksLikeNotionPageId(pageId)) {
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

export default Slug
