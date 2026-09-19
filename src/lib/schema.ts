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
  logo: string;
  description: string;
  address: {
    '@type': string;
    addressCountry: string;
  };
  areaServed: string[];
  priceRange: string;
  email: string;
  hasOfferCatalog: {
    '@type': string;
    name: string;
    itemListElement: Array<{
      '@type': string;
      name: string;
      description: string;
      price?: string;
      priceCurrency: string;
      priceSpecification: {
        '@type': string;
        price?: string;
        priceCurrency: string;
        eligibleQuantity?: {
          '@type': string;
          minValue: number;
          maxValue: number;
        };
      };
    }>;
  };
  knowsAbout: string[];
  sameAs: string[];
  contactPoint: {
    '@type': string;
    email: string;
    contactType: string;
  };
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
    logo: 'https://www.syncset.com.au/logo-mark.png', // 180×180 raster — Google wants ≥112px, not SVG
    description:
      'AI workflow automation agency. We connect the tools your business already uses so no enquiry goes unanswered.',
    foundingLocation: {
      '@type': 'Place',
      addressCountry: 'AU',
    },
    areaServed: ['AU', 'Worldwide'],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'contact@syncset.com.au',
      contactType: 'customer service',
    },
    sameAs: ['https://www.linkedin.com/company/syncset'],
  };
}

export function generateLocalBusinessSchema(): SchemaLocalBusiness {
  return {
    '@context': 'https://schema.org',
    // ProfessionalService (a LocalBusiness subtype) matches the GBP primary
    // category (Marketing agency) more precisely than bare LocalBusiness and
    // is what the GBP deployment guide's schema was built against.
    '@type': 'ProfessionalService',
    '@id': 'https://www.syncset.com.au/#localbusiness',
    name: 'SyncSet',
    url: 'https://www.syncset.com.au',
    logo: 'https://www.syncset.com.au/logo-mark.png',
    description:
      'AI workflow automation agency. We connect the tools your business already uses so no enquiry goes unanswered and no booking gets lost.',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'AU',
    },
    areaServed: ['AU', 'Worldwide'],
    priceRange: 'A$900–A$2,500',
    email: 'contact@syncset.com.au',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'SyncSet Services',
      itemListElement: [
        {
          '@type': 'Offer',
          name: 'Workflow Audit',
          description:
            '20-minute discovery call to identify where your enquiries get stuck and what automation could fix. Free. No commitment.',
          price: '0',
          priceCurrency: 'AUD',
          priceSpecification: {
            '@type': 'PriceSpecification',
            price: '0',
            priceCurrency: 'AUD',
          },
        },
        {
          '@type': 'Offer',
          name: 'Workflow Build',
          description:
            'We connect your existing tools and build the automation to capture enquiries and confirm bookings automatically. Pilot: one workflow end-to-end. Most builds take 1–3 weeks.',
          price: '900',
          priceCurrency: 'AUD',
          priceSpecification: {
            '@type': 'PriceSpecification',
            price: '900',
            priceCurrency: 'AUD',
            eligibleQuantity: {
              '@type': 'QuantitativeValue',
              minValue: 1,
              maxValue: 1,
            },
          },
        },
        {
          '@type': 'Offer',
          name: 'Ongoing Support & Monitoring',
          description:
            'We monitor the workflows we build and fix issues proactively. No lock-in — pay as you go or per-incident support available.',
          priceCurrency: 'AUD',
          priceSpecification: {
            '@type': 'PriceSpecification',
            priceCurrency: 'AUD',
          },
        },
      ],
    },
    knowsAbout: [
      'AI workflow automation',
      'Business process automation',
      'WhatsApp integration',
      'CRM automation',
      'Booking automation',
      'Enquiry capture',
      'Small business automation',
    ],
    sameAs: ['https://www.linkedin.com/company/syncset'],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'contact@syncset.com.au',
      contactType: 'customer service',
    },
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
