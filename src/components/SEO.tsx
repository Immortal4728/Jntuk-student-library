import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogType?: string;
}

const BASE_URL = 'https://jntuk-student-library.vercel.app';
const DEFAULT_TITLE = 'JNTUK Materials | Notes, PYQs, Important Questions';
const DEFAULT_DESCRIPTION =
  'Access JNTUK semester-wise materials, PYQs, notes, and important questions for CSE, ECE, IT, AIML students. R23 Regulation.';
const DEFAULT_KEYWORDS =
  'JNTUK materials, JNTUK notes, PYQs, engineering notes, CSE materials, ECE materials, JNTUK library, JNTU Kakinada, R23 regulation, semester notes, previous papers, important questions';

export default function SEO({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  canonicalUrl,
  ogType = 'website',
}: SEOProps) {
  const fullTitle = title === DEFAULT_TITLE ? title : `${title} | JNTUK Library`;
  const canonical = canonicalUrl ? `${BASE_URL}${canonicalUrl}` : undefined;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content="JNTUK Library" />
      {canonical && <meta property="og:url" content={canonical} />}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />

      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Additional SEO signals */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Rishi Chowdary" />
    </Helmet>
  );
}
