import seedSuperAdmin from "./super-admin-seed";

export default async function seed() {
  console.log("DB Seeding.......");
  const superAdmin = await seedSuperAdmin();
  console.log("DB Seeding Completed.");
}
