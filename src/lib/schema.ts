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
    priceRange: 'A$490–A$990',
    email: 'contact@syncset.com.au',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'SyncSet Services',
      itemListElement: [
        {
          '@type': 'Offer',
          name: 'Automation Diagnostic',
          description:
            'A guided chat on syncset.com.au that maps where your enquiries, bookings and follow-ups get stuck and which workflow to fix first. Free, no commitment.',
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
          name: 'Starter Automation',
          description:
            'One workflow built and running in 5 to 7 days: automatic enquiry replies, follow-up sequences or lead capture, on the tools you already use. Human approval on every customer-facing action.',
          price: '490',
          priceCurrency: 'AUD',
          priceSpecification: {
            '@type': 'PriceSpecification',
            price: '490',
            priceCurrency: 'AUD',
          },
        },
        {
          '@type': 'Offer',
          name: 'Presence + Automation Package',
          description:
            'Google Business Profile set up and optimised plus one Starter Automation running, in 7 to 10 days.',
          price: '690',
          priceCurrency: 'AUD',
          priceSpecification: {
            '@type': 'PriceSpecification',
            price: '690',
            priceCurrency: 'AUD',
          },
        },
        {
          '@type': 'Offer',
          name: 'Multi-workflow Automation',
          description:
            'Two to three processes connected end to end, for example enquiry capture, CRM update and team notification, in 10 to 14 days.',
          price: '990',
          priceCurrency: 'AUD',
          priceSpecification: {
            '@type': 'PriceSpecification',
            price: '990',
            priceCurrency: 'AUD',
          },
        },
        {
          '@type': 'Offer',
          name: 'Maintenance Retainer',
          description:
            'A$197 per month. We monitor the workflows we built, fix issues before they cost you a client and make small adjustments. No lock-in.',
          price: '197',
          priceCurrency: 'AUD',
          priceSpecification: {
            '@type': 'PriceSpecification',
            price: '197',
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
