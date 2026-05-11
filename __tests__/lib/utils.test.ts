import { cn, formatDatetoYYYYMMDD, formatCurrency, getOrdinalSuffix } from "@/lib/utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("returns empty string when called with no arguments", () => {
    expect(cn()).toBe("");
  });

  it("handles conditional classes", () => {
    expect(cn("base", false && "hidden", "visible")).toBe("base visible");
  });

  it("merges conflicting Tailwind classes keeping the last one", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  it("handles undefined and null inputs", () => {
    expect(cn("base", undefined, null, "end")).toBe("base end");
  });
});

describe("formatDatetoYYYYMMDD", () => {
  it("formats a date as YYYYMMDD", () => {
    const date = new Date(2024, 0, 15); // Jan 15, 2024
    expect(formatDatetoYYYYMMDD(date)).toBe("20240115");
  });

  it("pads single-digit month with leading zero", () => {
    const date = new Date(2024, 2, 5); // Mar 5, 2024
    expect(formatDatetoYYYYMMDD(date)).toBe("20240305");
  });

  it("pads single-digit day with leading zero", () => {
    const date = new Date(2024, 0, 1); // Jan 1, 2024
    expect(formatDatetoYYYYMMDD(date)).toBe("20240101");
  });

  it("handles December correctly (month index 11 → 12)", () => {
    const date = new Date(2024, 11, 31); // Dec 31, 2024
    expect(formatDatetoYYYYMMDD(date)).toBe("20241231");
  });

  it("handles double-digit month and day without extra padding", () => {
    const date = new Date(2024, 9, 25); // Oct 25, 2024
    expect(formatDatetoYYYYMMDD(date)).toBe("20241025");
  });
});

describe("formatCurrency", () => {
  it("formats a whole number with two decimal places", () => {
    expect(formatCurrency("1000")).toBe("$1,000.00");
  });

  it("formats a number with decimals", () => {
    expect(formatCurrency("1234567.89")).toBe("$1,234,567.89");
  });

  it("formats a small decimal value", () => {
    expect(formatCurrency(".5")).toBe("$0.50");
  });

  it("formats zero", () => {
    expect(formatCurrency("0")).toBe("$0.00");
  });

  it("formats negative numbers", () => {
    expect(formatCurrency("-500.5")).toBe("-$500.50");
  });

  it("throws an error for non-numeric strings", () => {
    expect(() => formatCurrency("abc")).toThrow('Invalid numeric string: "abc"');
  });

  it("throws an error for empty string", () => {
    expect(() => formatCurrency("")).toThrow('Invalid numeric string: ""');
  });
});

describe("getOrdinalSuffix", () => {
  it('returns "st" for 1', () => {
    expect(getOrdinalSuffix(1)).toBe("st");
  });

  it('returns "nd" for 2', () => {
    expect(getOrdinalSuffix(2)).toBe("nd");
  });

  it('returns "rd" for 3', () => {
    expect(getOrdinalSuffix(3)).toBe("rd");
  });

  it('returns "th" for 4 through 20', () => {
    for (let i = 4; i <= 20; i++) {
      expect(getOrdinalSuffix(i)).toBe("th");
    }
  });

  it('returns "st" for 21', () => {
    expect(getOrdinalSuffix(21)).toBe("st");
  });

  it('returns "nd" for 22', () => {
    expect(getOrdinalSuffix(22)).toBe("nd");
  });

  it('returns "rd" for 23', () => {
    expect(getOrdinalSuffix(23)).toBe("rd");
  });

  it('returns "th" for 11, 12, 13 (special teens)', () => {
    expect(getOrdinalSuffix(11)).toBe("th");
    expect(getOrdinalSuffix(12)).toBe("th");
    expect(getOrdinalSuffix(13)).toBe("th");
  });

  it('returns "th" for 0', () => {
    expect(getOrdinalSuffix(0)).toBe("th");
  });

  it('returns "st" for 31', () => {
    expect(getOrdinalSuffix(31)).toBe("st");
  });
});
