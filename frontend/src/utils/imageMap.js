// frontend/src/utils/imageMap.js

export const getPremiumImage = (name) => {
  if (!name) return '';
  if (name.includes('Armchair')) return 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=800';
  if (name.includes('Luna')) return 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?q=80&w=800';
  if (name.includes('Cushion')) return 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=800';
  // Fixed Rumi image link to a high-res terracotta aesthetic
  if (name.includes('Rumi')) return 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=800'; 
  return 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=800';
};