import type { LostItem } from "@/providers/auth-context";
import { faker } from "@faker-js/faker";

const categories = [
  "Electronics",
  "Books",
  "Clothing",
  "Accessories",
  "Documents",
  "Bags",
  "Keys",
  "Others",
];

export function generateMockItems(count = 60): LostItem[] {
  return Array.from({ length: count }).map((_, i) => {
    const images = Array.from({
      length: faker.number.int({ min: 1, max: 5 }),
    }).map(() => faker.image.urlPicsumPhotos({ width: 400, height: 300 }));
    const status = faker.helpers.arrayElement([
      "Available",
      "Pending Verification",
      "Available",
    ]) as LostItem["status"];
    return {
      id: i + 1,
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      category: categories[i % categories.length],
      foundAt: faker.location.street(),
      checkpointOffice: faker.company.name(),
      date: faker.date
        .between({ from: "2025-09-01", to: "2025-09-28" })
        .toISOString()
        .slice(0, 10),
      keyedInDate: faker.date
        .between({ from: "2025-09-01", to: "2025-09-28" })
        .toISOString()
        .slice(0, 10),
      retentionPeriod: faker.number.int({ min: 1, max: 30 }),
      status,
      founder: faker.person.fullName(),
      features: faker.datatype.boolean()
        ? [faker.commerce.productAdjective(), faker.commerce.productMaterial()]
        : undefined,
      images,
      mainImage: images[0],
    };
  });
}
