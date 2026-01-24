import { siteConfig } from '@/lib/config'
import CONFIG from '../config'

/**
 * 桌面端：文章页左侧目录（放在灰底上，不占用白色card）
 * 依赖 post.toc（NotionNext 会给 toc 数组）
 */
export default function SideTocLeft({ post }) {
  const toc = post?.toc || []
  if (toc.length <= 1) return null

  const themeColor = siteConfig('HEXO_THEME_COLOR', '#928CEE', CONFIG)

  // 生成缩进：让 2.1/2.2/2.3 这类二级标题更明显缩进（约 2em）
  const getPaddingLeft = item => {
    const raw = item?.indent ?? item?.level ?? item?.depth ?? 0
    const level = Math.max(0, Number(raw) || 0)
    // level=0 不缩进；level>=1 统一缩进 2em（≈32px）；更深层继续加
    const px = level === 0 ? 0 : 32 + (level - 1) * 12
    return `${Math.min(68, px)}px`
  }

  // 尽量兼容 NotionNext 的 toc 字段
  const getId = item => item?.id || item?.blockId || item?.anchor || ''

  const getTitle = item =>
    item?.text || item?.title || item?.content || item?.name || ''

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
                style={{
                  paddingLeft: getPaddingLeft(item)
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
