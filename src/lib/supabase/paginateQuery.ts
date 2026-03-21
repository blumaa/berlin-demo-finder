const DEFAULT_PAGE_SIZE = 1000;

type PaginateResult<T> = { data: T[] | null; error: { message: string } | null };

const DEFAULT_MAX_ROWS = 10000;

export async function paginateQuery<T>(
  queryFn: (from: number, to: number) => PaginateResult<T> | PromiseLike<PaginateResult<T>>,
  pageSize: number = DEFAULT_PAGE_SIZE,
  maxRows: number = DEFAULT_MAX_ROWS
): Promise<T[]> {
  const allRows: T[] = [];
  let offset = 0;

  while (true) {
    const { data, error } = await queryFn(offset, offset + pageSize - 1);

    if (error) {
      throw new Error(error.message);
    }

    if (!data || data.length === 0) break;

    allRows.push(...data);

    if (allRows.length >= maxRows) {
      return allRows.slice(0, maxRows);
    }

    if (data.length < pageSize) break;
    offset += pageSize;
  }

  return allRows;
}
