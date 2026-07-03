import { useTranslation } from 'react-i18next';
import { detectLangFromPath, withLangPrefix } from '../i18n';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  titleKey: string;
  descriptionKey: string;
  path: string;
  jsonLd?: object;
  noindex?: boolean;
}

const SITE = 'https://bal.pe.kr';
const BASE_PATH = '/tools/sleepcycle';
const withBase = (p: string) => (p === '/' ? `${BASE_PATH}/` : `${BASE_PATH}${p}`);
const PUBLISHER_NAME = 'bal.pe.kr';
const PUBLISHER_URL = 'https://bal.pe.kr';

export default function SEO({ titleKey, descriptionKey, path, jsonLd, noindex }: SEOProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const lang = detectLangFromPath(location.pathname);

  const title = t(titleKey);
  const description = t(descriptionKey);

  const koPath = withBase(path);
  const enPath = withBase(withLangPrefix(path, 'en'));
  const currentPath = lang === 'ko' ? koPath : enPath;
  const url = `${SITE}${currentPath}`;

  const brandSuffix = t('site.brandPrefix') + ' ' + t('site.brandSuffix');
  const fullTitle = path === '/' ? title : `${title} | ${brandSuffix}`;
  const ogLocale = lang === 'ko' ? 'ko_KR' : 'en_US';
  const ogImageAlt = fullTitle;

  const homeUrl = `${SITE}${withBase(lang === 'ko' ? '/' : '/en')}`;
  const breadcrumbItems: Array<{ '@type': 'ListItem'; position: number; name: string; item: string }> = [
    { '@type': 'ListItem', position: 1, name: brandSuffix, item: homeUrl },
  ];
  if (path !== '/') {
    const segment = path.slice(1);
    const navKey = `nav.${segment}`;
    const navLabel = t(navKey);
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: 2,
      name: navLabel !== navKey ? navLabel : title,
      item: url,
    });
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems,
  };

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: PUBLISHER_NAME,
    url: PUBLISHER_URL,
  };

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={noindex ? "noindex,nofollow" : "index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1"} />
      <link rel="canonical" href={url} />
      <link rel="alternate" hrefLang="ko" href={`${SITE}${koPath}`} />
      <link rel="alternate" hrefLang="en" href={`${SITE}${enPath}`} />
      <link rel="alternate" hrefLang="x-default" href={`${SITE}${koPath}`} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:locale" content={ogLocale} />
      <meta property="og:image" content={`${SITE}${BASE_PATH}/og.png`} />
      <meta property="og:image:alt" content={ogImageAlt} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={brandSuffix} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${SITE}${BASE_PATH}/og.png`} />
      <meta name="twitter:image:alt" content={ogImageAlt} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      {(() => {
        // SEO_KIT_PATCHED_V2: HowTo schema 자동 필터 (v2 표준, [[feedback_seo_strategy_v2]])
        if (!jsonLd) return null;
        const filtered = Array.isArray(jsonLd)
          ? (jsonLd as unknown[]).filter((s) => (s as { '@type'?: string })['@type'] !== 'HowTo')
          : ((jsonLd as { '@type'?: string })['@type'] === 'HowTo' ? null : jsonLd);
        if (!filtered) return null;
        if (Array.isArray(filtered) && filtered.length === 0) return null;
        return (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(filtered) }}
          />
        );
      })()}
    </>
  );
}
