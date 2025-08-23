import * as React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { 
  Heart, 
  Phone, 
  Mail, 
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin
} from 'lucide-react'

const footerNavigation = {
  services: [
    { name: 'Personal Care', href: '/services/personal-care' },
    { name: 'Companionship', href: '/services/companionship' },
    { name: 'Meal Preparation', href: '/services/meal-preparation' },
    { name: 'Transportation', href: '/services/transportation' },
    { name: 'Specialized Care', href: '/services/specialized-care' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Our Team', href: '/team' },
    { name: 'Careers', href: '/careers' },
    { name: 'News & Updates', href: '/news' },
    { name: 'Contact', href: '/contact' },
  ],
  resources: [
    { name: 'Care Assessment', href: '/assessment' },
    { name: 'Insurance Guide', href: '/insurance' },
    { name: 'Family Resources', href: '/resources' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Blog', href: '/blog' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'HIPAA Notice', href: '/hipaa' },
    { name: 'Accessibility', href: '/accessibility' },
  ],
}

const socialLinks = [
  {
    name: 'Facebook',
    href: 'https://facebook.com/caringcompass',
    icon: Facebook,
  },
  {
    name: 'Twitter',
    href: 'https://twitter.com/caringcompass',
    icon: Twitter,
  },
  {
    name: 'Instagram',
    href: 'https://instagram.com/caringcompass',
    icon: Instagram,
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com/company/caringcompass',
    icon: Linkedin,
  },
]

export function SiteFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-background">
      <div className="container-responsive">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-8 py-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-caring">
                <Heart className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold">Caring Compass</span>
            </div>
            
            <p className="mt-4 text-sm text-muted-foreground">
              Providing compassionate home care services that honor your desire to age in place 
              with dignity and independence. Serving the Hampton Roads area with excellence 
              since 2024.
            </p>
            
            <div className="mt-6 space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <Link href="tel:+1-757-555-0123" className="hover:text-primary">
                  (757) 555-0123
                </Link>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <Link href="mailto:info@caringcompass.com" className="hover:text-primary">
                  info@caringcompass.com
                </Link>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  Virginia Beach, VA 23451
                </span>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-6 flex space-x-4">
              {socialLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-muted-foreground transition-colors hover:text-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold">Services</h3>
            <ul className="mt-4 space-y-2">
              {footerNavigation.services.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold">Company</h3>
            <ul className="mt-4 space-y-2">
              {footerNavigation.company.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold">Resources</h3>
            <ul className="mt-4 space-y-2">
              {footerNavigation.resources.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator />

        {/* Bottom Footer */}
        <div className="flex flex-col items-center justify-between space-y-4 py-6 md:flex-row md:space-y-0">
          <div className="flex flex-col space-y-2 text-center text-sm text-muted-foreground md:flex-row md:space-x-4 md:space-y-0">
            <span>
              © {currentYear} Caring Compass Home Care LLC. All rights reserved.
            </span>
            <span className="hidden md:inline">•</span>
            <span>Licensed • Bonded • Insured</span>
          </div>

          <div className="flex flex-wrap justify-center space-x-4 text-sm md:justify-end">
            {footerNavigation.legal.map((item, index) => (
              <React.Fragment key={item.name}>
                <Link
                  href={item.href}
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  {item.name}
                </Link>
                {index < footerNavigation.legal.length - 1 && (
                  <span className="text-muted-foreground">•</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Emergency Notice */}
        <div className="border-t bg-muted/30 py-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              <strong>24/7 Emergency Support:</strong> If you have a care emergency, 
              please call{' '}
              <Link href="tel:+1-757-555-0911" className="font-medium text-primary hover:underline">
                (757) 555-0911
              </Link>{' '}
              or dial 911 for immediate assistance.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}