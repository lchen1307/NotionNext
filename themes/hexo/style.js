/* eslint-disable react/no-unknown-property */
import { siteConfig } from '@/lib/config'
import CONFIG from './config'

const Style = () => {
  const themeColor = siteConfig('HEXO_THEME_COLOR', '#928CEE', CONFIG)

  return (
    <style jsx global>{`
      :root {
        --theme-color: ${themeColor};
      }

      /* ========== 底色 ========== */
      #theme-hexo body {
        background-color: #f5f5f5;
      }
      .dark #theme-hexo body {
        background-color: black;
      }

      /* ========== 菜单下划线动画 ========== */
      #theme-hexo .menu-link {
        text-decoration: none;
        background-image: linear-gradient(
          var(--theme-color),
          var(--theme-color)
        );
        background-repeat: no-repeat;
        background-position: bottom center;
        background-size: 0 2px;
        transition: background-size 100ms ease-in-out;
      }

      #theme-hexo .menu-link:hover {
        background-size: 100% 2px;
        color: var(--theme-color);
      }

      /* ========== 文章列表标题悬浮 ========== */
      #theme-hexo h2:hover .menu-link {
        color: var(--theme-color) !important;
      }
      .dark #theme-hexo h2:hover .menu-link {
        color: var(--theme-color) !important;
      }

      /* ========== 下拉菜单悬浮背景 ========== */
      #theme-hexo li[class*='hover:bg-indigo-500']:hover {
        background-color: var(--theme-color) !important;
      }

      /* ========== Tag 悬浮 ========== */
      #theme-hexo a[class*='hover:bg-indigo-400']:hover {
        background-color: var(--theme-color) !important;
      }

      /* ========== Icon 悬浮 ========== */
      #theme-hexo i[class*='hover:text-indigo-600']:hover {
        color: var(--theme-color) !important;
      }
      .dark #theme-hexo i[class*='dark:hover:text-indigo-400']:hover {
        color: var(--theme-color) !important;
      }

      /* ========== 分页 & 高亮 ========== */
      #theme-hexo .text-indigo-400,
      #theme-hexo .text-indigo-800 {
        color: var(--theme-color) !important;
      }

      #theme-hexo .border-indigo-400,
      #theme-hexo .border-indigo-500,
      #theme-hexo .border-indigo-800 {
        border-color: var(--theme-color) !important;
      }

      #theme-hexo .bg-indigo-400,
      #theme-hexo .bg-indigo-500,
      #theme-hexo .bg-indigo-600 {
        background-color: var(--theme-color) !important;
      }

      /* ========== Header 封面渐变遮罩 ========== */
      #theme-hexo .header-cover::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(
          to bottom,
          rgba(0, 0, 0, 0.5) 0%,
          rgba(0, 0, 0, 0.2) 10%,
          rgba(0, 0, 0, 0) 25%,
          rgba(0, 0, 0, 0.2) 75%,
          rgba(0, 0, 0, 0.5) 100%
        );
      }

      /* ========== 选中文本 ========== */
      ::selection {
        background: color-mix(in srgb, var(--theme-color) 30%, transparent);
      }

      /* ========== 自定义滚动条 ========== */
      ::-webkit-scrollbar {
        width: 5px;
        height: 5px;
      }

      ::-webkit-scrollbar-thumb {
        background-color: var(--theme-color);
      }

      * {
        scrollbar-width: thin;
        scrollbar-color: var(--theme-color) transparent;
      }

      /* ========== 博客热力图 ========== */
      .react-calendar-heatmap .color-empty {
        fill: #f0f0f0;
      }
      .react-calendar-heatmap .color-github-1 {
        fill: #d6e685;
      }
      .react-calendar-heatmap .color-github-2 {
        fill: #8cc665;
      }
      .react-calendar-heatmap .color-github-3 {
        fill: #44a340;
      }
      .react-calendar-heatmap .color-github-4 {
        fill: #1e6823;
      }
    `}</style>
  )
}

export { Style }
