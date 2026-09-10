const STORAGE_KEY = 'rpsf_hero_images';

export const DEFAULT_HERO_IMAGES = [
  '/hero1.jpg',
  '/hero2.jpg',
  '/hero3.jpg',
  '/hero4.jpg',
  '/hero5.jpg',
];

export function getHeroImages() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error loading hero images from localStorage', e);
  }
  return DEFAULT_HERO_IMAGES;
}

export function saveHeroImages(images) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(images));
    window.dispatchEvent(new CustomEvent('rpsf_hero_images_updated', { detail: images }));
  } catch (e) {
    console.error('Error saving hero images to localStorage', e);
  }
}

export function resetHeroImages() {
  saveHeroImages(DEFAULT_HERO_IMAGES);
}
