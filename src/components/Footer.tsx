import Link from 'next/link';
import NewsletterModule from './NewsletterModule';

const footerLinks = {
  sections: [
    { name: 'Politics', href: '/category/politics' },
    { name: 'Business', href: '/category/business' },
    { name: 'Technology', href: '/category/technology' },
    { name: 'World', href: '/category/world' },
    { name: 'Opinion', href: '/category/opinion' },
  ],
  company: [
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Careers', href: '/careers' },
    { name: 'Advertise', href: '/advertise' },
  ],
  legal: [
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Cookie Policy', href: '/cookies' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-6xl mx-auto px-4 lg:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand and Newsletter */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block">
              <span className="text-xl font-serif font-bold text-white tracking-tight">
                NewsFlow
              </span>
            </Link>
            <p className="mt-3 text-sm text-gray-400 leading-relaxed">
              In-depth coverage and analysis of the stories that matter most.
            </p>
            <div className="mt-6 max-w-xs">
              <NewsletterModule variant="footer" />
            </div>
          </div>

          {/* Sections */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Sections
            </h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.sections.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Company
            </h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Legal
            </h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-sm text-gray-500 text-center">
            © {new Date().getFullYear()} NewsFlow. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
