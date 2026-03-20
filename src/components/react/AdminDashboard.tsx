import React from 'react';
import { Logo } from './Logo';

export function AdminDashboard() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 gap-8">
      <Logo className="w-64 h-auto" />
      <div className="glass-card p-8 text-center max-w-lg w-full space-y-6">
        <h1 className="text-2xl font-bold text-chrome">Správa webu</h1>
        <p className="text-chrome-gray">
          Obsah webu (blog, služby, nastavenia stránky) spravujete cez Keystatic CMS.
        </p>
        <a
          href="/keystatic"
          className="btn-aurora text-lg px-8 py-4 inline-flex justify-center w-full"
        >
          <span>Otvoriť Keystatic CMS</span>
        </a>
      </div>
    </div>
  );
}
