/* One New application with must-haves, so the Guide's Hiring pictures have a row to number. Local only; not committed. */
import { readFileSync } from "node:fs";
import config from "@payload-config";
import { getPayload } from "payload";
import { receiveApplication } from "@/lib/hiring/apply";

await getPayload({ config });
if (!/localhost:54329/.test(process.env.DATABASE_URL ?? "")) throw new Error("Local database only.");
const result = await receiveApplication(
  {
    role: "equity-research",
    fields: { name: "Kunal Desai", email: "kunal.desai@example.com", phone: "+91 98190 33333", city: "Mumbai", notice: "30", why: "I cover consumer companies and want to hold views for years, not quarters.", consent: "yes" },
    mustHaves: ["yes", "yes", "yes"],
    resume: { bytes: new Uint8Array(readFileSync(".plannotator/hiring-cycle/check/Priya_Shah_Resume.pdf")), name: "Kunal_Desai_Resume.pdf" },
  },
  {},
);
console.log(JSON.stringify(result));
process.exit(0);
