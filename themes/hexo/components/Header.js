import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
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
 * 顶部导航（固定显示，不随滚动隐藏）
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

  const searchDrawerSlot = (
    <>
      {categories && (
        <section className="mt-8">
          <div className="text-sm flex justify-between font-light px-2">
            <div className="text-gray-200">
              <i className="mr-2 fas fa-th-list" />
              {locale.COMMON.CATEGORY}
            </div>
            <SmartLink
              href="/category"
              className="text-gray-300 hover:text-white hover:underline"
            >
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
        <section className="mt-4">
          <div className="text-sm flex justify-between font-light px-2 text-gray-200">
            <div>
              <i className="mr-2 fas fa-tag" />
              {locale.COMMON.TAGS}
            </div>
            <SmartLink
              href="/tag"
              className="text-gray-300 hover:text-white hover:underline"
            >
              {locale.COMMON.MORE}
            </SmartLink>
          </div>
          <div className="p-2">
            <TagGroups tags={tags} currentTag={currentTag} />
          </div>
        </section>
      )}
    </>
  )

  return (
    <div id="top-nav" className="z-50">
      <SearchDrawer cRef={searchDrawer} slot={searchDrawerSlot} />

      {/* 固定导航栏 */}
      <header
        id="sticky-nav"
        className="
          fixed top-0 left-0 w-full z-50
          bg-[#9b92ac]/90
          backdrop-blur
          shadow-md
          text-white
        "
      >
        <div className="max-w-6xl mx-auto flex justify-between items-center px-4 py-2">
          {/* 左侧 Logo */}
          <Logo {...props} />

          {/* 右侧菜单 */}
          <div className="flex items-center space-x-3">
            <div className="hidden lg:flex">
              <MenuListTop {...props} />
            </div>

            <div
              onClick={toggleMenuOpen}
              className="lg:hidden w-8 h-8 flex items-center justify-center cursor-pointer"
            >
              <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'}`} />
            </div>

            {showSearchButton && <SearchButton />}
            {showRandomButton && <ButtonRandomPost {...props} />}
          </div>
        </div>
      </header>

      {/* 占位，防止内容被 fixed header 遮挡 */}
      <div className="h-14" />

      {/* 移动端侧边栏 */}
      <SideBarDrawer isOpen={isOpen} onClose={toggleSideBarClose}>
        <SideBar {...props} />
      </SideBarDrawer>
    </div>
  )
}

export default Header
