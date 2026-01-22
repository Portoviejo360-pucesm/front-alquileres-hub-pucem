// components/ui/Skeleton.tsx

import React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width,
  height,
  borderRadius = '8px',
  style,
  className = '',
  ...props
}) => {
  const skeletonStyle: React.CSSProperties = {
    width: width || '100%',
    height: height || '20px',
    borderRadius,
    backgroundColor: '#e5e7eb',
    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    ...style
  };

  return (
    <div
      className={`skeleton ${className}`}
      style={skeletonStyle}
      {...props}
    />
  );
};

export default Skeleton;
