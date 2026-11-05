// Central, editable source of truth for public-facing numbers and contact
// details. Update values here instead of hunting through components —
// everything below is displayed as-is on the live site, so keep it accurate.

export const trustStats = [
  { value: "20,000+", label: "BD Students in China" },
  { value: "92%", label: "Scholarship Success" },
  { value: "97%", label: "Visa Approval Rate" },
  { value: "100+", label: "Partner Universities" },
] as const;

// TODO: replace with the real office/contact details before relying on this
// section — these are still the placeholders that shipped with the site.
export const contactInfo = {
  address: "House 12, Road 5, Block C, Banani, Dhaka 1213, Bangladesh",
  phoneDisplay: "+880 1XXX-XXXXXX",
  phoneHref: "tel:+8801XXXXXXXXX",
  whatsappDisplay: "+880 1XXX-XXXXXX",
  whatsappHref: "https://wa.me/8801XXXXXXXXX",
  email: "admissions@example.com",
  workingHours: "Sat–Thu: 10:00 AM – 7:00 PM",
} as const;

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://atozgsm.com";

// TODO: confirm final pricing before launch — the source document lists these
// as provisional ("to be confirmed").
export const pricing = {
  premiumAnnualBdt: 4999,
  launchOfferBdt: 2999,
  launchOfferMonths: 3,
  moneyBackDays: 30,
} as const;

export const heroRotatingWords = [
  "Study in China",
  "Find the Right University",
  "Prepare Your Documents",
  "Explore Scholarships",
  "Prepare for Your Visa",
] as const;
