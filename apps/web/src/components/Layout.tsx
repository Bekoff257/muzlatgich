import { Link, NavLink } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../app/auth';

const links = [
  ['/', 'Bosh sahifa'],
  ['/add', 'Yangi mijoz qo\'shish'],
  ['/active', 'Faol mijozlar'],
  ['/debtors', 'Qarzdorlar'],
  ['/my-debts', 'Mening qarzlarim'],
  ['/archive', 'Arxiv']
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();
  return (
    <div>
      <header className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between p-4">
          <Link to="/" className="font-bold text-blue-700">MUZLATGICH BOSHQARUV</Link>
          <button className="md:hidden" onClick={() => setOpen(!open)}>☰</button>
          <nav className="hidden gap-4 md:flex">{links.map(([to, label]) => <NavLink key={to} className="text-sm" to={to}>{label}</NavLink>)}</nav>
          <button onClick={logout} className="btn-secondary hidden md:block">Chiqish</button>
        </div>
        {open && <nav className="space-y-2 border-t p-4 md:hidden">{links.map(([to, label]) => <NavLink key={to} to={to} className="block" onClick={() => setOpen(false)}>{label}</NavLink>)}<button onClick={logout} className="btn-secondary w-full">Chiqish</button></nav>}
      </header>
      <main className="mx-auto max-w-7xl p-4">{children}</main>
    </div>
  );
}
