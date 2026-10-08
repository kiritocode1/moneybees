import { revalidatePath } from "next/cache";

/** The pages that draw each product's fact sheet. A product not listed here shows only on /performance. */
const PAGES: Record<string, readonly string[]> = {
  "moneybee-pms": ["/", "/pms", "/performance"],
  flyingbee: ["/aif", "/performance"],
};

/** Rebuilds every static page that shows `productSlug`'s numbers, after a publish. */
export function revalidateProduct(productSlug: string) {
  for (const path of PAGES[productSlug] ?? ["/performance"]) revalidatePath(path);
}
