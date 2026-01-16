// import Image from 'next/image'
import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { loadExternalResource } from '@/lib/utils'
import { useEffect, useState } from 'react'
import CONFIG from '../config'

let wrapperTop = 0

/**
 * 首页 Hero（半屏 Banner）
 */
const Hero = props => {
  const [typed, setTyped] = useState(null)
  const { siteInfo } = props
  const { locale } = useGlobal()

  const scrollToWrapper = () => {
    window.scrollTo({ top: wrapperTop, behavior: 'smooth' })
  }

  // ===== 安全读取 GREETING_WORDS（不会再炸）=====
  const GREETING_WORDS = (siteConfig('GREETING_WORDS', '', CONFIG) || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)

  useEffect(() => {
    updateHeaderHeight()

    if (
      !typed &&
      typeof window !== 'undefined' &&
      document.getElementById('typed') &&
      GREETING_WORDS.length > 0
    ) {
      loadExternalResource('/js/typed.min.js', 'js').then(() => {
        if (window.Typed) {
          setTyped(
            new window.Typed('#typed', {
              strings: GREETING_WORDS,
              typeSpeed: 200,
              backSpeed: 100,
              backDelay: 400,
              showCursor: true,
              smartBackspace: true
            })
          )
        }
      })
    }

    window.addEventListener('resize', updateHeaderHeight)
    return () => {
      window.removeEventListener('resize', updateHeaderHeight)
    }
  }, [typed])

  function updateHeaderHeight() {
    requestAnimationFrame(() => {
      const wrapperElement = document.getElementById('wrapper')
      wrapperTop = wrapperElement?.offsetTop || 0
    })
  }

  return (
    <header
      id='header'
      style={{ zIndex: 1 }}
      className='w-full relative bg-black
                 h-[50vh] min-h-[360px] max-h-[520px]'>

      {/* 文本层 */}
      <div className='text-white absolute inset-0 flex flex-col items-center justify-center w-full'>
        {/* 站点标题 */}
        <div className='font-black text-4xl md:text-5xl shadow-text'>
          {siteInfo?.title || siteConfig('TITLE')}
        </div>

        {/* 打字欢迎语 */}
        {GREETING_WORDS.length > 0 && (
          <div className='mt-2 h-12 items-center text-center font-medium shadow-text text-lg'>
            <span id='typed' />
          </div>
        )}

        {/* 向下滚动提示 */}
        {siteConfig('HEXO_SHOW_START_READING', null, CONFIG) && (
          <div
            onClick={scrollToWrapper}
            className='cursor-pointer w-full text-center py-4 absolute bottom-6 text-white'>
            <div className='opacity-70 animate-bounce text-xs'>
              {locale.COMMON.START_READING}
            </div>
            <i className='opacity-70 animate-bounce fas fa-angle-down' />
          </div>
        )}
      </div>

      {/* 背景图 */}
      <LazyImage
        id='header-cover'
        alt={siteInfo?.title}
        src={siteInfo?.pageCover}
        className={`header-cover w-full h-full object-cover object-center ${
          siteConfig('HEXO_HOME_NAV_BACKGROUND_IMG_FIXED', null, CONFIG)
            ? 'fixed'
            : ''
        }`}
      />
    </header>
  )
}

export default Hero
