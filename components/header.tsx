"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Menu, Phone, Globe, User, LogOut, Settings } from "lucide-react"
import { motion } from "framer-motion"
import { useLanguage } from "@/lib/language-context"
import { useAuth } from "@/contexts/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
  const { user, signOut } = useAuth()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const { language, setLanguage, t } = useLanguage()

  const navigation = [
    { name: t.nav.home, href: "/" },
    { name: t.nav.services, href: "/#services" },
    { name: t.nav.destinations, href: "/#destinations" },
    { name: t.nav.about, href: "/about" },
    { name: t.nav.pricing, href: "/pricing" },
    { name: t.nav.contact, href: "/contact" },
  ]

  const mobileMenuVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  return (
    <motion.header 
      key={pathname}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Kefko Travel Agent - Let's Fly Together"
              width={160}
              height={80}
              className="h-12 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navigation.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
                >
                  {item.name}
                  <motion.span
                    className="absolute -bottom-1 left-0 h-0.5 bg-primary w-0 group-hover:w-full transition-all duration-300"
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                  />
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Globe className="h-4 w-4" />
                  <span className="font-medium">{language === "en" ? "EN" : "አማ"}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLanguage("en")} className={language === "en" ? "bg-muted" : ""}>
                  <span className="mr-2">🇺🇸</span> English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("am")} className={language === "am" ? "bg-muted" : ""}>
                  <span className="mr-2">🇪🇹</span> አማርኛ
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Auth Buttons */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="h-4 w-4" />
                    <span className="font-medium">{user?.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={user?.role === 'ADMIN' || user?.role === 'AGENT' ? '/dashboard' : '/bookings'}>
                      <User className="h-4 w-4 mr-2" />
                      {user?.role === 'ADMIN' || user?.role === 'AGENT' ? 'Dashboard' : 'My Bookings'}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <Settings className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth/signin">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </div>
            )}
            
            <a href="tel:+251925791588" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <Phone className="h-4 w-4" />
              <span>+251 925 79 15 88</span>
            </a>
            <Link href="/">
              <Button>{t.nav.bookNow}</Button>
            </Link>
          </div>

          {/* Mobile Menu */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* Mobile Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Globe className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLanguage("en")} className={language === "en" ? "bg-muted" : ""}>
                  <span className="mr-2">🇺🇸</span> English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("am")} className={language === "am" ? "bg-muted" : ""}>
                  <span className="mr-2">🇪🇹</span> አማርኛ
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 mt-8">
                  <Link href="/" className="flex items-center" onClick={() => setIsOpen(false)}>
                    <Image
                      src="/logo.png"
                      alt="Kefko Travel Agent - Let's Fly Together"
                      width={140}
                      height={50}
                      className="h-14 w-auto object-contain"
                    />
                  </Link>
                  <nav className="flex flex-col gap-4">
                    {navigation.map((item, index) => (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Link
                          key={item.name}
                          href={item.href}
                          className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors block py-2 relative group"
                          onClick={() => setIsOpen(false)}
                        >
                          {item.name}
                          <motion.span
                            className="absolute -bottom-1 left-0 h-0.5 bg-primary w-0 group-hover:w-full transition-all duration-300"
                            initial={{ width: 0 }}
                            whileHover={{ width: "100%" }}
                          />
                        </Link>
                      </motion.div>
                    ))}
                  </nav>
                  <div className="flex flex-col gap-4 pt-4 border-t">
                    <a href="tel:+251925791588" className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>+251 925 79 15 88</span>
                    </a>
                    <Link href="/" className="w-full">
                      <Button className="w-full" onClick={() => setIsOpen(false)}>{t.nav.bookNow}</Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  )
}
