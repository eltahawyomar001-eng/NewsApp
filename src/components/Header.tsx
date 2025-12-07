'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import { Menu, X, Crown } from 'lucide-react';

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Politics', href: '/category/politics' },
  { name: 'Business', href: '/category/business' },
  { name: 'Technology', href: '/category/technology' },
  { name: 'World', href: '/category/world' },
  { name: 'Opinion', href: '/category/opinion' },
];

export default function Header() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <span className="text-xl font-serif font-bold text-gray-900 tracking-tight">
              NewsFlow
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-3">
            {session ? (
              <>
                {session.user.role === 'ADMIN' || session.user.role === 'EDITOR' ? (
                  <Link
                    href="/admin"
                    className="hidden sm:inline-flex text-sm font-medium text-gray-600 hover:text-gray-900"
                  >
                    Dashboard
                  </Link>
                ) : null}
                <button
                  onClick={() => signOut()}
                  className="text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link
                href="/signin"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Sign in
              </Link>
            )}
            <Link
              href="/membership"
              className="hidden sm:inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
            >
              <Crown className="w-3.5 h-3.5 mr-1.5" />
              Get Premium
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href="/membership"
                className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors mt-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Crown className="w-3.5 h-3.5 mr-1.5" />
                Get Premium
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
