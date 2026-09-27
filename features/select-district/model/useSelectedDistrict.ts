'use client';

import { useState } from 'react';
import { District } from '@/entities/district';

export function useSelectedDistrict(initialDistrict?: District) {
  const [selectedDistrict, setSelectedDistrict] = useState<District | undefined>(initialDistrict);

  return {
    selectedDistrict,
    setSelectedDistrict,
  };
}
