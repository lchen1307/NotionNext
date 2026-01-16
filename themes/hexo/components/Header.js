import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import CONFIG from '../config'

import Logo from './Logo'
import { MenuListTop } from './MenuListTop'
import SearchButton from './SearchButton'
import SearchDrawer from './SearchDrawer'
import SideBar from './SideBar'
import SideBarDrawer from './SideBarDrawer'
import ButtonRandomPost from './ButtonRandomPost'

/**
 * 顶部导航 Header（最终稳定版）
 */
const Header = props => {
  const { tags, currentTag, categories, currentCategory } = props
  const { locale } = useGlobal()
  const router = useRouter()

  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const showSearchButton = siteConfig('HEXO_MENU_SEARCH', false, CONFIG)
  const showRandomButton = siteConfig('HEXO_MENU_RANDOM', false, CONFIG)

  // ===============================
  // 滚动逻辑：透明 → 紫色（不再隐藏）
  // ===============================
  useEffect(() => {
    const onScroll = () => {
      const headerEl = document.querySelector('#header')
      const threshold = headerEl ? headerEl.clientHeight - 80 : 120
      setScrolled(window.scrollY > threshold)
    }

    onScroll()
    window.addEventListener('scroll', onScroll)
    router.events.on('routeChangeComplete', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
      router.events.off('routeChangeComplete', onScroll)
    }
  }, [])

  return (
    <div id="top-nav" className="z-40">
      {/* 搜索抽屉 */}
      <SearchDrawer />

      {/* ================= Header 本体 ================= */}
      <div
        id="sticky-nav"
        className={`
          fixed top-0 left-0 w-full transition-all duration-300
          ${scrolled
            ? 'bg-[#9c93ad] shadow-md'
            : 'bg-transparent'}
        `}
        style={{ backdropFilter: scrolled ? 'blur(6px)' : 'none' }}
      >
        {/* === 和正文完全一致的宽度容器 === */}
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-center justify-between h-14">

            {/* ===== 左侧 Logo ===== */}
            <div className="flex items-center">
              <div className="text-xl font-semibold tracking-wide text-white">
                <Logo {...props} />
              </div>
            </div>

            {/* ===== 右侧菜单 ===== */}
            <div className="flex items-center gap-4 text-sm text-white">

              {/* 桌面端菜单 */}
              <div className="hidden lg:flex items-center gap-4">
                <MenuListTop
                  {...props}
                  className="
                    text-white
                    hover:text-[#5aa9ff]
                    transition-colors
                  "
                />
              </div>

              {showSearchButton && <SearchButton />}
              {showRandomButton && <ButtonRandomPost {...props} />}

              {/* 移动端菜单按钮 */}
              <div
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden cursor-pointer"
              >
                <i className={isOpen ? 'fas fa-times' : 'fas fa-bars'} />
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ================= 侧边栏 ================= */}
      <SideBarDrawer isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <SideBar {...props} />
      </SideBarDrawer>
    </div>
  )
}

export default Header
