import React from 'react';

// Text processing utilities

// Regular expression to match URLs
const URL_REGEX = /(https?:\/\/[^\s<>"]+|www\.[^\s<>"]+)/gi;

/**
 * Converts plain text with URLs into JSX elements with clickable links
 * @param text - The input text that may contain URLs
 * @returns Array of JSX elements (text and links)
 */
export const linkifyText = (text: string | null | undefined): (string | React.ReactElement)[] => {
  if (!text || typeof text !== 'string') return [text || ''];

  const parts: (string | React.ReactElement)[] = [];
  let lastIndex = 0;
  let match;

  // Reset regex lastIndex to ensure we start from the beginning
  URL_REGEX.lastIndex = 0;

  while ((match = URL_REGEX.exec(text)) !== null) {
    // Add text before the URL
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    // Add the URL as a clickable link
    const url = match[0];
    const href = url.startsWith('http') ? url : `https://${url}`;

    parts.push(
      React.createElement(
        'a',
        {
          key: `${match.index}-${url}`,
          href: href,
          target: '_blank',
          rel: 'noopener noreferrer',
          className: 'text-blue-600 hover:text-blue-800 underline transition-colors',
        },
        url,
      ),
    );

    lastIndex = URL_REGEX.lastIndex;
  }

  // Add any remaining text after the last URL
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
};

/**
 * Alternative function that returns a string with HTML anchor tags
 * @param text - The input text that may contain URLs
 * @returns String with HTML anchor tags
 */
export const linkifyTextToHTML = (text: string): string => {
  if (!text) return text;

  return text.replace(URL_REGEX, (url) => {
    const href = url.startsWith('http') ? url : `https://${url}`;
    return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline transition-colors">${url}</a>`;
  });
};

/**
 * Extracts all URLs from a text string
 * @param text - The input text
 * @returns Array of URLs found in the text
 */
export const extractUrls = (text: string): string[] => {
  if (!text) return [];

  const matches = text.match(URL_REGEX);
  return matches || [];
};

/**
 * Checks if a string contains any URLs
 * @param text - The input text
 * @returns Boolean indicating if URLs are present
 */
export const hasUrls = (text: string): boolean => {
  if (!text) return false;
  return URL_REGEX.test(text);
};
