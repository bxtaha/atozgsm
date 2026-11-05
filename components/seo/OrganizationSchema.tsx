import { contactInfo, SITE_URL } from "@/lib/site-config";

/**
 * Organization structured data. Search engines and AI assistants read this to
 * understand who runs the site and what it does, so keep it factual — every
 * claim here should be true and match what's on the page.
 */
export const OrganizationSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "ATOZ GSM",
    url: SITE_URL,
    description:
      "Education consultancy in Bangladesh supporting students applying to universities in China, covering university selection, scholarships, document preparation and student visa guidance.",
    email: contactInfo.email,
    telephone: contactInfo.phoneDisplay,
    address: {
      "@type": "PostalAddress",
      streetAddress: contactInfo.address,
      addressCountry: "BD",
    },
    areaServed: { "@type": "Country", name: "Bangladesh" },
    knowsAbout: [
      "Studying in China",
      "Chinese university admissions",
      "Chinese Government Scholarship (CSC)",
      "China student visa (X1/X2)",
      "HSK examination",
      "University application documents",
    ],
    openingHours: contactInfo.workingHours,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};
