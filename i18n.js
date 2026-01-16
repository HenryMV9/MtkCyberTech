import { languageManager } from './languageManager.js';

export function initializeI18n() {
  languageManager.setLanguage(languageManager.getCurrentLanguage());

  const urlParams = new URLSearchParams(window.location.search);
  const langParam = urlParams.get('lang');
  if (langParam && languageManager.getSupportedLanguages().find(l => l.code === langParam)) {
    languageManager.setLanguage(langParam);
  }

  languageManager.subscribe(() => {
    updatePageContent();
  });

  updatePageContent();
  initLanguageSelector();
  languageManager.updateHreflangTags();
}

function initLanguageSelector() {
  const selector = document.querySelector('.language-selector');
  const btn = document.querySelector('.language-selector-btn');
  const dropdown = document.querySelector('.language-selector-dropdown');

  if (!selector || !btn || !dropdown) return;

  const languages = languageManager.getSupportedLanguages();
  const currentLang = languageManager.getCurrentLanguage();

  languages.forEach(lang => {
    const li = document.createElement('li');
    li.className = 'language-option';
    li.setAttribute('role', 'option');
    li.setAttribute('data-lang', lang.code);
    li.setAttribute('tabindex', '0');
    li.innerHTML = `
      <span class="language-flag">${lang.flag}</span>
      <span class="language-name">${lang.name}</span>
    `;

    if (lang.code === currentLang) {
      li.classList.add('selected');
      li.setAttribute('aria-selected', 'true');
    }

    li.addEventListener('click', () => selectLanguage(lang.code));
    li.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectLanguage(lang.code);
      }
    });

    dropdown.appendChild(li);
  });

  updateCurrentLanguageDisplay();

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleDropdown();
  });

  btn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleDropdown();
    } else if (e.key === 'Escape') {
      closeDropdown();
    }
  });

  document.addEventListener('click', (e) => {
    if (!selector.contains(e.target)) {
      closeDropdown();
    }
  });
}

function toggleDropdown() {
  const selector = document.querySelector('.language-selector');
  const isExpanded = selector.getAttribute('aria-expanded') === 'true';

  if (isExpanded) {
    closeDropdown();
  } else {
    openDropdown();
  }
}

function openDropdown() {
  const selector = document.querySelector('.language-selector');
  selector.setAttribute('aria-expanded', 'true');
  selector.classList.add('active');
}

function closeDropdown() {
  const selector = document.querySelector('.language-selector');
  selector.setAttribute('aria-expanded', 'false');
  selector.classList.remove('active');
}

function selectLanguage(langCode) {
  languageManager.setLanguage(langCode);
  updateCurrentLanguageDisplay();
  updateLanguageOptions();
  closeDropdown();
}

function updateCurrentLanguageDisplay() {
  const currentLang = languageManager.getCurrentLanguage();
  const langData = languageManager.getSupportedLanguages().find(l => l.code === currentLang);

  const flagElement = document.querySelector('.current-language-flag');
  const nameElement = document.querySelector('.current-language-name');

  if (flagElement && nameElement && langData) {
    flagElement.textContent = langData.flag;
    nameElement.textContent = langData.name;
  }
}

function updateLanguageOptions() {
  const currentLang = languageManager.getCurrentLanguage();
  const options = document.querySelectorAll('.language-option');

  options.forEach(option => {
    const langCode = option.getAttribute('data-lang');
    if (langCode === currentLang) {
      option.classList.add('selected');
      option.setAttribute('aria-selected', 'true');
    } else {
      option.classList.remove('selected');
      option.setAttribute('aria-selected', 'false');
    }
  });
}

