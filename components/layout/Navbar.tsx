"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { auth, signOut } from "@/lib/firebase";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

export default function Navbar() {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const navLinks = [
    { href: "/generate", label: "Generate" },
    { href: "/product-intel", label: "Analisis Produk" },
    { href: "/history", label: "Riwayat" },
  ];

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-[#e2e8f0] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">

          {/* ── Logo ─────────────────────────────────────────────── */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-[var(--color-brand-teal)] flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
              </div>
              <span className="text-lg font-bold text-[var(--color-brand-teal)] hidden sm:block">
                AffiliateBrain
              </span>
            </Link>

            {/* Desktop nav links */}
            {user && (
              <div className="hidden sm:flex items-center gap-1">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`relative px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-150 ${
                        isActive
                          ? "text-[var(--color-brand-teal)] bg-[var(--color-brand-teal-light)]"
                          : "text-[#475569] hover:text-[#0f172a] hover:bg-[#f1f5f9]"
                      }`}
                    >
                      {link.label}
                      {isActive && (
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[var(--color-brand-teal)] rounded-full" />
                      )}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Right: User Info ──────────────────────────────────── */}
          {user && (
            <div className="flex items-center gap-2 sm:gap-3">
              {/* User avatar + name (desktop) */}
              <div className="hidden sm:flex items-center gap-2.5">
                {user.photoURL ? (
                  <Image
                    src={user.photoURL}
                    alt={user.displayName || ""}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full border-2 border-[#e2e8f0] object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[var(--color-brand-teal)] flex items-center justify-center text-white text-xs font-bold">
                    {user.displayName?.charAt(0)?.toUpperCase() || "A"}
                  </div>
                )}
                <span className="text-sm font-medium text-[#0f172a] max-w-[120px] truncate">
                  {user.displayName || user.email}
                </span>
              </div>

              {/* Separator */}
              <div className="hidden sm:block w-px h-5 bg-[#e2e8f0]" />

              {/* Logout button */}
              <button
                onClick={handleLogout}
                className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-[var(--color-brand-coral)] hover:text-[#e04426] hover:bg-red-50 px-3 py-1.5 rounded-lg transition-all duration-150"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                </svg>
                Keluar
              </button>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="sm:hidden p-2 rounded-lg text-[#475569] hover:bg-[#f1f5f9] transition-colors"
                aria-label="Menu"
              >
                {menuOpen ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Mobile Menu ──────────────────────────────────────────── */}
      {user && menuOpen && (
        <div className="sm:hidden border-t border-[#e2e8f0] bg-white px-4 py-3 flex flex-col gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  isActive
                    ? "text-[var(--color-brand-teal)] bg-[var(--color-brand-teal-light)]"
                    : "text-[#475569] hover:text-[#0f172a] hover:bg-[#f1f5f9]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="border-t border-[#f1f5f9] mt-2 pt-2 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[var(--color-brand-teal)] flex items-center justify-center text-white text-xs font-bold shrink-0">
              {user.displayName?.charAt(0)?.toUpperCase() || "A"}
            </div>
            <span className="text-sm font-medium text-[#0f172a] truncate flex-1">
              {user.displayName || user.email}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm font-semibold text-[var(--color-brand-coral)] hover:text-[#e04426]"
            >
              Keluar
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
