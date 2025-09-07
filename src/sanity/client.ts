import { createClient } from "next-sanity";

export const client = createClient({
  projectId: "9l1n2im5",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false, // set true only if dataset is public and you prefer cached reads
});
