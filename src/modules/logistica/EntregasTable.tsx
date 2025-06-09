import { DataTable } from '@/components/ui/data-table';
import { deliveryColumns, type Delivery, type DeliveryTableMeta } from '@/app/(dashboard)/logistica/_components/DeliveryColumns';

interface EntregasTableProps {
  data: Delivery[];
  loading?: boolean;
  meta?: DeliveryTableMeta;
}

export function EntregasTable({ data, loading, meta }: EntregasTableProps) {
  return <DataTable columns={deliveryColumns} data={data} loading={loading} meta={meta} />;
}
