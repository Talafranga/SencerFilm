import { client } from "@/sanity/client";
import { getTranslations } from 'next-intl/server';

// Contact Icons (Footer'dan aynı icon'ları kullanıyoruz)
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


// GROQ: fetch the singleton contactPage
const CONTACT_QUERY = /* groq */ `
*[_type == "contactPage"][0]{
  contactInfo{
    email,
    phone,
    phoneEn,
    phoneAr,
    address
  },
  locationMap{
    mapEmbedCode,
    mapShareUrl
  }
}`;

type ContactInfo = {
  email: string;
  phone: string;
  phoneEn: string;
  phoneAr: string;
  address: string;
};

type LocationMap = {
  mapEmbedCode: string;
  mapShareUrl: string;
};

type ContactPageData = {
  contactInfo?: ContactInfo;
  locationMap?: LocationMap;
};

// Helper function to extract src from iframe embed code
const extractSrcFromIframe = (embedCode: string): string => {
  try {
    const match = embedCode.match(/src="([^"]+)"/);
    return match ? match[1] : '';
  } catch {
    return '';
  }
};

// Revalidate periodically so content updates are reflected
const options = { next: { revalidate: 30 } };

interface ContactSectionProps {
  showTitle?: boolean;
  className?: string;
}

export default async function ContactSection({ 
  showTitle = true, 
  className = "" 
}: ContactSectionProps) {
  const contactData = await client.fetch<ContactPageData>(CONTACT_QUERY, {}, options);
  const t = await getTranslations('common');

  return (
    <section className={`py-12 md:py-20 lg:py-24 bg-background ${className}`}>
      {showTitle && (
        <>
          {/* İletişim Başlığı */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-barlow font-normal leading-tight text-foreground mb-6">
              {t('contact.title')}
            </h2>
            {/* Dekoratif çizgi */}
            <div className="flex justify-center">
              <div className="w-24 h-0.5 bg-primary"></div>
            </div>
          </div>
        </>
      )}
      
      {/* İçerik */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Sol Taraf - İletişim Bilgileri */}
          <div>
            <h3 className="text-2xl font-bold mb-8 text-foreground">{t('contact.info')}</h3>
            <div className="space-y-6">
              {/* Email */}
              {contactData?.contactInfo?.email && (
                <a 
                  href={`mailto:${contactData.contactInfo.email}`}
                  className="flex items-center gap-4 p-4 rounded-lg bg-card hover:bg-accent transition-colors duration-200 group"
                >
                  <div className="text-primary group-hover:text-accent-foreground transition-colors duration-200">
                    <MailIcon />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{t('contact.email')}</p>
                    <p className="text-muted-foreground group-hover:text-accent-foreground transition-colors duration-200">
                      {contactData.contactInfo.email}
                    </p>
                  </div>
                </a>
              )}

              {/* Phone Numbers */}
              {(contactData?.contactInfo?.phone || contactData?.contactInfo?.phoneEn || contactData?.contactInfo?.phoneAr) && (
                <div className="flex items-start gap-4 p-4 rounded-lg bg-card">
                  <div className="text-primary mt-1">
                    <PhoneIcon />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground mb-2">{t('contact.phone')}</p>
                    <div className="space-y-2">
                      {contactData?.contactInfo?.phone && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Türkçe</p>
                          <a 
                            href={`tel:${contactData.contactInfo.phone}`}
                            className="text-foreground hover:text-primary transition-colors duration-200"
                          >
                            {contactData.contactInfo.phone}
                          </a>
                        </div>
                      )}
                      {contactData?.contactInfo?.phoneEn && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">for English</p>
                          <a 
                            href={`tel:${contactData.contactInfo.phoneEn}`}
                            className="text-foreground hover:text-primary transition-colors duration-200"
                          >
                            {contactData.contactInfo.phoneEn}
                          </a>
                        </div>
                      )}
                      {contactData?.contactInfo?.phoneAr && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">for Arabic</p>
                          <a 
                            href={`tel:${contactData.contactInfo.phoneAr}`}
                            className="text-foreground hover:text-primary transition-colors duration-200"
                          >
                            {contactData.contactInfo.phoneAr}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Address */}
              {contactData?.contactInfo?.address && (
                <div className="flex items-start gap-4 p-4 rounded-lg bg-card">
                  <div className="text-primary mt-1">
                    <AddressIcon />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{t('contact.address')}</p>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                      {contactData.contactInfo.address}
                    </p>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Sağ Taraf - Google Maps */}
          <div>
            <h3 className="text-2xl font-bold mb-8 text-foreground">{t('contact.location')}</h3>
            {contactData?.locationMap?.mapEmbedCode ? (
              <div className="space-y-4">
                {/* Google Maps Embed */}
                <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-lg">
                  <iframe
                    src={extractSrcFromIframe(contactData.locationMap.mapEmbedCode)}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={t('contact.mapTitle')}
                    className="absolute inset-0"
                  />
                </div>
                
                {/* Maps Link */}
                {contactData.locationMap.mapShareUrl && (
                  <div className="text-center">
                    <a
                      href={contactData.locationMap.mapShareUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-200"
                    >
                      <AddressIcon />
                      <span>{t('contact.openInMaps')}</span>
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-96 bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">{t('contact.mapLoading')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
