export type AgeGroup = "18-" | "18-35" | "35+";

export interface UserProfile {
  gender: string;
  ageGroup: AgeGroup;
  profession: string;
  yearsOfExperience: number;
  skills: string[];
  militaryServiceStatus: string;
  maritalStatus: string;
  numberOfChildren: number;
  citiesWorkedIn: string;
}

export interface SalaryHistoryEntry {
  id: string;
  startDate: string;
  endDate: string;
  companyName: string;
  cityName: string;
  positionName: string;
  salary: number;
  benefits: string;
}

export interface PositionRecord {
  id: string;
  positionName: string;
  company: string;
  location: string;
  averageSalary: number;
  averageBenefits: number;
  level: string;
}

export interface PositionTimelinePoint {
  year: number;
  averageSalary: number;
}

export interface PositionDetails {
  positionName: string;
  companyCompensation: Array<{
    company: string;
    averageSalary: number;
    averageBenefits: number;
  }>;
  timeline: PositionTimelinePoint[];
}
