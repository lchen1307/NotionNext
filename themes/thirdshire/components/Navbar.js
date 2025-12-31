// themes/thirdshire/components/Navbar.js
export default function Navbar({ config }) {
  return (
    <nav className="flex items-center justify-between py-4 px-6 bg-white shadow-sm sticky top-0 z-50">
      <div className="text-lg font-bold">{config.siteTitle}</div>
      <div className="flex gap-6 text-md">
        {config.navLinks.map((link) => (
          <a key={link.text} href={link.href} className="hover:text-indigo-600">
            {link.text}
          </a>
        ))}
      </div>
    </nav>
  );
}
