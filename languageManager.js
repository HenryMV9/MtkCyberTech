import { translations } from './translations.js';

export class LanguageManager {
  constructor() {
    this.currentLanguage = this.detectLanguage();
    this.subscribers = [];
  }

  detectLanguage() {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage && translations[savedLanguage]) {
      return savedLanguage;
    }

    const browserLanguage = navigator.language || navigator.userLanguage;
    const languageCode = browserLanguage.split('-')[0];

    const languageMap = {
      'en': 'en',
      'fr': 'fr',
      'es': 'es',
      'ar': 'ar',
      'de': 'de',
      'pt': 'pt',
      'zh': 'zh'
    };

    return languageMap[languageCode] || 'en';
  }

  setLanguage(languageCode) {
    if (!translations[languageCode]) {
      console.error(`Language ${languageCode} not supported`);
      return false;
    }

    this.currentLanguage = languageCode;
    localStorage.setItem('preferredLanguage', languageCode);

    const htmlElement = document.documentElement;
    htmlElement.setAttribute('lang', languageCode);
    htmlElement.setAttribute('dir', translations[languageCode].dir);

    this.updateHreflangTags();

    this.notifySubscribers();
    return true;
  }

  getCurrentLanguage() {
    return this.currentLanguage;
  }

  getTranslation(path) {
    const keys = path.split('.');
    let value = translations[this.currentLanguage];

    for (const key of keys) {
      if (value && typeof value === 'object') {
        value = value[key];
      } else {
        return path;
      }
    }

    return value || path;
  }

  translate(key) {
    return this.getTranslation(key);
  }

  getSupportedLanguages() {
    return Object.keys(translations).map(code => ({
      code,
      name: translations[code].name,
      flag: translations[code].flag
    }));
  }

  subscribe(callback) {
    this.subscribers.push(callback);
  }

  unsubscribe(callback) {
    this.subscribers = this.subscribers.filter(sub => sub !== callback);
  }

  notifySubscribers() {
    this.subscribers.forEach(callback => callback(this.currentLanguage));
  }

  updateHreflangTags() {
    const existingTags = document.querySelectorAll('link[rel="alternate"]');
    existingTags.forEach(tag => tag.remove());

    const head = document.head;
    const baseUrl = window.location.origin + window.location.pathname;

    Object.keys(translations).forEach(langCode => {
      const link = document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = langCode;
      link.href = `${baseUrl}?lang=${langCode}`;
      head.appendChild(link);
    });

    const xDefaultLink = document.createElement('link');
    xDefaultLink.rel = 'alternate';
    xDefaultLink.hreflang = 'x-default';
    xDefaultLink.href = baseUrl;
    head.appendChild(xDefaultLink);
  }

  updateMetaTags() {
    const descriptionMeta = document.querySelector('meta[name="description"]');
    if (descriptionMeta) {
      descriptionMeta.content = this.translate('hero.description');
    }

    const titleElement = document.querySelector('title');
    if (titleElement) {
      const brandName = 'MtkCyberTech Support';
      titleElement.textContent = `${brandName} | ${this.translate('footer.tagline')}`;
    }
  }

  translateElement(element) {
    const translationKey = element.getAttribute('data-i18n');
    if (!translationKey) return;

    const translation = this.getTranslation(translationKey);

    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
      if (element.hasAttribute('placeholder')) {
        element.placeholder = translation;
      }
    } else {
      element.textContent = translation;
    }
  }

  translatePage() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => this.translateElement(element));

    this.updateMetaTags();
  }
}

export const languageManager = new LanguageManager();
