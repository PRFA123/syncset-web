export interface SchemaOrganization {
  '@context': string;
  '@type': string;
  '@id': string;
  name: string;
  url: string;
  logo: string;
  description: string;
  foundingLocation: {
    '@type': string;
    addressCountry: string;
  };
  areaServed: string[];
  contactPoint: {
    '@type': string;
    email: string;
    contactType: string;
  };
  sameAs: string[];
}

export interface SchemaLocalBusiness {
  '@context': string;
  '@type': string;
  '@id': string;
  name: string;
  url: string;
  address: {
    '@type': string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  areaServed: string[];
  priceRange: string;
  email: string;
}

export interface SchemaWebSite {
  '@context': string;
  '@type': string;
  '@id': string;
  url: string;
  name: string;
  publisher: {
    '@id': string;
  };
}

export function generateOrganizationSchema(): SchemaOrganization {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://www.syncset.com.au/#organization',
    name: 'SyncSet',
    url: 'https://www.syncset.com.au',
    logo: 'https://www.syncset.com.au/favicon.svg',
    description:
      'AI workflow automation agency. We connect the tools your business already uses so no enquiry goes unanswered.',
    foundingLocation: {
      '@type': 'Place',
      addressCountry: 'AU',
    },
    areaServed: ['AU', 'Worldwide'],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'hello@syncset.com.au',
      contactType: 'customer service',
    },
    sameAs: ['https://www.linkedin.com/company/syncset'],
  };
}

export function generateLocalBusinessSchema(): SchemaLocalBusiness {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://www.syncset.com.au/#localbusiness',
    name: 'SyncSet',
    url: 'https://www.syncset.com.au',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Byron Bay',
      addressRegion: 'NSW',
      postalCode: '2481',
      addressCountry: 'AU',
    },
    areaServed: ['AU', 'Worldwide'],
    priceRange: 'A$900–A$2,500',
    email: 'hello@syncset.com.au',
  };
}

export function generateWebSiteSchema(): SchemaWebSite {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://www.syncset.com.au/#website',
    url: 'https://www.syncset.com.au',
    name: 'SyncSet',
    publisher: {
      '@id': 'https://www.syncset.com.au/#organization',
    },
  };
}
