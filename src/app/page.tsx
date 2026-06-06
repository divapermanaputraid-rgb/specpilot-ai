import { HeroSection } from '@/features/landing/HeroSection';
import { WorkflowSection } from '@/features/landing/WorkflowSection';
import { PrdPreviewSection } from '@/features/landing/PrdPreviewSection';
import { CTASection } from '@/features/landing/CTASection';

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center">
      <HeroSection />
      <WorkflowSection />
      <PrdPreviewSection />
      <CTASection />
    </div>
  );
}