import { Link, NavLink, Outlet } from 'react-router-dom';
import Analytics from '../components/Analytics';

export default function RootLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Analytics />
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl flex-col gap-3 px-6 py-5 md:flex-row md:items-center md:justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span aria-hidden className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-blue-500 text-white">
              🌙
            </span>
            <span className="text-lg font-bold tracking-tight text-slate-900">Sleep Cycle Calculator</span>
          </Link>
          <nav className="flex flex-wrap gap-4 text-sm">
            {[
              { to: '/', label: 'Calculate' },
              { to: '/guide', label: 'Guide' },
              { to: '/faq', label: 'FAQ' },
            ].map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `font-medium transition ${
                    isActive ? 'text-indigo-700' : 'text-slate-600 hover:text-slate-900'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-8">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-6 py-6 text-xs text-slate-500">
          <p>© 2026 sleepcycle.bal.pe.kr · Informational only, not medical advice.</p>
          <nav className="mt-2 flex flex-wrap gap-3">
            <a className="underline hover:text-slate-700" href="https://bal.pe.kr">bal.pe.kr</a>
            <a className="underline hover:text-slate-700" href="https://bal.pe.kr/privacy.html">Privacy</a>
            <a className="underline hover:text-slate-700" href="https://bal.pe.kr/terms.html">Terms</a>
            <a className="underline hover:text-slate-700" href="mailto:comsamo84@gmail.com">Contact</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
