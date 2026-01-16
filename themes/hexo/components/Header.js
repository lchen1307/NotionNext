import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
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
 * 顶部导航（最终稳定版）
 */
const Header = props => {
  const searchDrawer = useRef()
  const { tags, currentTag, categories, currentCategory } = props
  const { locale } = useGlobal()
  const router = useRouter()

  const [isOpen, setIsOpen] = useState(false)

  const showSearchButton = siteConfig('HEXO_MENU_SEARCH', false, CONFIG)
  const showRandomButton = siteConfig('HEXO_MENU_RANDOM', false, CONFIG)

  /* =====================
     滚动控制 Header 样式
  ===================== */
  useEffect(() => {
    const handleScroll = () => {
      const nav = document.getElementById('sticky-nav')
      const header = document.getElementById('header')
      if (!nav) return

      const scrollY = window.scrollY
      const heroHeight = header?.clientHeight || 300

      if (scrollY < heroHeight - 80) {
        nav.classList.add('is-transparent')
        nav.classList.remove('is-colored')
      } else {
        nav.classList.remove('is-transparent')
        nav.classList.add('is-colored')
      }
    }

    window.addEventListener('scroll', handleScroll)
    router.events.on('routeChangeComplete', handleScroll)

    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      router.events.off('routeChangeComplete', handleScroll)
    }
  }, [router.events])

  /* =====================
     Search Drawer Slot
  ===================== */
  const searchDrawerSlot = (
    <>
      {categories && (
        <section className='mt-8'>
          <div className='text-sm flex justify-between font-light px-2'>
            <div className='text-gray-600 dark:text-gray-200'>
              <i className='mr-2 fas fa-th-list' />
              {locale.COMMON.CATEGORY}
            </div>
            <SmartLink
              href='/category'
              className='text-gray-400 hover:text-blue-400 hover:underline'>
              {locale.COMMON.MORE}
            </SmartLink>
          </div>
          <CategoryGroup
            currentCategory={currentCategory}
            categories={categories}
          />
        </section>
      )}

      {tags && (
        <section className='mt-4'>
          <div className='text-sm px-2 flex justify-between font-light'>
            <div className='text-gray-600 dark:text-gray-200'>
              <i className='mr-2 fas fa-tag' />
              {locale.COMMON.TAGS}
            </div>
            <SmartLink
              href='/tag'
              className='text-gray-400 hover:text-blue-400 hover:underline'>
              {locale.COMMON.MORE}
            </SmartLink>
          </div>
          <div className='p-2'>
            <TagGroups tags={tags} currentTag={currentTag} />
          </div>
        </section>
      )}
    </>
  )

  return (
    <div className='z-50'>
      <SearchDrawer cRef={searchDrawer} slot={searchDrawerSlot} />

      {/* =====================
          Sticky Nav
      ===================== */}
      <div
        id='sticky-nav'
        className='fixed top-0 w-full transition-all duration-300 is-transparent'>
        <div className='mx-auto max-w-7xl flex items-center justify-between px-6 py-3'>
          {/* 左侧 Logo */}
          <div className='flex items-center'>
            <Logo {...props} />
          </div>

          {/* 右侧菜单 */}
          <div className='flex items-center gap-4'>
            <div className='hidden lg:flex'>
              <MenuListTop {...props} />
            </div>

            {showSearchButton && <SearchButton />}
            {showRandomButton && <ButtonRandomPost {...props} />}

            {/* Mobile menu */}
            <div
              onClick={() => setIsOpen(!isOpen)}
              className='lg:hidden cursor-pointer'>
              <i className={isOpen ? 'fas fa-times' : 'fas fa-bars'} />
            </div>
          </div>
        </div>
      </div>

      {/* =====================
          Mobile Sidebar
      ===================== */}
      <SideBarDrawer isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <SideBar {...props} />
      </SideBarDrawer>
    </div>
  )
}

export default Header
