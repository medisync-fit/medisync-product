const FOOTER_COLUMNS = [
  {
    title: 'Product',
    links: ['Features', 'Pricing', 'Download', 'Changelog'],
  },
  {
    title: 'Company',
    links: ['About', 'Blog', 'Careers', 'Contact'],
  },
  {
    title: 'Legal',
    links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'],
  },
]

export default function Footer() {
  return (
    <footer className="bg-navy-900 border-t border-brand/20 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <a href="#" className="flex items-center gap-2">
              <svg
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="10" y="2" width="8" height="24" rx="4" fill="#72A8E8" />
                <rect x="2" y="10" width="24" height="8" rx="4" fill="#72A8E8" />
              </svg>
              <span className="font-display font-semibold text-white text-lg">
                MediSync
              </span>
            </a>
            <p className="text-text-secondary text-sm mt-3">
              Future-ready health &amp; safety.
            </p>
            <p className="text-text-secondary text-xs mt-4">
              &copy; 2025 MediSync. All rights reserved.
            </p>
          </div>

          {/* Link columns */}
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-white text-sm font-semibold mb-4 font-display">
                {col.title}
              </h4>
              <ul>
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-text-secondary text-sm hover:text-brand transition-colors block mb-2"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-brand/10 mt-12 pt-6 flex justify-between items-center flex-wrap gap-4">
          <span className="text-text-secondary text-xs">
            Built with ❤️ for healthier families
          </span>
          <div className="flex items-center gap-3">
            {/* Twitter/X */}
            <a
              href="#"
              className="w-9 h-9 rounded-xl bg-navy-700 hover:bg-brand/20 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Twitter"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-text-secondary"
              >
                <path d="M4 4l11.733 16h4.267l-11.733 -16h-4.267z" />
                <path d="M4 20l6.768 -6.768" />
                <path d="M20 4l-6.768 6.768" />
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href="#"
              className="w-9 h-9 rounded-xl bg-navy-700 hover:bg-brand/20 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="LinkedIn"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-text-secondary"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>

            {/* Instagram */}
            <a
              href="#"
              className="w-9 h-9 rounded-xl bg-navy-700 hover:bg-brand/20 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Instagram"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-text-secondary"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
