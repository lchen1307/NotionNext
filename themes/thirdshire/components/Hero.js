// themes/thirdshire/components/Hero.js
export default function Hero({ config }) {
  return (
    <section className="py-16 bg-gray-100">
      <h1 className="hero-title">{config.heroTitle}</h1>
      <p className="hero-subtitle mt-2">{config.heroSubtitle}</p>
    </section>
  );
}
