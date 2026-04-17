import { PositionDetails, PositionRecord, SalaryHistoryEntry, UserProfile } from "@/lib/types";

export const mockProfile: UserProfile = {
  gender: "Female",
  ageGroup: "18-35",
  profession: "Frontend Engineer",
  yearsOfExperience: 6,
  skills: ["React", "TypeScript", "System Design"],
  militaryServiceStatus: "Completed",
  maritalStatus: "Single",
  numberOfChildren: 0,
  citiesWorkedIn: "Istanbul, Berlin",
};

export const mockSalaryHistory: SalaryHistoryEntry[] = [
  {
    id: "1",
    startDate: "2019-01",
    endDate: "2020-06",
    companyName: "Nova Labs",
    cityName: "İstanbul",
    positionName: "Junior Frontend Engineer",
    salary: 52000,
    benefits: "7000 bonus",
  },
  {
    id: "2",
    startDate: "2020-07",
    endDate: "2022-03",
    companyName: "Scale River",
    cityName: "Berlin",
    positionName: "Frontend Engineer",
    salary: 76000,
    benefits: "12000 bonus + private health",
  },
];

export const mockPositionRecords: PositionRecord[] = [
  {
    id: "p1",
    positionName: "Frontend Engineer",
    company: "Nova Labs",
    location: "Remote",
    averageSalary: 112000,
    averageBenefits: 18500,
    level: "Mid",
  },
  {
    id: "p2",
    positionName: "Frontend Engineer",
    company: "Scale River",
    location: "London",
    averageSalary: 125000,
    averageBenefits: 20500,
    level: "Senior",
  },
  {
    id: "p3",
    positionName: "Product Designer",
    company: "Northwind",
    location: "Amsterdam",
    averageSalary: 98000,
    averageBenefits: 13200,
    level: "Mid",
  },
  {
    id: "p4",
    positionName: "Data Scientist",
    company: "Quanta Grid",
    location: "Berlin",
    averageSalary: 135000,
    averageBenefits: 22500,
    level: "Senior",
  },
];

export const mockPositionDetailsBySlug: Record<string, PositionDetails> = {
  "frontend-engineer": {
    positionName: "Frontend Engineer",
    companyCompensation: [
      { company: "Nova Labs", averageSalary: 112000, averageBenefits: 18500 },
      { company: "Scale River", averageSalary: 125000, averageBenefits: 20500 },
      { company: "Orbitly", averageSalary: 118000, averageBenefits: 17200 },
    ],
    timeline: [
      { year: 2013, averageSalary: 54000 },
      { year: 2015, averageSalary: 67000 },
      { year: 2018, averageSalary: 82000 },
      { year: 2021, averageSalary: 101000 },
      { year: 2025, averageSalary: 119000 },
    ],
  },
  "data-scientist": {
    positionName: "Data Scientist",
    companyCompensation: [
      { company: "Quanta Grid", averageSalary: 135000, averageBenefits: 22500 },
      { company: "Blue Maven", averageSalary: 129000, averageBenefits: 19900 },
      { company: "Signal Forge", averageSalary: 141000, averageBenefits: 24300 },
    ],
    timeline: [
      { year: 2013, averageSalary: 63000 },
      { year: 2015, averageSalary: 78000 },
      { year: 2018, averageSalary: 97000 },
      { year: 2021, averageSalary: 118000 },
      { year: 2025, averageSalary: 138000 },
    ],
  },
};
