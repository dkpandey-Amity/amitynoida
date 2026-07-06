// slug.utils.ts
export function generateSlug(facultySlug: string): string {
    return facultySlug
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '') // Remove invalid characters
        .trim()
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-'); // Replace multiple hyphens with a single hyphen
}
