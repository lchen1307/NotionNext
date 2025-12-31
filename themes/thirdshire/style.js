// themes/thirdshire/style.js

export default `
  /* 全局字体调优 */
  body {
    font-family: 'Inter', sans-serif;
    color: #333;
  }

  /* Hero 大标题样式 */
  .hero-title {
    font-size: 3rem;
    font-weight: 700;
    text-align: center;
  }

  .hero-subtitle {
    font-size: 1.25rem;
    text-align: center;
    color: #666;
  }

  /* 文章卡片样式 */
  .post-card {
    @apply border rounded-lg shadow-md transition hover:shadow-lg;
  }

  .post-card-title {
    @apply text-xl font-semibold;
  }

  .post-card-summary {
    @apply text-sm text-gray-600;
  }
`;
