import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import throttle from 'lodash.throttle'
import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useRef, useState } from 'react'
import CONFIG from '../config'
import ButtonRandomPost from './ButtonRandomPost'
import CategoryGroup from './CategoryGroup'
import Logo from './Logo'
import { MenuListTop } from './MenuListTop'
import SearchButton from './SearchButton'
import SearchDrawer from './SearchDrawer'
import SideBar from './SideBar'
import SideBarDrawer from './SideBarDrawer'
import TagGroups from './TagGroups'

/**
 * 顶部导航 Header
 * 行为：
 * 1. 顶部透明（Hero 内）
 * 2. 滚动后变紫色
 * 3. 始终显示，不隐藏
 */
const Header = props => {
  const searchDrawer = useRef()
  const { tags, currentTag, categories, currentCategory } = props
  const { locale } = useGlobal()
  const router = useRouter()
  const [isOpen, setOpen] = useState(false)

  const showSearchButton = siteConfig('HEXO_MENU_SEARCH', false, CONFIG)
  const showRandomButton = siteConfig('HEXO_MENU_RANDOM', false, CONFIG)

  const toggleMenuOpen = () => setOpen(!isOpen)
  const closeMenu = () => setOpen(false)

  /**
   * Header 样式控制（透明 ↔ 紫色）
   */
  const handleScroll = useCallback(
    throttle(() => {
      const nav = document.getElementById('sticky-nav')
      const header = document.getElementById('header')
      const scrollY = window.scrollY

      const inHero =
        header && scrollY < header.clientHeight - 80

      if (inHero) {
        nav.classList.remove('bg-purple-header', 'shadow-md')
        nav.classList.add('bg-transparent')
      } else {
        nav.classList.remove('bg-transparent')
        nav.classList.add('bg-purple-header', 'shadow-md')
      }
    }, 100),
    []
  )

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    router.events.on('routeChangeComplete', handleScroll)
    handleScroll()
    return () => {
      window.removeEventListener('scroll', handleScroll)
      router.events.off('routeChangeComplete', handleScroll)
    }
  }, [])

  /**
   * 搜索抽屉内容（保持你原来的）
   */
  const searchDrawerSlot = (
    <>
      {categories && (
        <section className='mt-8'>
          <CategoryGroup
            currentCategory={currentCategory}
            categories={categories}
          />
        </section>
      )}
      {tags && (
        <section className='mt-4'>
          <TagGroups tags={tags} currentTag={currentTag} />
        </section>
      )}
    </>
  )

  return (
    <header className='fixed top-0 z-50 w-full'>
      <SearchDrawer cRef={searchDrawer} slot={searchDrawerSlot} />

      <nav
        id='sticky-nav'
        className='transition-all duration-300 bg-transparent text-white'
        style={{ backdropFilter: 'blur(6px)' }}
      >
        {/* 🔥 核心：宽度对齐正文 */}
        <div className='max-w-5xl mx-auto flex items-center justify-between px-6 py-3'>
          
          {/* 左侧 Logo */}
          <div className='text-lg font-semibold tracking-wide'>
            <Logo {...props} />
          </div>

          {/* 右侧菜单 */}
          <div className='flex items-center space-x-6 text-sm'>
            <div className='hidden lg:flex items-center space-x-6'>
              <MenuListTop {...props} />
            </div>

            {showSearchButton && <SearchButton />}
            {showRandomButton && <ButtonRandomPost {...props} />}

            <div
              onClick={toggleMenuOpen}
              className='lg:hidden cursor-pointer'
            >
              <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'}`} />
            </div>
          </div>
        </div>
      </nav>

      <SideBarDrawer isOpen={isOpen} onClose={closeMenu}>
        <SideBar {...props} />
      </SideBarDrawer>
    </header>
  )
}

export default Header
