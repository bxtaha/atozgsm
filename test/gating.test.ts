import { describe, expect, it } from "vitest";
import { searchUniversities, getUniversityBySlug } from "@/lib/universities/queries";
import { universities } from "@/lib/universities/data";

/**
 * These guard the core business rule: free visitors must never receive a
 * university name, its scholarship detail, or our written guidance — not hidden
 * in the markup, not present in the payload at all.
 */
describe("free vs premium gating", () => {
  it("never includes a university name in a free result", () => {
    const results = searchUniversities({}, "free");
    const serialised = JSON.stringify(results);

    for (const u of universities) {
      expect(serialised).not.toContain(u.name);
      expect(serialised).not.toContain(u.slug);
      expect(serialised).not.toContain(u.guidance);
    }
  });

  it("never includes scholarship detail in a free result", () => {
    const serialised = JSON.stringify(searchUniversities({}, "free"));
    for (const u of universities) {
      for (const s of u.scholarships) {
        expect(serialised).not.toContain(s.name);
        expect(serialised).not.toContain(s.coverage);
      }
    }
  });

  it("still gives free visitors the costs and location they came for", () => {
    const [first] = searchUniversities({}, "free");
    expect(first.city).toBeTruthy();
    expect(first.tuitionCnyPerYear.min).toBeGreaterThan(0);
    expect(first.hostelCnyPerYear.min).toBeGreaterThan(0);
    expect(first.programs.length).toBeGreaterThan(0);
  });

  it("tells free visitors how many scholarships exist without naming them", () => {
    const results = searchUniversities({}, "free");
    const withScholarships = results.find((r) => "scholarshipCount" in r && r.scholarshipCount > 0);
    expect(withScholarships).toBeDefined();
  });

  it("gives premium viewers the full record", () => {
    const [first] = searchUniversities({}, "premium");
    expect(first.locked).toBe(false);
    expect("name" in first && first.name).toBeTruthy();
  });

  it("refuses to resolve a university profile for a free viewer", () => {
    expect(getUniversityBySlug(universities[0].slug, "free")).toBeNull();
    expect(getUniversityBySlug(universities[0].slug, "premium")).not.toBeNull();
  });
});

describe("directory filters", () => {
  it("filters by city", () => {
    const results = searchUniversities({ city: "Beijing" }, "free");
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((r) => r.city === "Beijing")).toBe(true);
  });

  it("filters by study level", () => {
    const results = searchUniversities({ level: "master" }, "free");
    expect(results.every((r) => r.programs.some((p) => p.level === "master"))).toBe(true);
  });

  it("returns nothing for an impossible combination", () => {
    expect(searchUniversities({ city: "Beijing", level: "diploma" }, "free")).toHaveLength(0);
  });

  it("does not let a free visitor search by university name", () => {
    // Searching a locked name must not reveal which card matches.
    expect(searchUniversities({ query: universities[0].name }, "free")).toHaveLength(0);
  });
});
