import { revalidatePath } from "next/cache";

/** The pages that draw each product's fact sheet. A product not listed here has no page showing its numbers yet. */
const PAGES: Record<string, readonly string[]> = {
  "moneybee-pms": ["/", "/pms"],
  flyingbee: ["/aif"],
};

/** Rebuilds every static page that shows `productSlug`'s numbers, after a publish. */
export function revalidateProduct(productSlug: string) {
  for (const path of PAGES[productSlug] ?? []) revalidatePath(path);
}
