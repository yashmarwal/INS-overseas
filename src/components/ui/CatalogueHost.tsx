import CatalogueDialog from "@/components/ui/CatalogueDialog";
import { closeCatalogue, useCatalogueUi } from "@/lib/catalogueUi";
import { useCatalogueOptions } from "@/hooks/useCatalogueOptions";

// Mounted (lazily) by the app shell after the first click on any "Download catalogue" button.
export default function CatalogueHost() {
  const ui = useCatalogueUi();
  const { options, loading } = useCatalogueOptions(ui.open);
  return <CatalogueDialog open={ui.open} onClose={closeCatalogue} options={options} initialKey={ui.initialKey} loading={loading} />;
}
