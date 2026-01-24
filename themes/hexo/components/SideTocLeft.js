import { siteConfig } from '@/lib/config'
import CONFIG from '../config'

/**
 * 桌面端：文章页左侧目录（放在灰底上，不占用白色card）
 * 点击目录：平滑滚动到正文锚点，并处理固定 Header 的遮挡偏移
 */
export default function SideTocLeft({ post }) {
  const toc = post?.toc || []
  if (toc.length <= 1) return null

  const themeColor = siteConfig('HEXO_THEME_COLOR', '#928CEE', CONFIG)

  // 你的 header 是 fixed 的，这里给个偏移（按你实际 header 高度调）
  // 例如 header 高 56px + 额外留白 12px => 68
  const HEADER_OFFSET = 72

  const getPaddingLeft = item => {
    const raw = item?.indent ?? item?.level ?? item?.depth ?? 0
    const level = Math.max(0, Number(raw) || 0)
    const px = level === 0 ? 0 : 32 + (level - 1) * 12
    return `${Math.min(68, px)}px`
  }

  const getId = item => item?.id || item?.blockId || item?.anchor || ''
  const getTitle = item =>
    item?.text || item?.title || item?.content || item?.name || ''

  const scrollToId = id => {
    if (!id) return

    // 1) 优先按 id 查
    let el = document.getElementById(id)

    // 2) 兜底：有些 Notion 渲染会把锚点放在 a[name] 或 data-id 上（不同版本可能不一样）
    if (!el) {
      el =
        document.querySelector(`[id="${CSS.escape(id)}"]`) ||
        document.querySelector(`[name="${CSS.escape(id)}"]`) ||
        document.querySelector(`[data-id="${CSS.escape(id)}"]`)
    }

    if (!el) return

    const rect = el.getBoundingClientRect()
    const targetY = window.scrollY + rect.top - HEADER_OFFSET

    window.scrollTo({ top: targetY, behavior: 'smooth' })

    // 更新地址栏 hash（不触发跳转）
    try {
      history.replaceState(null, '', `#${id}`)
    } catch (e) {}
  }

  return (
    <aside className='w-64'>
      <div className='rounded-2xl bg-white/80 dark:bg-hexo-black-gray/80 shadow-sm border border-gray-100 dark:border-black p-4'>
        <div className='text-sm font-semibold text-gray-600 dark:text-gray-200 mb-3'>
          目录
        </div>

        <nav className='text-sm space-y-2'>
          {toc.map((item, idx) => {
            const id = getId(item)
            const title = getTitle(item)

            return (
              <a
                key={`${id || 'toc'}-${idx}`}
                href={id ? `#${id}` : '#'}
                className='block leading-6 text-gray-500 dark:text-gray-400 hover:opacity-100'
                style={{ paddingLeft: getPaddingLeft(item) }}
                onClick={e => {
                  e.preventDefault()
                  scrollToId(id)
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = themeColor
                }}
                onMouseLeave={e => {
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
