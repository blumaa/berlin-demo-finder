const DEFAULT_PAGE_SIZE = 1000;

type PaginateResult<T> = { data: T[] | null; error: { message: string } | null };

export async function paginateQuery<T>(
  queryFn: (from: number, to: number) => PaginateResult<T> | PromiseLike<PaginateResult<T>>,
  pageSize: number = DEFAULT_PAGE_SIZE
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

    if (data.length < pageSize) break;
    offset += pageSize;
  }

  return allRows;
}
