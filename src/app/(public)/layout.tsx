// app/(public)/layout.tsx

import PublicTopBar from '@/components/layout/PublicTopBar';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="public-container">
      <PublicTopBar />
      {children}
    </div>
  );
}