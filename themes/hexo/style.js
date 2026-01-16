/* eslint-disable react/no-unknown-property */
import { siteConfig } from '@/lib/config'
import CONFIG from './config'

/**
 * 这里的 css 样式只对当前主题生效
 * 主题客制化 css（⚠️ 只能写标准 CSS）
 */
const Style = () => {
  const themeColor = siteConfig('HEXO_THEME_COLOR', '#928CEE', CONFIG)

  return (
    <style jsx global>{`
      :root {
        --theme-color: ${themeColor};
      }

      /* =========================
         页面底色
      ========================== */
      body {
        background-color: #f5f5f5;
      }
      .dark body {
        background-color: black;
      }

      /* =========================
         菜单下划线动画
      ========================== */
      #theme-hexo .menu-link {
        text-decoration: none;
        background-image: linear-gradient(
          var(--theme-color),
          var(--theme-color)
        );
        background-repeat: no-repeat;
        background-position: bottom center;
        background-size: 0 2px;
        transition: background-size 120ms ease-in-out, color 120ms ease-in-out;
      }

      #theme-hexo .menu-link:hover {
        background-size: 100% 2px;
        color: var(--theme-color);
      }

      /* =========================
         文章列表标题悬浮颜色
      ========================== */
      #theme-hexo h2:hover .menu-link {
        color: var(--theme-color) !important;
      }
      .dark #theme-hexo h2:hover .menu-link {
        color: var(--theme-color) !important;
      }

      /* =========================
         下拉菜单 / Tag / Icon 悬浮
      ========================== */
      #theme-hexo li[class*='hover:bg-indigo-500']:hover,
      #theme-hexo a[class*='hover:bg-indigo-400']:hover,
      #theme-hexo a[class*='hover:bg-indigo-600']:hover,
      #theme-hexo div[class*='hover:bg-indigo-400']:hover,
      #theme-hexo div[class*='hover:bg-indigo-500']:hover,
      #theme-hexo .hover\\:bg-indigo-400:hover {
        background-color: var(--theme-color) !important;
        color: white !important;
      }

      #theme-hexo i[class*='hover:text-indigo-600']:hover,
      #theme-hexo div[class*='hover:text-indigo-600']:hover,
      #theme-hexo div[class*='hover:text-indigo-400']:hover {
        color: var(--theme-color) !important;
      }

      .dark #theme-hexo i[class*='dark:hover:text-indigo-400']:hover,
      .dark #theme-hexo div[class*='dark:hover:text-indigo-400']:hover {
        color: var(--theme-color) !important;
      }

      /* =========================
         分页 / 进度条 / 高亮边框
      ========================== */
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

      .dark #theme-hexo .dark\\:bg-indigo-500,
      .dark #theme-hexo .dark\\:text-indigo-400,
      .dark #theme-hexo .dark\\:border-indigo-400,
      .dark #theme-hexo .dark\\:border-white {
        background-color: var(--theme-color) !important;
        color: var(--theme-color) !important;
        border-color: var(--theme-color) !important;
      }

      /* =========================
         目录（TOC）
      ========================== */
      #theme-hexo a[class*='hover:text-indigo-800']:hover {
        color: var(--theme-color) !important;
      }

      .dark #theme-hexo .catalog-item {
        color: white !important;
        border-color: white !important;
      }

      .dark #theme-hexo .catalog-item:hover {
        color: var(--theme-color) !important;
      }

      .dark #theme-hexo .catalog-item.font-bold {
        border-color: var(--theme-color) !important;
      }

      /* =========================
         Header 封面渐变遮罩
      ========================== */
      #theme-hexo .header-cover::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(
          to bottom,
          rgba(0, 0, 0, 0.55) 0%,
          rgba(0, 0, 0, 0.25) 15%,
          rgba(0, 0, 0, 0) 35%,
          rgba(0, 0, 0, 0.25) 75%,
          rgba(0, 0, 0, 0.55) 100%
        );
        pointer-events: none;
      }

      /* =========================
         选中文本颜色
      ========================== */
      ::selection {
        background: color-mix(
          in srgb,
          var(--theme-color) 30%,
          transparent
        );
      }

      /* =========================
         自定义滚动条
      ========================== */
      ::-webkit-scrollbar {
        width: 5px;
        height: 5px;
      }

      ::-webkit-scrollbar-track {
        background: transparent;
      }

      ::-webkit-scrollbar-thumb {
        background-color: var(--theme-color);
        border-radius: 4px;
      }

      * {
        scrollbar-width: thin;
        scrollbar-color: var(--theme-color) transparent;
      }

      /* =========================
         博客热力图（react-calendar-heatmap）
      ========================== */
      .react-calendar-heatmap .color-empty {
        fill: #f0f0f0;
      }

      .react-calendar-heatmap .color-github-1 {
        fill: rgba(146, 140, 238, 0.35);
      }

      .react-calendar-heatmap .color-github-2 {
        fill: rgba(146, 140, 238, 0.55);
      }

      .react-calendar-heatmap .color-github-3 {
        fill: rgba(146, 140, 238, 0.75);
      }

      .react-calendar-heatmap .color-github-4 {
        fill: rgba(146, 140, 238, 1);
      }

      /* =========================
         其他小修饰
      ========================== */
      .tk-footer {
        opacity: 0;
      }
    `}</style>
  )
}

export { Style }
