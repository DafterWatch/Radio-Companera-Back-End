import { MatPaginatorIntl } from '@angular/material/paginator';

export function CustomPaginator() {
  const customPaginatorIntl = new MatPaginatorIntl();

  customPaginatorIntl.itemsPerPageLabel = 'Items por página:';
  customPaginatorIntl.nextPageLabel = 'Siguiente página';
  customPaginatorIntl.previousPageLabel = 'Página anterior';

  return customPaginatorIntl;
}