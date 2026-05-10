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
    startDate: "2019-01-01",
    endDate: "2020-06-30",
    companyName: "Nova Labs",
    cityName: "İstanbul",
    positionName: "Frontend Engineer",
    salary: 52000,
    benefits: "Gıda yardımı, Çocuk Eğitim Yardımı, Performansa dayalı prim ve sosyal faaliyetler",
  },
  {
    id: "2",
    startDate: "2020-07-01",
    endDate: "2022-03-31",
    companyName: "Scale River",
    cityName: "London",
    positionName: "Frontend Engineer",
    salary: 76000,
    benefits: "Hijyen yardımı, Yol yardımı, Özel sağlık sigortası ve Eğitim ve sertifika desteği",
  },
  {
    id: "3",
    startDate: "2018-02-01",
    endDate: "2019-12-31",
    companyName: "Northwind",
    cityName: "Amsterdam",
    positionName: "Product Designer",
    salary: 98000,
    benefits: "Araç veya yakıt desteği, Teknolojik ekipman desteği ve Özel sağlık sigortası",
  },
  {
    id: "4",
    startDate: "2021-04-01",
    endDate: "2023-03-31",
    companyName: "Quanta Grid",
    cityName: "Berlin",
    positionName: "Data Scientist",
    salary: 135000,
    benefits: "Yol yardımı, Gıda yardımı, Özel sağlık sigortası ve performansa dayalı prim",
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
  "product-designer": {
    positionName: "Product Designer",
    companyCompensation: [
      { company: "Northwind", averageSalary: 98000, averageBenefits: 13200 },
      { company: "Creative Labs", averageSalary: 102000, averageBenefits: 14500 },
      { company: "Pixel Studio", averageSalary: 94000, averageBenefits: 12800 },
    ],
    timeline: [
      { year: 2014, averageSalary: 52000 },
      { year: 2016, averageSalary: 69000 },
      { year: 2019, averageSalary: 83000 },
      { year: 2022, averageSalary: 96000 },
      { year: 2025, averageSalary: 104000 },
    ],
  },
};
