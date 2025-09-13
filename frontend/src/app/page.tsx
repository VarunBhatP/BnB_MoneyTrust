'use client';

import dynamic from 'next/dynamic';
import { 
  Header, 
  Footer, 
  Hero, 
  Features, 
  Stats, 
  HowItWorks, 
  CTA 
} from '@/components';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <Features />
        <Stats />
        <HowItWorks />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
