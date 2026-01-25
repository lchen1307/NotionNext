import { siteConfig } from '@/lib/config'
import CONFIG from '../config'

/**
 * 桌面端：文章页左侧目录
 * 依赖 post.toc（NotionNext 会给 toc 数组）
 */
export default function SideTocLeft({ post }) {
  const toc = post?.toc || []
  if (toc.length <= 1) return null

  const themeColor = siteConfig('HEXO_THEME_COLOR', '#928CEE', CONFIG)

  // 处理点击跳转（兼容有固定 Header 的情况）
  const scrollToHeading = (id) => {
    if (!id) return

    // 有些 id 里可能有特殊字符，querySelector 需要 escape
    const safeId =
      typeof CSS !== 'undefined' && CSS.escape ? CSS.escape(id) : id

    const el =
      document.getElementById(id) ||
      document.querySelector(`#${safeId}`) ||
      document.querySelector(`[data-id="${safeId}"]`)

    if (!el) {
      // 找不到元素时，至少把 hash 写进去（方便刷新后定位）
      window.location.hash = id
      return
    }

    // 如果你有固定顶部导航栏，改这个偏移量即可（比如 64/72/80）
    const HEADER_OFFSET = 80

    const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET
    window.scrollTo({ top, behavior: 'smooth' })

    // 更新地址栏 hash，但不触发浏览器默认跳转
    if (history?.replaceState) {
      history.replaceState(null, '', `#${id}`)
    } else {
      window.location.hash = id
    }
  }

  return (
    <aside className="w-64">
      <div className="rounded-2xl bg-white/80 dark:bg-hexo-black-gray/80 shadow-sm border border-gray-100 dark:border-black p-4">
        <div className="text-sm font-semibold text-gray-600 dark:text-gray-200 mb-3">
          目录
        </div>

        <nav className="text-sm space-y-2">
          {toc.map((item, idx) => {
            const id = item?.id || item?.blockId || item?.anchor || ''
            const title =
              item?.text || item?.title || item?.content || item?.name || ''

            // indent/level/depth 通常是 0/1/2...：0=一级，1=二级，2=三级...
            const rawIndent = item?.indent ?? item?.level ?? item?.depth ?? 0
            const indent = Number(rawIndent) || 0

            // 二级（indent=1）=> 2em；三级（2）=> 4em；最多缩进到 6em（可按需调大/取消上限）
            const indentEm = Math.min(3, Math.max(0, indent)) * 2

            return (
              <a
                key={`${id}-${idx}`}
                href={id ? `#${id}` : '#'}
                className="block leading-6 text-gray-500 dark:text-gray-400 hover:opacity-100"
                style={{
                  paddingLeft: `${indentEm}em`,
                  // 可选：让缩进看起来更“目录感”
                  textIndent: 0,
                  color: undefined
                }}
                onClick={(e) => {
                  // 用我们自己的滚动逻辑，避免 Next/浏览器默认 hash 行为失效或跳歪
                  e.preventDefault()
                  scrollToHeading(id)
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = themeColor
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = ''
                }}
              >
                {title}
              </a>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
