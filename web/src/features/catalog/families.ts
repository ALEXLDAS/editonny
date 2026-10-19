const PROFESSIONS = new Set(['Real estate', 'Health', 'Nutrition', 'Legal', 'Creators']);

/** Key of the family that groups every profession category with its panels and demonstrations. */
export const PROFESSIONS_FAMILY = 'Professions';

/** Scene family for the home library filters: profession categories collapse into one family, the rest keep their category. */
export const familyOf = (category: string): string =>
  PROFESSIONS.has(category) || / (panels|demonstrations)$/.test(category) ? PROFESSIONS_FAMILY : category;
