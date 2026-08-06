import { Helmet } from 'react-helmet-async';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogType?: string;
  ogImage?: string;
  noindex?: boolean;
  breadcrumbs?: BreadcrumbItem[];
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

const BASE_URL = 'https://jntuk-student-library.vercel.app';
const DEFAULT_TITLE = 'JNTUK R23 Materials, SGPA & CGPA Calculator | JNTUK Library';
const DEFAULT_DESCRIPTION =
  'Free JNTUK R23 regulation study materials, unit-wise notes, previous year question papers (PYQs), and instant SGPA & CGPA calculator for JNTUK CSE, ECE, IT, and AIML students.';
const DEFAULT_KEYWORDS =
  'JNTUK R23 materials, JNTUK CGPA calculator, JNTUK SGPA calculator, JNTUK R23 notes, JNTUK previous question papers, JNTUK R23 syllabus, JNTUK grade calculator, JNTUK SGPA to percentage, JNTUK CSE R23 materials, JNTUK ECE R23 materials, JNTUK Library, JNTU Kakinada materials, semester notes';
const OG_IMAGE = `${BASE_URL}/og-image.png`;

export default function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  canonicalUrl,
  ogType = 'website',
  ogImage = OG_IMAGE,
  noindex = false,
  breadcrumbs,
  jsonLd,
}: SEOProps) {
  const fullTitle = title
    ? title.includes('JNTUK Library') ? title : `${title} | JNTUK Library`
    : DEFAULT_TITLE;

  const canonical = canonicalUrl ? `${BASE_URL}${canonicalUrl}` : undefined;
  const robotsContent = noindex ? 'noindex, nofollow' : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1';

  // Build BreadcrumbList JSON-LD
  const breadcrumbJsonLd = breadcrumbs && breadcrumbs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.name,
      'item': `${BASE_URL}${item.url}`,
    })),
  } : null;

  // Normalize jsonLd to array
  const jsonLdItems: Record<string, unknown>[] = [];
  if (jsonLd) {
    if (Array.isArray(jsonLd)) {
      jsonLdItems.push(...jsonLd);
    } else {
      jsonLdItems.push(jsonLd);
    }
  }
  if (breadcrumbJsonLd) {
    jsonLdItems.push(breadcrumbJsonLd);
  }

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content={robotsContent} />
      <meta name="author" content="Rishi Chowdary" />
      <meta name="google" content="notranslate" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content="JNTUK Library" />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="JNTUK R23 Materials & CGPA Calculator" />
      <meta property="og:locale" content="en_IN" />
      {canonical && <meta property="og:url" content={canonical} />}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content="JNTUK R23 Materials & CGPA Calculator" />

      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* JSON-LD Structured Data */}
      {jsonLdItems.map((item, i) => (
        <script key={`jsonld-${i}`} type="application/ld+json">
          {JSON.stringify(item)}
        </script>
      ))}
    </Helmet>
  );
}
