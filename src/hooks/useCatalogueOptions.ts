import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { productsQuery, tagLabel } from "@/hooks/useProductImages";
import { useCategories } from "@/hooks/useCategories";
import { useProductTerms } from "@/hooks/useProductTerms";
import { useProductDetails } from "@/hooks/useProductDetails";
import { getProductDetails, specLine } from "@/data/productDetails";
import { CATEGORY_PILLS, categoryLabel, productLead, productMoq } from "@/data/catalogue";
import { staticProducts } from "@/data/staticProducts";
import { useEnquiryList } from "@/lib/enquiryList";
import { productShareUrl } from "@/lib/share";
import type { CatalogItem } from "@/lib/catalogPdf";
import type { CatalogOption } from "@/components/ui/CatalogueDialog";

// What the catalogue PDF can contain, from the products loaded right now: everything, each category that has products
// (built-in first, then the admin's own), and the visitor's quote list. Works on any page: it fetches the products itself.
export function useCatalogueOptions(enabled: boolean): { options: CatalogOption[]; loading: boolean } {
  const q = useQuery({ ...productsQuery(), enabled });
  const { custom, loading: catsLoading } = useCategories();
  const { terms, loading: termsLoading } = useProductTerms();
  const { details } = useProductDetails(); // (the code and size are read as the PDF is built; nothing here waits for them)
  const quote = useEnquiryList();

  const options = useMemo(() => {
    const rows = q.data ?? [];
    const products = rows.length
      ? rows.map((d) => ({ id: d.id, name: d.product_name || "Handmade Product", category: d.category || "handmade-deckle-edge-paper", image: d.url, description: d.alt_text || "", tag: d.tag }))
      : q.isSuccess || q.isError ? staticProducts.map((p) => ({ ...p, tag: null as string | null | undefined })) : [];
    const toItem = (p: (typeof products)[number]): CatalogItem => ({
      id: p.id,
      name: p.name,
      category: categoryLabel(p.category),
      description: p.description,
      image: p.image,
      moq: productMoq(p.id, p.category),
      lead: productLead(p.id),
      url: productShareUrl(p.id),
      tag: tagLabel(p.tag),
      code: getProductDetails(p.id)?.code,
      specs: specLine(getProductDetails(p.id)),
    });
    const opts: CatalogOption[] = [{ key: "all", label: "All products", items: products.map(toItem) }];
    const groups = [...CATEGORY_PILLS.map((c) => ({ key: c.key as string, label: c.label as string })), ...custom.map((c) => ({ key: c.id, label: c.label }))];
    for (const g of groups) {
      const items = products.filter((p) => p.category === g.key).map(toItem);
      if (items.length) opts.push({ key: g.key, label: g.label, items });
    }
    const quoted = new Set(quote.map((i) => i.productId).filter(Boolean));
    const mine = products.filter((p) => quoted.has(p.id)).map(toItem);
    if (mine.length) opts.push({ key: "quote", label: "My quote list", items: mine });
    return opts;
    // terms and custom are read inside productMoq / categoryLabel; listing them re-computes the options when they load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q.data, q.isSuccess, q.isError, custom, terms, details, quote]);

  return { options, loading: enabled && (q.isPending || catsLoading || termsLoading) };
}
