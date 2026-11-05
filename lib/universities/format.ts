import type { ProgramLevel, TeachingLanguage, UniversityCategory } from "./types";

export const LEVEL_LABELS: Record<ProgramLevel, string> = {
  bachelor: "Bachelor's",
  master: "Master's",
  diploma: "Diploma",
  language: "Language",
};

export const CATEGORY_LABELS: Record<UniversityCategory, string> = {
  "project-985": "Project 985",
  "project-211": "Project 211",
  "double-first-class": "Double First-Class",
  regular: "General",
};

export const LANGUAGE_LABELS: Record<TeachingLanguage, string> = {
  english: "English-taught",
  chinese: "Chinese-taught",
  bilingual: "Bilingual",
};

export const formatCny = (value: number) => `¥${value.toLocaleString("en-US")}`;
