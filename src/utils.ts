export const cleanImageUrl = (url: string): string => {
  if (!url) return 'https://ui-avatars.com/api/?name=No+Image&background=e2e8f0&color=64748b&size=400';
  let cleaned = url.replace(/^\[?"?\\?"?/g, '').replace(/"?\\?"?\]?$/g, '');
  cleaned = cleaned.replace(/^"|"$/g, '');
  if (!cleaned.startsWith('http')) {
    return 'https://ui-avatars.com/api/?name=No+Image&background=e2e8f0&color=64748b&size=400';
  }
  return cleaned;
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
};
