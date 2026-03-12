"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-4">
        <Link href="/cart" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-green-700 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20C19 20 22 3 22 3c-1 2-8 2-8 2s-1 5-7 7c0 0 .14-.49.37-1.25A12.23 12.23 0 0117 8z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-green-800 leading-none">Ecoyaan</p>
            <p className="text-[9px] text-green-600 leading-none mt-0.5">Sustainability made easy</p>
          </div>
        </Link>

        <div className="flex-1" />

        <button className="text-gray-400 hover:text-red-400 transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        <button className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900">
          <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <span className="hidden sm:inline text-xs text-gray-500">Log in</span>
        </button>
      </div>
    </header>
  );
}
