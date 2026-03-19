'use client';

import { useEffect, useRef } from 'react';
import styles from './TailwindFreeZone.module.css';
import type { LessonLabThemeId } from './themeRegistry';

interface Props {
  enabled: boolean;
  themeId?: LessonLabThemeId;
  children: React.ReactNode;
}

function sanitizeLabText(text: string): string {
  const withoutEmoji = text
    .replace(/[\u{1F1E6}-\u{1F1FF}]/gu, '') // flags
    .replace(/[\u{1F300}-\u{1FAFF}]/gu, '') // emoji + symbols pictographs
    .replace(/[\u{2600}-\u{27BF}]/gu, '') // dingbats/misc symbols
    .replace(/[\u{FE0F}\u{200D}]/gu, ''); // variation selector + joiner

  // Remove common instructional chrome text in the lab preview.
  return withoutEmoji
    .replace(/Check Your Understanding:\s*/gi, '')
    .replace(/You Do \(Independent\)/gi, '')
    .replace(/We Do \(Guided\)/gi, '')
    .replace(/Questions unlock as you complete each one in order/gi, '')
    .replace(/Questions unlock as you complete each question in order/gi, '')
    .replace(/Retrieval Review/gi, '')
    .replace(/\s{2,}/g, ' ');
}

function stripClasses(root: HTMLElement) {
  const withClass = root.querySelectorAll<HTMLElement>('[class]');
  withClass.forEach((node) => {
    node.removeAttribute('class');
  });
}

function stripInlineStyles(root: HTMLElement) {
  const withStyle = root.querySelectorAll<HTMLElement>('[style]');
  withStyle.forEach((node) => {
    node.removeAttribute('style');
  });
}

function hideDecorativeIcons(root: HTMLElement) {
  const icons = root.querySelectorAll<HTMLElement>('svg');
  icons.forEach((icon) => {
    // Hide small "icon" SVGs (e.g. lucide 24x24), but keep large SVGs (diagrams).
    const widthAttr = icon.getAttribute('width');
    const heightAttr = icon.getAttribute('height');
    const width = widthAttr ? Number.parseFloat(widthAttr) : null;
    const height = heightAttr ? Number.parseFloat(heightAttr) : null;

    const viewBox = icon.getAttribute('viewBox') ?? '';
    const looksLikeIcon = viewBox === '0 0 24 24' || viewBox === '0 0 20 20' || viewBox === '0 0 16 16';
    const isSmall = (width !== null && width <= 32) || (height !== null && height <= 32);

    if (looksLikeIcon || isSmall) {
      icon.style.display = 'none';
    }
  });
}

function stripEmojiText(root: HTMLElement) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];

  let current = walker.nextNode();
  while (current) {
    if (current.nodeType === Node.TEXT_NODE) {
      textNodes.push(current as Text);
    }
    current = walker.nextNode();
  }

  textNodes.forEach((node) => {
    const original = node.nodeValue ?? '';
    const cleaned = sanitizeLabText(original);
    if (cleaned !== original) {
      node.nodeValue = cleaned;
    }
  });
}

const themeClassNames: Partial<Record<LessonLabThemeId, string>> = {
  none: styles.none,
  'luxe-editorial': styles.luxeEditorial,
  'glass-aurora': styles.glassAurora,
  'coastal-studio': styles.coastalStudio,
  'midnight-velvet': styles.midnightVelvet,
  'mono-atelier': styles.monoAtelier,
};

export default function TailwindFreeZone({ enabled, themeId = 'none', children }: Props) {
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !enabled) return;

    stripClasses(host);
    stripInlineStyles(host);
    stripEmojiText(host);
    hideDecorativeIcons(host);

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes' && mutation.target instanceof HTMLElement) {
          if (mutation.attributeName === 'class') {
            mutation.target.removeAttribute('class');
          }
          if (mutation.attributeName === 'style') {
            mutation.target.removeAttribute('style');
          }
        }

        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            if (node.hasAttribute('class')) node.removeAttribute('class');
            if (node.hasAttribute('style')) node.removeAttribute('style');
            stripClasses(node);
            stripInlineStyles(node);
            stripEmojiText(node);
            hideDecorativeIcons(node);
          } else if (node.nodeType === Node.TEXT_NODE && node instanceof Text) {
            const cleaned = sanitizeLabText(node.nodeValue ?? '');
            if (cleaned !== (node.nodeValue ?? '')) {
              node.nodeValue = cleaned;
            }
          }
        });
      }
    });

    observer.observe(host, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['class', 'style'],
    });

    return () => observer.disconnect();
  }, [enabled]);

  const themeClassName = enabled ? themeClassNames[themeId] ?? styles.none : '';

  return (
    <div ref={hostRef} className={`${styles.zone} ${enabled ? styles.enabled : ''} ${themeClassName}`}>
      {children}
    </div>
  );
}
