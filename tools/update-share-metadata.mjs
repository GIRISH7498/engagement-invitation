import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = dirname(dirname(fileURLToPath(import.meta.url)));
const configPath = join(rootDir, 'src', 'app', 'config', 'invitation.config.ts');
const indexPath = join(rootDir, 'src', 'index.html');

const invitation = readInvitationConfig(configPath);
const share = invitation.share ?? {};
const tokens = {
  groomName: invitation.couple?.groomName ?? '',
  brideName: invitation.couple?.brideName ?? '',
  coupleDisplayName: invitation.couple?.coupleDisplayName ?? '',
  eventTitle: invitation.event?.title ?? '',
  eventDate: invitation.event?.date ?? '',
  eventTime: invitation.event?.time ?? '',
  venueName: invitation.event?.venueName ?? '',
  venueAddress: invitation.event?.venueAddress ?? '',
};

const siteUrl = normalizeSiteUrl(renderTemplate(share.siteUrl, tokens));
const imageUrl = toAbsoluteUrl(renderTemplate(share.image, tokens), siteUrl);
const title = renderTemplate(share.titleTemplate, tokens);
const description = renderTemplate(share.descriptionTemplate, tokens);
const browserTitle = renderTemplate(share.browserTitleTemplate, tokens);
const imageAlt = renderTemplate(share.imageAltTemplate, tokens);
const siteName = renderTemplate(share.siteName, tokens);

let html = readFileSync(indexPath, 'utf8');

html = setTitle(html, browserTitle || title || 'Engagement Invitation');
html = setMetaName(html, 'description', description);
html = setMetaProperty(html, 'og:type', 'website');
html = setMetaProperty(html, 'og:site_name', siteName || 'Engagement Invitation');
html = setMetaProperty(html, 'og:title', title);
html = setMetaProperty(html, 'og:description', description);
html = setMetaProperty(html, 'og:url', siteUrl);
html = setMetaProperty(html, 'og:image', imageUrl);
html = setMetaProperty(html, 'og:image:secure_url', imageUrl);
html = setMetaProperty(html, 'og:image:type', getImageMimeType(imageUrl));
html = setMetaProperty(html, 'og:image:width', '1200');
html = setMetaProperty(html, 'og:image:height', '630');
html = setMetaProperty(html, 'og:image:alt', imageAlt || title);
html = setMetaName(html, 'twitter:card', 'summary_large_image');
html = setMetaName(html, 'twitter:title', title);
html = setMetaName(html, 'twitter:description', description);
html = setMetaName(html, 'twitter:image', imageUrl);
html = setImageSrc(html, imageUrl);

writeFileSync(indexPath, html, 'utf8');
console.log(`Updated share metadata for ${siteUrl}`);

function readInvitationConfig(filePath) {
  const source = readFileSync(filePath, 'utf8');
  const executableSource = source
    .replace(/^\s*import[\s\S]*?;\s*/gm, '')
    .replace(/export\s+const\s+invitationConfig\s*:\s*InvitationConfig\s*=/, 'return')
    .replace(/;\s*$/, '');

  return Function(executableSource)();
}

function renderTemplate(value = '', tokenMap) {
  return String(value).replace(/\{([a-zA-Z0-9_]+)\}/g, (_match, tokenName) => {
    return tokenMap[tokenName] ?? '';
  });
}

function normalizeSiteUrl(value) {
  if (!value) {
    throw new Error('share.siteUrl is required in invitation.config.ts');
  }

  const url = new URL(value);
  return url.href.endsWith('/') ? url.href : `${url.href}/`;
}

function toAbsoluteUrl(value, baseUrl) {
  if (!value) {
    throw new Error('share.image is required in invitation.config.ts');
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  return new URL(value.replace(/^\/+/, ''), baseUrl).href;
}

function setTitle(html, value) {
  const tag = `<title>${escapeText(value)}</title>`;
  return replaceOrInsert(html, /<title>[\s\S]*?<\/title>/i, tag);
}

function setMetaName(html, name, content) {
  const tag = `<meta name="${escapeAttribute(name)}" content="${escapeAttribute(content)}" />`;
  return replaceOrInsert(
    html,
    new RegExp(`<meta\\s+name=["']${escapeRegExp(name)}["'][^>]*>`, 'i'),
    tag,
  );
}

function setMetaProperty(html, property, content) {
  const tag = `<meta property="${escapeAttribute(property)}" content="${escapeAttribute(content)}" />`;
  return replaceOrInsert(
    html,
    new RegExp(`<meta\\s+property=["']${escapeRegExp(property)}["'][^>]*>`, 'i'),
    tag,
  );
}

function setImageSrc(html, href) {
  const tag = `<link rel="image_src" href="${escapeAttribute(href)}" />`;
  return replaceOrInsert(html, /<link\s+rel=["']image_src["'][^>]*>/i, tag);
}

function replaceOrInsert(html, pattern, tag) {
  if (pattern.test(html)) {
    return html.replace(pattern, tag);
  }

  if (/<link\s+rel=["']icon["']/i.test(html)) {
    return html.replace(/(\s*)<link\s+rel=["']icon["']/i, `$1${tag}\n$1<link rel="icon"`);
  }

  return html.replace(/\s*<\/head>/i, `\n    ${tag}\n  </head>`);
}

function getImageMimeType(url) {
  const pathname = new URL(url).pathname.toLowerCase();

  if (pathname.endsWith('.jpg') || pathname.endsWith('.jpeg')) {
    return 'image/jpeg';
  }

  if (pathname.endsWith('.webp')) {
    return 'image/webp';
  }

  return 'image/png';
}

function escapeText(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/[^\x00-\x7F]/g, (character) => {
      return `&#x${character.codePointAt(0).toString(16)};`;
    });
}

function escapeAttribute(value) {
  return escapeText(value).replace(/"/g, '&quot;');
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
