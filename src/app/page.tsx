import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { HeroSapiens } from '@/components/sections/HeroSapiens';
import { Instructors } from '@/components/sections/Instructors';
import { StickyScrollFeatures } from '@/components/sections/StickyScrollFeatures';
import { CourseList } from '@/components/sections/CourseList';
import { Features } from '@/components/sections/Features';
import { MatrixChoice } from '@/components/sections/MatrixChoice';

export default function Home() {
  return (
    <main>
      <HeroSapiens />
      <StickyScrollFeatures />
      <CourseList title="Uma ampla seleção de cursos" subtitle="Escolha entre mais de 210.000 cursos em vídeo online com novas adições publicadas mensalmente" />
      <Features />
      <MatrixChoice />
      <Instructors />
    </main>
  );
}
