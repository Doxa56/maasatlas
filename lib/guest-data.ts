import { PositionDetails, PositionRecord, SalaryHistoryEntry } from "@/lib/types";
import { fromSlug, slugify } from "@/lib/utils";

const GUEST_SALARY_STORAGE_KEY = "maasatlas-guest-salary-history";
const GUEST_UPDATED_EVENT = "maasatlas-guest-salary-updated";

const extractYear = (value: string): number | null => {
  if (!value) {
    return null;
  }

  const isoMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    return Number.parseInt(isoMatch[1], 10);
  }

  const trMatch = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (trMatch) {
    return Number.parseInt(trMatch[3], 10);
  }

  return null;
};

const parseBenefitAmount = (value: string): number => {
  const match = value.match(/\d+[\d.,]*/);
  if (!match) {
    return 0;
  }
  const normalized = match[0].replace(/,/g, ".");
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const readGuestSalaryHistory = (): SalaryHistoryEntry[] => {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(GUEST_SALARY_STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as Partial<SalaryHistoryEntry>[];
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.map((entry) => ({
      id: String(entry.id ?? crypto.randomUUID()),
      startDate: String(entry.startDate ?? ""),
      endDate: String(entry.endDate ?? ""),
      companyName: String(entry.companyName ?? "Belirtilmedi"),
      cityName: String(entry.cityName ?? "Belirtilmedi"),
      positionName: String(entry.positionName ?? ""),
      salary: Number(entry.salary ?? 0),
      benefits: String(entry.benefits ?? ""),
    }));
  } catch {
    return [];
  }
};

export const writeGuestSalaryHistory = (entries: SalaryHistoryEntry[]): void => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(GUEST_SALARY_STORAGE_KEY, JSON.stringify(entries));
  window.dispatchEvent(new CustomEvent(GUEST_UPDATED_EVENT));
};

export const getGuestUpdatedEventName = (): string => GUEST_UPDATED_EVENT;

export const buildPositionRecordsWithGuest = (
  baseRecords: PositionRecord[],
  guestEntries: SalaryHistoryEntry[],
): PositionRecord[] => {
  const grouped = new Map<string, { companyName: string; entries: SalaryHistoryEntry[] }>();

  guestEntries
    .filter((entry) => entry.positionName.trim().length > 0 && entry.salary > 0)
    .forEach((entry) => {
      const companyName = entry.companyName.trim().length > 0 ? entry.companyName.trim() : "Belirtilmedi";
      const cityName = entry.cityName.trim().length > 0 ? entry.cityName.trim() : "Belirtilmedi";
      const key = `${slugify(entry.positionName)}::${slugify(companyName)}::${slugify(cityName)}`;
      const bucket = grouped.get(key) ?? { companyName, entries: [] };
      bucket.entries.push(entry);
      grouped.set(key, bucket);
    });

  const guestRecords: PositionRecord[] = Array.from(grouped.entries()).map(([key, group], index) => {
    const avgSalary = Math.round(group.entries.reduce((acc, item) => acc + item.salary, 0) / group.entries.length);
    const avgBenefits = Math.round(
      group.entries.reduce((acc, item) => acc + parseBenefitAmount(item.benefits), 0) / group.entries.length,
    );

    return {
      id: `guest-${key}-${index}`,
      positionName: group.entries[0].positionName,
      company: group.companyName,
      location: group.entries[0].cityName.trim().length > 0 ? group.entries[0].cityName : "Belirtilmedi",
      averageSalary: avgSalary,
      averageBenefits: avgBenefits,
      level: "Topluluk",
    };
  });

  return [...baseRecords, ...guestRecords];
};

export const buildPositionDetailsWithGuest = (
  slug: string,
  baseDetailsBySlug: Record<string, PositionDetails>,
  mergedRecords: PositionRecord[],
  guestEntries: SalaryHistoryEntry[],
): PositionDetails | null => {
  const base = baseDetailsBySlug[slug];
  const slugMatchedRecords = mergedRecords.filter((item) => slugify(item.positionName) === slug);
  const positionName = base?.positionName ?? slugMatchedRecords[0]?.positionName ?? fromSlug(slug);

  if (!base && slugMatchedRecords.length === 0) {
    return null;
  }

  const companyCompensation = base
    ? [...base.companyCompensation]
    : slugMatchedRecords.map((item) => ({
        company: item.company,
        averageSalary: item.averageSalary,
        averageBenefits: item.averageBenefits,
      }));

  const guestForPosition = guestEntries.filter((entry) => slugify(entry.positionName) === slug && entry.salary > 0);

  const guestGroupedByCompany = new Map<string, SalaryHistoryEntry[]>();
  guestForPosition.forEach((entry) => {
    const companyName = entry.companyName.trim().length > 0 ? entry.companyName.trim() : "Belirtilmedi";
    const bucket = guestGroupedByCompany.get(companyName) ?? [];
    bucket.push(entry);
    guestGroupedByCompany.set(companyName, bucket);
  });

  Array.from(guestGroupedByCompany.entries()).forEach(([companyName, entries]) => {
    companyCompensation.push({
      company: companyName,
      averageSalary: Math.round(entries.reduce((acc, item) => acc + item.salary, 0) / entries.length),
      averageBenefits: Math.round(entries.reduce((acc, item) => acc + parseBenefitAmount(item.benefits), 0) / entries.length),
    });
  });

  const companyCompensationDeduped = Array.from(
    companyCompensation.reduce((acc, item) => {
      const existing = acc.get(item.company);
      if (!existing) {
        acc.set(item.company, {
          company: item.company,
          averageSalary: item.averageSalary,
          averageBenefits: item.averageBenefits,
          count: 1,
        });
        return acc;
      }

      existing.averageSalary += item.averageSalary;
      existing.averageBenefits += item.averageBenefits;
      existing.count += 1;
      return acc;
    }, new Map<string, { company: string; averageSalary: number; averageBenefits: number; count: number }>()),
  ).map(([, item]) => ({
    company: item.company,
    averageSalary: Math.round(item.averageSalary / item.count),
    averageBenefits: Math.round(item.averageBenefits / item.count),
  }));

  const timelineBuckets = new Map<number, number[]>();
  (base?.timeline ?? []).forEach((point) => {
    const bucket = timelineBuckets.get(point.year) ?? [];
    bucket.push(point.averageSalary);
    timelineBuckets.set(point.year, bucket);
  });

  guestForPosition.forEach((entry) => {
    const year = extractYear(entry.startDate);
    if (!year) {
      return;
    }
    const bucket = timelineBuckets.get(year) ?? [];
    bucket.push(entry.salary);
    timelineBuckets.set(year, bucket);
  });

  const timeline = Array.from(timelineBuckets.entries())
    .map(([year, salaries]) => ({
      year,
      averageSalary: Math.round(salaries.reduce((acc, value) => acc + value, 0) / salaries.length),
    }))
    .sort((a, b) => a.year - b.year);

  return {
    positionName,
    companyCompensation: companyCompensationDeduped,
    timeline,
  };
};