function updatePageContent() {
  const t = (key) => languageManager.translate(key);

  document.querySelectorAll('[data-i18n]').forEach(el => {
    languageManager.translateElement(el);
  });

  const serviceCards = [
    {
      selector: '.service-card:nth-child(1)',
      title: 'services.fundRecovery.title',
      price: 'services.fundRecovery.price',
      description: 'services.fundRecovery.description',
      items: ['services.fundRecovery.item1', 'services.fundRecovery.item2', 'services.fundRecovery.item3', 'services.fundRecovery.item4'],
      includes: 'services.fundRecovery.includes',
      note: 'services.fundRecovery.note'
    },
    {
      selector: '.service-card:nth-child(2)',
      title: 'services.digitalForensics.title',
      price: 'services.digitalForensics.price',
      description: 'services.digitalForensics.description',
      items: ['services.digitalForensics.item1', 'services.digitalForensics.item2', 'services.digitalForensics.item3', 'services.digitalForensics.item4'],
      includes: 'services.digitalForensics.includes'
    },
    {
      selector: '.service-card:nth-child(3)',
      title: 'services.identityVerification.title',
      price: 'services.identityVerification.price',
      tagline: 'services.identityVerification.tagline',
      analyzeTitle: 'services.identityVerification.analyzeTitle',
      items: ['services.identityVerification.item1', 'services.identityVerification.item2', 'services.identityVerification.item3', 'services.identityVerification.item4', 'services.identityVerification.item5', 'services.identityVerification.item6'],
      delivery: 'services.identityVerification.delivery',
      deliveryText: 'services.identityVerification.deliveryText',
      perfectFor: 'services.identityVerification.perfectFor',
      perfect: ['services.identityVerification.perfect1', 'services.identityVerification.perfect2', 'services.identityVerification.perfect3']
    },
    {
      selector: '.service-card:nth-child(4)',
      title: 'services.cybersecurityConsulting.title',
      price: 'services.cybersecurityConsulting.price',
      description: 'services.cybersecurityConsulting.description',
      items: ['services.cybersecurityConsulting.item1', 'services.cybersecurityConsulting.item2', 'services.cybersecurityConsulting.item3', 'services.cybersecurityConsulting.item4'],
      note: 'services.cybersecurityConsulting.note'
    },
    {
      selector: '.service-card:nth-child(5)',
      title: 'services.techSupport.title',
      price: 'services.techSupport.price',
      items: ['services.techSupport.item1', 'services.techSupport.item2', 'services.techSupport.item3', 'services.techSupport.item4'],
      note: 'services.techSupport.note'
    },
    {
      selector: '.service-card:nth-child(6)',
      title: 'services.legalReferral.title',
      price: 'services.legalReferral.price',
      description: 'services.legalReferral.description',
      items: ['services.legalReferral.item1', 'services.legalReferral.item2', 'services.legalReferral.item3', 'services.legalReferral.item4'],
      note: 'services.legalReferral.note'
    },
    {
      selector: '.service-card:nth-child(7)',
      title: 'services.educational.title',
      price: 'services.educational.price',
      items: ['services.educational.item1', 'services.educational.item2', 'services.educational.item3'],
      note: 'services.educational.note'
    },
    {
      selector: '.service-card:nth-child(8)',
      title: 'services.emergency.title',
      price: 'services.emergency.price',
      description: 'services.emergency.description',
      items: ['services.emergency.item1', 'services.emergency.item2', 'services.emergency.item3'],
      includes: 'services.emergency.includes'
    },
    {
      selector: '.service-card:nth-child(9)',
      title: 'services.customTech.title',
      price: 'services.customTech.price',
      description: 'services.customTech.description',
      items: ['services.customTech.item1', 'services.customTech.item2', 'services.customTech.item3'],
      note: 'services.customTech.note'
    },
    {
      selector: '.service-card:nth-child(10)',
      title: 'services.textSpying.title',
      price: 'services.textSpying.price',
      description: 'services.textSpying.description',
      items: ['services.textSpying.item1', 'services.textSpying.item2', 'services.textSpying.item3', 'services.textSpying.item4', 'services.textSpying.item5', 'services.textSpying.item6'],
      includes: 'services.textSpying.includes'
    }
  ];

  serviceCards.forEach(card => {
    const cardElement = document.querySelector(card.selector);
    if (!cardElement) return;

    const titleEl = cardElement.querySelector('h3');
    if (titleEl) titleEl.textContent = t(card.title);

    const priceEl = cardElement.querySelector('.service-price');
    if (priceEl) priceEl.textContent = t(card.price);

    if (card.tagline) {
      const taglineEl = cardElement.querySelector('.service-tagline');
      if (taglineEl) taglineEl.textContent = t(card.tagline);
    }

    if (card.description) {
      const descEl = cardElement.querySelector('.service-description');
      if (descEl) descEl.textContent = t(card.description);
    }

    if (card.analyzeTitle) {
      const analyzeTitleEl = cardElement.querySelectorAll('.service-description')[1];
      if (analyzeTitleEl) analyzeTitleEl.textContent = t(card.analyzeTitle);
    }

    if (card.items) {
      const listItems = cardElement.querySelectorAll('.service-list li');
      card.items.forEach((itemKey, index) => {
        if (listItems[index]) {
          listItems[index].childNodes[listItems[index].childNodes.length - 1].textContent = t(itemKey);
        }
      });
    }

    if (card.includes) {
      const includesEl = cardElement.querySelector('.service-includes');
      if (includesEl) includesEl.textContent = t(card.includes);
    }

    if (card.note) {
      const noteEl = cardElement.querySelector('.service-note');
      if (noteEl) noteEl.textContent = t(card.note);
    }

    if (card.delivery) {
      const deliveryEl = cardElement.querySelector('.service-delivery strong');
      if (deliveryEl) deliveryEl.textContent = t(card.delivery);
    }

    if (card.deliveryText) {
      const deliveryTextEl = cardElement.querySelector('.service-delivery');
      if (deliveryTextEl) {
        const strongText = t(card.delivery);
        const regularText = t(card.deliveryText);
        deliveryTextEl.innerHTML = `<strong>${strongText}</strong> ${regularText}`;
      }
    }

    if (card.perfectFor) {
      const perfectForEls = cardElement.querySelectorAll('.service-description');
      const perfectForEl = perfectForEls[perfectForEls.length - 1];
      if (perfectForEl) perfectForEl.textContent = t(card.perfectFor);
    }

    if (card.perfect) {
      const perfectListItems = cardElement.querySelectorAll('.service-list');
      if (perfectListItems.length > 1) {
        const items = perfectListItems[perfectListItems.length - 1].querySelectorAll('li');
        card.perfect.forEach((itemKey, index) => {
          if (items[index]) {
            items[index].childNodes[items[index].childNodes.length - 1].textContent = t(itemKey);
          }
        });
      }
    }

    const startNowBtn = cardElement.querySelector('.btn');
    if (startNowBtn) startNowBtn.textContent = t('services.startNow');
  });

  const consultationCard = document.querySelector('.consultation-content');
  if (consultationCard) {
    const titleEl = consultationCard.querySelector('h3');
    if (titleEl) titleEl.textContent = t('services.customConsultation.title');

    const subtitleEl = consultationCard.querySelector('.consultation-subtitle');
    if (subtitleEl) subtitleEl.textContent = t('services.customConsultation.subtitle');

    const paragraphs = consultationCard.querySelectorAll('p:not(.consultation-subtitle):not(.consultation-include)');
    if (paragraphs[0]) paragraphs[0].textContent = t('services.customConsultation.content1');
    if (paragraphs[paragraphs.length - 1]) paragraphs[paragraphs.length - 1].textContent = t('services.customConsultation.content2');

    const includeTitle = consultationCard.querySelector('.consultation-include');
    if (includeTitle) includeTitle.textContent = t('services.customConsultation.includeTitle');

    const listItems = consultationCard.querySelectorAll('ul li');
    if (listItems[0]) listItems[0].textContent = t('services.customConsultation.include1');
    if (listItems[1]) listItems[1].textContent = t('services.customConsultation.include2');
    if (listItems[2]) listItems[2].textContent = t('services.customConsultation.include3');
    if (listItems[3]) listItems[3].textContent = t('services.customConsultation.include4');

    const ctaBtn = consultationCard.querySelector('.btn');
    if (ctaBtn) ctaBtn.textContent = t('services.customConsultation.cta');
  }

  const reviewsSection = document.querySelector('#reviews');
  if (reviewsSection) {
    const subtitleEl = reviewsSection.querySelector('.section-subtitle');
    if (subtitleEl) subtitleEl.textContent = t('reviews.subtitle');

    const reviews = [
      { selector: '.review-card:nth-child(1)', text: 'reviews.review1', name: 'reviews.author1Name', role: 'reviews.author1Role' },
      { selector: '.review-card:nth-child(2)', text: 'reviews.review2', name: 'reviews.author2Name', role: 'reviews.author2Role' },
      { selector: '.review-card:nth-child(3)', text: 'reviews.review3', name: 'reviews.author3Name', role: 'reviews.author3Role' },
      { selector: '.review-card:nth-child(4)', text: 'reviews.review4', name: 'reviews.author4Name', role: 'reviews.author4Role' }
    ];

    reviews.forEach(review => {
      const reviewCard = reviewsSection.querySelector(review.selector);
      if (!reviewCard) return;

      const textEl = reviewCard.querySelector('.review-text');
      if (textEl) textEl.textContent = t(review.text);

      const nameEl = reviewCard.querySelector('.author-name');
      if (nameEl) nameEl.textContent = t(review.name);

      const roleEl = reviewCard.querySelector('.author-role');
      if (roleEl) roleEl.textContent = t(review.role);
    });
  }

  const contactSection = document.querySelector('#contact');
  if (contactSection) {
    const phoneTitle = contactSection.querySelector('.contact-item:nth-child(1) h4');
    if (phoneTitle) phoneTitle.textContent = t('contact.phone');

    const emailTitle = contactSection.querySelector('.contact-item:nth-child(2) h4');
    if (emailTitle) emailTitle.textContent = t('contact.email');

    const guarantees = contactSection.querySelectorAll('.guarantee-item');
    if (guarantees[0]) guarantees[0].textContent = t('contact.guarantee1');
    if (guarantees[1]) guarantees[1].textContent = t('contact.guarantee2');
    if (guarantees[2]) guarantees[2].textContent = t('contact.guarantee3');

    const nameLabel = contactSection.querySelector('label[for="name"]');
    if (nameLabel) nameLabel.textContent = t('contact.formName');

    const emailLabel = contactSection.querySelector('label[for="email"]');
    if (emailLabel) emailLabel.textContent = t('contact.formEmail');

    const phoneLabel = contactSection.querySelector('label[for="phone"]');
    if (phoneLabel) phoneLabel.textContent = t('contact.formPhone');

    const issueTypeLabel = contactSection.querySelector('label[for="issueType"]');
    if (issueTypeLabel) issueTypeLabel.textContent = t('contact.formIssueType');

    const issueTypeSelect = contactSection.querySelector('#issueType');
    if (issueTypeSelect) {
      const options = issueTypeSelect.querySelectorAll('option');
      if (options[0]) options[0].textContent = t('contact.formIssueSelect');
      if (options[1]) options[1].textContent = t('contact.formIssueOption1');
      if (options[2]) options[2].textContent = t('contact.formIssueOption2');
      if (options[3]) options[3].textContent = t('contact.formIssueOption3');
      if (options[4]) options[4].textContent = t('contact.formIssueOption4');
      if (options[5]) options[5].textContent = t('contact.formIssueOption5');
      if (options[6]) options[6].textContent = t('contact.formIssueOption6');
      if (options[7]) options[7].textContent = t('contact.formIssueOption7');
    }

    const messageLabel = contactSection.querySelector('label[for="message"]');
    if (messageLabel) messageLabel.textContent = t('contact.formMessage');

    const messageTextarea = contactSection.querySelector('#message');
    if (messageTextarea) messageTextarea.placeholder = t('contact.formPlaceholder');

    const submitBtn = contactSection.querySelector('.contact-form .btn');
    if (submitBtn) submitBtn.textContent = t('contact.formSubmit');

    const formNote = contactSection.querySelector('.form-note');
    if (formNote) formNote.textContent = t('contact.formNote');

    const successTitle = contactSection.querySelector('.form-success h3');
    if (successTitle) successTitle.textContent = t('contact.successTitle');

    const successMessage = contactSection.querySelector('.form-success p');
    if (successMessage) successMessage.textContent = t('contact.successMessage');
  }

  const footer = document.querySelector('.footer');
  if (footer) {
    const tagline = footer.querySelector('.footer-brand p');
    if (tagline) tagline.textContent = t('footer.tagline');

    const footerLinks = footer.querySelectorAll('.footer-links a');
    if (footerLinks[0]) footerLinks[0].textContent = t('footer.home');
    if (footerLinks[1]) footerLinks[1].textContent = t('footer.about');
    if (footerLinks[2]) footerLinks[2].textContent = t('footer.services');
    if (footerLinks[3]) footerLinks[3].textContent = t('footer.contact');

    const copyright = footer.querySelector('.footer-bottom p:first-child');
    if (copyright) copyright.textContent = t('footer.copyright');

    const disclaimer = footer.querySelector('.footer-disclaimer');
    if (disclaimer) disclaimer.textContent = t('footer.disclaimer');
  }
}
