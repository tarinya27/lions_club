export function slugify(input: string) {
  const base = input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
  return base || 'item';
}

export async function uniqueSlug(title: string, taken: (slug: string) => Promise<boolean>) {
  const root = slugify(title);
  let slug = root;
  let n = 2;
  while (await taken(slug)) {
    slug = `${root.slice(0, 70)}-${n}`;
    n += 1;
  }
  return slug;
}

export function parseDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T12:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function dateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}
