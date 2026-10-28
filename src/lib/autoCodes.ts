import { assignCodes } from "@/lib/adminData";
import { planCodes } from "@/lib/productCodes";
import type { ProductDetails } from "@/data/productDetails";

// Item codes are given automatically: to every new product as it is added, and to any product that turns out to have none
// when the admin opens the Products screen. The numbering is the same as the "Give item codes" button (LJ-001, LJ-002 …).
// IMPORTANT for callers: pass the details as they are in the database RIGHT NOW (refetch first). Handing in an empty or
// out-of-date list would hand out codes that already exist.
const bare = (d?: ProductDetails): Omit<ProductDetails, "rowId"> => { if (!d) return { photos: [] }; const { rowId: _rowId, ...rest } = d; return rest; };

export async function assignMissingCodes(
  ordered: { id: string; category: string }[],
  details: Map<string, ProductDetails>,
  labelOf: (categoryId: string) => string,
): Promise<{ count: number; error?: string }> {
  const plan = planCodes(ordered, (id) => details.get(id)?.code ?? "", labelOf);
  if (plan.size === 0) return { count: 0 };
  const r = await assignCodes([...plan].map(([productId, code]) => ({ productId, rowId: details.get(productId)?.rowId, code, current: bare(details.get(productId)) })));
  return r.ok ? { count: plan.size } : { count: 0, error: r.message };
}
