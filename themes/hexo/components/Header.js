import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import CONFIG from '../config'

import Logo from './Logo'
import { MenuListTop } from './MenuListTop'
import SearchButton from './SearchButton'
import SearchDrawer from './SearchDrawer'
import SideBar from './SideBar'
import SideBarDrawer from './SideBarDrawer'
import ButtonRandomPost from './ButtonRandomPost'

const Header = props => {
  const router = useRouter()
  const { locale } = useGlobal()

  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const showSearchButton = siteConfig('HEXO_MENU_SEARCH', false, CONFIG)
  const showRandomButton = siteConfig('HEXO_MENU_RANDOM', false, CONFIG)

  useEffect(() => {
    const onScroll = () => {
      const header = document.querySelector('#sticky-nav')
      const threshold = header ? header.clientHeight - 80 : 120
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
      <SearchDrawer />

      {/* ===== Header 本体（全宽背景） ===== */}
      <div
        id="sticky-nav"
        className={`
          fixed top-0 left-0 w-full transition-all duration-300
          ${scrolled ? 'bg-[#9c93ad] shadow-md' : 'bg-transparent'}
        `}
        style={{ backdropFilter: scrolled ? 'blur(6px)' : 'none' }}
      >
        {/* ===== 内容对齐容器（与 Card 完全一致） ===== */}
        <div className="mx-auto max-w-5xl px-6 md:px-10">
          <div className="flex items-center justify-between h-14">

            {/* 左侧 Logo */}
            <div className="text-xl font-semibold text-white">
              <Logo {...props} />
            </div>

            {/* 右侧菜单 */}
            <div className="flex items-center gap-4 text-sm text-white">
              <div className="hidden lg:flex items-center gap-4">
                <MenuListTop
                  {...props}
                  className="hover:text-[#5aa9ff] transition-colors"
                />
              </div>

              {showSearchButton && <SearchButton />}
              {showRandomButton && <ButtonRandomPost {...props} />}

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

      {/* ===== 侧边栏 ===== */}
      <SideBarDrawer isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <SideBar {...props} />
      </SideBarDrawer>
    </div>
  )
}

export default Header
