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
 * 顶部导航栏
 * 行为：
 * 1. Hero 内：透明 + 白字
 * 2. Hero 外：紫色背景 + 白字 + 阴影
 * 3. 永远显示（不隐藏）
 */
const Header = props => {
  const searchDrawer = useRef()
  const { tags, currentTag, categories, currentCategory } = props
  const { locale } = useGlobal()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const showSearchButton = siteConfig('HEXO_MENU_SEARCH', false, CONFIG)
  const showRandomButton = siteConfig('HEXO_MENU_RANDOM', false, CONFIG)

  const toggleMenuOpen = () => setIsOpen(!isOpen)
  const toggleSideBarClose = () => setIsOpen(false)

  const throttleMs = 100

  const handleScrollStyle = useCallback(
    throttle(() => {
      const nav = document.querySelector('#sticky-nav')
      const header = document.querySelector('#header')
      if (!nav) return

      const scrollY = window.scrollY
      const inHero =
        header && scrollY < header.clientHeight - 50

      if (inHero) {
        // Hero 区域：透明
        nav.classList.remove(
          'bg-[#9b93aa]',
          'shadow-md'
        )
        nav.classList.add(
          'bg-transparent',
          'text-white'
        )
      } else {
        // 离开 Hero：紫色
        nav.classList.remove(
          'bg-transparent'
        )
        nav.classList.add(
          'bg-[#9b93aa]',
          'text-white',
          'shadow-md'
        )
      }
    }, throttleMs),
    []
  )

  useEffect(() => {
    handleScrollStyle()
    window.addEventListener('scroll', handleScrollStyle)
    router.events.on('routeChangeComplete', handleScrollStyle)

    return () => {
      window.removeEventListener('scroll', handleScrollStyle)
      router.events.off('routeChangeComplete', handleScrollStyle)
    }
  }, [])

  const searchDrawerSlot = (
    <>
      {categories && (
        <section className='mt-8'>
          <div className='text-sm flex justify-between px-2'>
            <div className='text-white'>
              <i className='mr-2 fas fa-th-list' />
              {locale.COMMON.CATEGORY}
            </div>
            <SmartLink
              href='/category'
              className='text-white/80 hover:underline'>
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
          <div className='text-sm px-2 flex justify-between'>
            <div className='text-white'>
              <i className='mr-2 fas fa-tag' />
              {locale.COMMON.TAGS}
            </div>
            <SmartLink
              href='/tag'
              className='text-white/80 hover:underline'>
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
    <div id='top-nav' className='z-50'>
      <SearchDrawer cRef={searchDrawer} slot={searchDrawerSlot} />

      {/* 顶部导航 */}
      <div
        id='sticky-nav'
        className='fixed top-0 w-full transition-all duration-300 bg-transparent text-white z-40'>
        <div className='flex justify-between items-center px-6 py-3'>
          <Logo {...props} />

          <div className='flex items-center gap-3'>
            <div className='hidden lg:flex'>
              <MenuListTop {...props} />
            </div>

            <div
              onClick={toggleMenuOpen}
              className='lg:hidden cursor-pointer'>
              {isOpen ? (
                <i className='fas fa-times' />
              ) : (
                <i className='fas fa-bars' />
              )}
            </div>

            {showSearchButton && <SearchButton />}
            {showRandomButton && <ButtonRandomPost {...props} />}
          </div>
        </div>
      </div>

      <SideBarDrawer isOpen={isOpen} onClose={toggleSideBarClose}>
        <SideBar {...props} />
      </SideBarDrawer>
    </div>
  )
}

export default Header
