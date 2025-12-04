import Image from 'next/image';
import Link from 'next/link';
import { JSX } from 'react';
import { GlobalProvider } from '@/contexts/global-provider';
import ThemeSwitch from '@/components/theme-switch';
import '@/styles/home.css';

export default function Home(): JSX.Element {
  return (
    <GlobalProvider>
      <div className="page">
        <header className="header">
          <nav className="nav">
            <ul className="nav-list">
              <li className="nav-item"><Link href="/">home</Link></li>
              <li className="nav-item"><Link href="/posts">posts</Link></li>
              <li className="nav-item"><Link href="/audio">audio</Link></li>
            </ul>
          </nav>
        </header>
        <main className="main">
          <div className="switch-container">
            <ThemeSwitch />
          </div>
          <div className="content">
            <Image
              src='/been.png'
              alt="been"
              width={480}
              height={420}
              className="opacity-60"
            />
          </div>
        </main>
      </div>
    </GlobalProvider>
  );
}
