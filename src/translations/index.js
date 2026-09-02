import en from './en';
import hi from './hi';
import as from './as';
import bn from './bn';
import mni from './mni';
import brx from './brx';

export const TRANSLATIONS = {
  en,
  hi,
  as,
  bn,
  mni,
  brx,
};

export const LANGUAGES = [
  {
    id: 'en',
    name: 'English',
    nativeName: 'English',
    region: 'Universal / National',
    icon: 'globe-outline',
  },
  {
    id: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    region: 'National Official',
    icon: 'chatbubbles-outline',
  },
  {
    id: 'as',
    name: 'Assamese',
    nativeName: 'অসমীয়া',
    region: 'Assam & Brahmaputra Valley',
    icon: 'language-outline',
  },
  {
    id: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    region: 'Tripura & Barak Valley',
    icon: 'book-outline',
  },
  {
    id: 'mni',
    name: 'Manipuri',
    nativeName: 'ꯃꯤꯇꯩꯂꯣꯟ',
    region: 'Manipur & Imphal Valley',
    icon: 'shield-outline',
  },
  {
    id: 'brx',
    name: 'Bodo',
    nativeName: 'बड़ो',
    region: 'Bodoland Territorial Region',
    icon: 'compass-outline',
  },
];

export const getTranslation = (lang = 'en', key) => {
  const currentLangObj = TRANSLATIONS[lang] || TRANSLATIONS.en;
  if (currentLangObj && currentLangObj[key]) {
    return currentLangObj[key];
  }
  // Fallback to English
  if (TRANSLATIONS.en && TRANSLATIONS.en[key]) {
    return TRANSLATIONS.en[key];
  }
  return key;
};
