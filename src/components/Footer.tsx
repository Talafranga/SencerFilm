import { Link } from "@/i18n/routing";
import { client } from "@/sanity/client";
import { getTranslations, getLocale } from 'next-intl/server';
import { getLocalizedString, getLocalizedText, type LocaleString, type LocaleText } from "@/lib/sanity-locale";

// Social Media Icons
const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const YouTubeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
    <path d="m10 15 5-3-5-3z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6L6 18"/>
    <path d="M6 6l12 12"/>
  </svg>
);

// Contact Icons
const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/>
    <rect x="2" y="4" width="20" height="16" rx="2"/>
  </svg>
);

const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"/>
  </svg>
);

const AddressIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8c0 3.613-3.869 7.429-5.393 8.795a1 1 0 0 1-1.214 0C9.87 15.429 6 11.613 6 8a6 6 0 0 1 12 0"/>
    <circle cx="12" cy="8" r="2"/>
    <path d="M8.714 14h-3.71a1 1 0 0 0-.948.683l-2.004 6A1 1 0 0 0 3 22h18a1 1 0 0 0 .948-1.316l-2-6a1 1 0 0 0-.949-.684h-3.712"/>
  </svg>
);

// Helper function to get social media icon
const getSocialIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'instagram':
      return <InstagramIcon />;
    case 'youtube':
      return <YouTubeIcon />;
    case 'facebook':
      return <FacebookIcon />;
    case 'linkedin':
      return <LinkedInIcon />;
    case 'x':
      return <XIcon />;
    default:
      return null;
  }
};

// GROQ: fetch the singleton footer
const FOOTER_QUERY = /* groq */ `
*[_type == "footer"][0]{
  companyTitle,
  companyDescription,
  socialLinks[]{
    platform,
    url
  },
  contactInfo{
    email,
    phone,
    address
  },
  copyrightText
}
`;

type SocialLink = {
  platform: string;
  url: string;
};


type ContactInfo = {
  email: string;
  phone: string;
  address: string;
};

type FooterData = {
  companyTitle?: LocaleString;
  companyDescription?: LocaleText;
  socialLinks?: SocialLink[];
  contactInfo?: ContactInfo;
  copyrightText?: LocaleString;
};

// Revalidate periodically so content updates are reflected
const options = { next: { revalidate: 30 } };

export default async function Footer() {
  const footerData = await client.fetch<FooterData>(FOOTER_QUERY, {}, options);
  const t = await getTranslations('common');
  const locale = await getLocale() as 'tr' | 'en';

  const currentYear = new Date().getFullYear();
  const companyTitle = getLocalizedString(footerData?.companyTitle, locale);
  const companyDescription = getLocalizedText(footerData?.companyDescription, locale);
  const copyrightText = getLocalizedString(footerData?.copyrightText, locale);

  return (
    <footer className="bg-[#0a0a0a] text-white border-t border-gray-800 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Sencer Film Bölümü */}
          <div className="md:col-span-1">
            <h3 className="text-xl font-bold mb-4">
              {companyTitle || "Sencer Film"}
            </h3>
            <p className="text-gray-300 mb-6 leading-relaxed text-justify">
              {companyDescription || (locale === 'tr' ? "Profesyonel film prodüksiyon hizmetleri sunan deneyimli bir ekiptir." : "An experienced team providing professional film production services.")}
            </p>
            
            {/* Sosyal Medya Linkleri */}
            {footerData?.socialLinks && footerData.socialLinks.length > 0 && (
              <div className="flex gap-4">
                {footerData.socialLinks.map((social, index) => (
                  <Link
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={social.platform.charAt(0).toUpperCase() + social.platform.slice(1)}
                    className="text-gray-300 hover:text-white transition-colors duration-200 p-2 hover:bg-gray-800 rounded-lg"
                  >
                    {getSocialIcon(social.platform)}
                  </Link>
                ))}
              </div>
            )}
          </div>


          {/* İletişim Bilgileri */}
          <div>
            <h3 className="text-xl font-bold mb-4">{t('footer.contact')}</h3>
            <div className="space-y-3">
              {/* Email */}
              {(footerData?.contactInfo?.email || "info@sencerfilm.com") && (
                <a 
                  href={`mailto:${footerData?.contactInfo?.email || "info@sencerfilm.com"}`}
                  className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors duration-200"
                >
                  <MailIcon />
                  <span>{footerData?.contactInfo?.email || "info@sencerfilm.com"}</span>
                </a>
              )}
              
              {/* Phone */}
              {(footerData?.contactInfo?.phone || "+90 555 123 4567") && (
                <a 
                  href={`tel:${footerData?.contactInfo?.phone || "+90 555 123 4567"}`}
                  className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors duration-200"
                >
                  <PhoneIcon />
                  <span>{footerData?.contactInfo?.phone || "+90 555 123 4567"}</span>
                </a>
              )}
              
              {/* Address */}
              {(footerData?.contactInfo?.address || "İstanbul, Türkiye") && (
                <div className="flex items-center gap-3 text-gray-300">
                  <AddressIcon />
                  <span>{footerData?.contactInfo?.address || "İstanbul, Türkiye"}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400">
            © {currentYear} {copyrightText || `Sencer Film. ${t('footer.rights')}`}
          </p>
        </div>
      </div>
    </footer>
  );
}