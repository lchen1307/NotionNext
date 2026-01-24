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
            const indent = item?.indent ?? item?.level ?? item?.depth ?? 0

            // NotionNext 通常 headings 会有对应的 #id
            return (
              <a
                key={`${id}-${idx}`}
                href={id ? `#${id}` : '#'}
                className="block leading-6 text-gray-500 dark:text-gray-400 hover:opacity-100"
                style={{
                  paddingLeft: `${Math.min(4, Number(indent) || 0) * 12}px`,
                  color: undefined
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
