import type { University } from "./types";

/**
 * SAMPLE DATA — every record here is marked `isPlaceholder: true` and exists only
 * so the directory, filters and free/premium gating can be built and reviewed.
 *
 * None of these names, fees or scholarship figures describe a real institution.
 * Replace them with verified information (and flip `isPlaceholder` to false)
 * before the directory is shown to students; anything still marked placeholder
 * renders behind a warning notice.
 */
export const universities: University[] = [
  {
    id: "u-001",
    slug: "sample-university-alpha",
    name: "Sample University Alpha",
    city: "Beijing",
    province: "Beijing",
    category: "project-985",
    hostelCnyPerYear: { min: 4000, max: 8000 },
    tuitionCnyPerYear: { min: 20000, max: 30000 },
    programs: [
      { level: "bachelor", field: "Computer Science", durationYears: 4, language: "english", tuitionCnyPerYear: 24000 },
      { level: "bachelor", field: "Civil Engineering", durationYears: 4, language: "english", tuitionCnyPerYear: 22000 },
      { level: "master", field: "Business Administration", durationYears: 2, language: "english", tuitionCnyPerYear: 30000 },
      { level: "language", field: "Chinese Language (HSK track)", durationYears: 1, language: "chinese", tuitionCnyPerYear: 20000 },
    ],
    scholarships: [
      {
        name: "Sample Full Scholarship",
        coverage: "Tuition, accommodation and monthly stipend",
        eligibility: "Placeholder eligibility criteria — replace with verified requirements",
        source: "Pending verification",
        lastVerified: "—",
      },
    ],
    guidance: "Placeholder counselling note. Replace with the team's real guidance for this university.",
    officialWebsite: "https://example.edu.cn",
    isPlaceholder: true,
  },
  {
    id: "u-002",
    slug: "sample-university-beta",
    name: "Sample University Beta",
    city: "Shanghai",
    province: "Shanghai",
    category: "project-211",
    hostelCnyPerYear: { min: 5000, max: 9000 },
    tuitionCnyPerYear: { min: 18000, max: 26000 },
    programs: [
      { level: "bachelor", field: "International Trade", durationYears: 4, language: "english", tuitionCnyPerYear: 20000 },
      { level: "master", field: "Public Health", durationYears: 3, language: "english", tuitionCnyPerYear: 26000 },
      { level: "diploma", field: "Hospitality Management", durationYears: 2, language: "bilingual", tuitionCnyPerYear: 18000 },
    ],
    scholarships: [
      {
        name: "Sample Partial Tuition Waiver",
        coverage: "50% tuition",
        eligibility: "Placeholder eligibility criteria — replace with verified requirements",
        source: "Pending verification",
        lastVerified: "—",
      },
    ],
    guidance: "Placeholder counselling note. Replace with the team's real guidance for this university.",
    officialWebsite: "https://example.edu.cn",
    isPlaceholder: true,
  },
  {
    id: "u-003",
    slug: "sample-university-gamma",
    name: "Sample University Gamma",
    city: "Guangzhou",
    province: "Guangdong",
    category: "double-first-class",
    hostelCnyPerYear: { min: 3500, max: 7000 },
    tuitionCnyPerYear: { min: 16000, max: 24000 },
    programs: [
      { level: "bachelor", field: "Clinical Medicine (MBBS)", durationYears: 6, language: "english", tuitionCnyPerYear: 24000 },
      { level: "bachelor", field: "Pharmacy", durationYears: 4, language: "english", tuitionCnyPerYear: 18000 },
      { level: "language", field: "Chinese Language (HSK track)", durationYears: 1, language: "chinese", tuitionCnyPerYear: 16000 },
    ],
    scholarships: [
      {
        name: "Sample Merit Award",
        coverage: "Tuition only",
        eligibility: "Placeholder eligibility criteria — replace with verified requirements",
        source: "Pending verification",
        lastVerified: "—",
      },
    ],
    guidance: "Placeholder counselling note. Replace with the team's real guidance for this university.",
    officialWebsite: "https://example.edu.cn",
    isPlaceholder: true,
  },
  {
    id: "u-004",
    slug: "sample-university-delta",
    name: "Sample University Delta",
    city: "Wuhan",
    province: "Hubei",
    category: "project-211",
    hostelCnyPerYear: { min: 3000, max: 6000 },
    tuitionCnyPerYear: { min: 14000, max: 20000 },
    programs: [
      { level: "bachelor", field: "Mechanical Engineering", durationYears: 4, language: "english", tuitionCnyPerYear: 16000 },
      { level: "master", field: "Computer Science", durationYears: 3, language: "english", tuitionCnyPerYear: 20000 },
    ],
    scholarships: [
      {
        name: "Sample Provincial Scholarship",
        coverage: "Tuition and partial accommodation",
        eligibility: "Placeholder eligibility criteria — replace with verified requirements",
        source: "Pending verification",
        lastVerified: "—",
      },
    ],
    guidance: "Placeholder counselling note. Replace with the team's real guidance for this university.",
    officialWebsite: "https://example.edu.cn",
    isPlaceholder: true,
  },
  {
    id: "u-005",
    slug: "sample-university-epsilon",
    name: "Sample University Epsilon",
    city: "Nanjing",
    province: "Jiangsu",
    category: "regular",
    hostelCnyPerYear: { min: 2500, max: 5000 },
    tuitionCnyPerYear: { min: 12000, max: 18000 },
    programs: [
      { level: "diploma", field: "Electrical Technology", durationYears: 2, language: "bilingual", tuitionCnyPerYear: 12000 },
      { level: "bachelor", field: "Software Engineering", durationYears: 4, language: "english", tuitionCnyPerYear: 15000 },
      { level: "language", field: "Chinese Language (HSK track)", durationYears: 1, language: "chinese", tuitionCnyPerYear: 12000 },
    ],
    scholarships: [],
    guidance: "Placeholder counselling note. Replace with the team's real guidance for this university.",
    officialWebsite: "https://example.edu.cn",
    isPlaceholder: true,
  },
  {
    id: "u-006",
    slug: "sample-university-zeta",
    name: "Sample University Zeta",
    city: "Chengdu",
    province: "Sichuan",
    category: "project-985",
    hostelCnyPerYear: { min: 4500, max: 8500 },
    tuitionCnyPerYear: { min: 22000, max: 32000 },
    programs: [
      { level: "master", field: "Civil Engineering", durationYears: 3, language: "english", tuitionCnyPerYear: 28000 },
      { level: "master", field: "Economics", durationYears: 2, language: "english", tuitionCnyPerYear: 32000 },
      { level: "bachelor", field: "Architecture", durationYears: 5, language: "bilingual", tuitionCnyPerYear: 22000 },
    ],
    scholarships: [
      {
        name: "Sample Research Scholarship",
        coverage: "Tuition, accommodation and stipend",
        eligibility: "Placeholder eligibility criteria — replace with verified requirements",
        source: "Pending verification",
        lastVerified: "—",
      },
      {
        name: "Sample Partial Award",
        coverage: "30% tuition",
        eligibility: "Placeholder eligibility criteria — replace with verified requirements",
        source: "Pending verification",
        lastVerified: "—",
      },
    ],
    guidance: "Placeholder counselling note. Replace with the team's real guidance for this university.",
    officialWebsite: "https://example.edu.cn",
    isPlaceholder: true,
  },
];
