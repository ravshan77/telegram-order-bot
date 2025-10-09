import {
    useMemo,
    useRef,
    useEffect,
    useState,
    useImperativeHandle,
} from 'react'
import classNames from 'classnames'
import { Table, Pagination, Select, Checkbox } from '@/shared/ui/kit'
import Loading from './Loading'
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender,
    ColumnDef,
    ColumnSort,
    Row,
    CellContext,
} from '@tanstack/react-table'
import type { TableProps, SkeletonProps, CheckboxProps } from '@/shared/ui/kit'
import type { Ref, ChangeEvent, ReactNode } from 'react'
import { FileNotFoundSvg } from '@/shared/ui/svg'
import TableRowSkeleton from '@/shared/ui/loaders/TableRowSkeleton'

export type OnSortParam = { order: 'asc' | 'desc' | ''; key: string | number }

type DataTableProps<T> = {
    columns: ColumnDef<T>[]
    customNoDataIcon?: ReactNode
    data?: unknown[]
    loading?: boolean
    noData?: boolean
    instanceId?: string
    onCheckBoxChange?: (checked: boolean, row: T) => void
    onIndeterminateCheckBoxChange?: (checked: boolean, rows: Row<T>[]) => void
    onPaginationChange?: (page: number) => void
    onSelectChange?: (num: number) => void
    onSort?: (sort: OnSortParam) => void
    pageSizes?: number[]
    selectable?: boolean
    selectClassName?: string;
    selectCellClassName?: string;
    skeletonAvatarColumns?: number[]
    skeletonAvatarProps?: SkeletonProps
    pagingData?: {
        total: number
        pageIndex: number
        pageSize: number
    }
    checkboxChecked?: (row: T) => boolean
    indeterminateCheckboxChecked?: (row: Row<T>[]) => boolean
    ref?: Ref<DataTableResetHandle | HTMLTableElement>
} & TableProps

type CheckBoxChangeEvent = ChangeEvent<HTMLInputElement>

interface IndeterminateCheckboxProps extends Omit<CheckboxProps, 'onChange'> {
    onChange: (event: CheckBoxChangeEvent) => void
    indeterminate: boolean
    onCheckBoxChange?: (event: CheckBoxChangeEvent) => void
    onIndeterminateCheckBoxChange?: (event: CheckBoxChangeEvent) => void
}

const { Tr, Th, Td, THead, TBody, Sorter } = Table

const IndeterminateCheckbox = (props: IndeterminateCheckboxProps) => {
    const {
        indeterminate,
        onChange,
        onCheckBoxChange,
        onIndeterminateCheckBoxChange,
        ...rest
    } = props

    const ref = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (typeof indeterminate === 'boolean' && ref.current) {
            ref.current.indeterminate = !rest.checked && indeterminate
        }

    }, [ref, indeterminate])

    const handleChange = (e: CheckBoxChangeEvent) => {
        onChange(e)
        onCheckBoxChange?.(e)
        onIndeterminateCheckBoxChange?.(e)
    }

    return (
        <Checkbox
            ref={ref}
            className="mb-0"
            onChange={(_, e) => handleChange(e)}
            {...rest}
        />
    )
}

export type DataTableResetHandle = {
    resetSorting: () => void
    resetSelected: () => void
}

function DataTable<T>(props: DataTableProps<T>) {
    const {
        skeletonAvatarColumns,
        columns: columnsProp = [],
        data = [],
        customNoDataIcon,
        loading,
        noData,
        onCheckBoxChange,
        onIndeterminateCheckBoxChange,
        onPaginationChange,
        onSelectChange,
        onSort,
        pageSizes = [10, 25, 50, 100],
        selectable = false,
        selectClassName = "",
        selectCellClassName = "",
        skeletonAvatarProps,
        pagingData = {
            total: 0,
            pageIndex: 1,
            pageSize: 10,
        },
        checkboxChecked,
        indeterminateCheckboxChecked,
        instanceId = 'data-table',
        ref,
        ...rest
    } = props

    const { pageSize, pageIndex, total } = pagingData

    const [sorting, setSorting] = useState<ColumnSort[] | null>(null)

    const pageSizeOption = useMemo(
        () =>
            pageSizes.map((number) => ({
                value: number,
                label: `${number} / page`,
            })),
        [pageSizes],
    )

    useEffect(() => {
        if (Array.isArray(sorting)) {
            const sortOrder =
                sorting.length > 0 ? (sorting[0].desc ? 'desc' : 'asc') : ''
            const id = sorting.length > 0 ? sorting[0].id : ''
            onSort?.({ order: sortOrder, key: id })
        }
    }, [sorting])

    const handleIndeterminateCheckBoxChange = (
        checked: boolean,
        rows: Row<T>[],
    ) => {
        if (!loading) {
            onIndeterminateCheckBoxChange?.(checked, rows)
        }
    }

    const handleCheckBoxChange = (checked: boolean, row: T) => {
        if (!loading) {
            onCheckBoxChange?.(checked, row)
        }
    }

    const finalColumns: ColumnDef<T>[] = useMemo(() => {
        const columns = columnsProp

        if (selectable) {
            return [
                {
                    id: 'select',
                    maxSize: 20,
                    meta: {
                        cellClassName: `${selectCellClassName}`,
                    },
                    header: ({ table }) => (
                        <IndeterminateCheckbox
                            className={selectClassName}
                            checked={
                                indeterminateCheckboxChecked
                                    ? indeterminateCheckboxChecked(
                                          table.getRowModel().rows,
                                      )
                                    : table.getIsAllRowsSelected()
                            }
                            indeterminate={table.getIsSomeRowsSelected()}
                            onChange={table.getToggleAllRowsSelectedHandler()}
                            onIndeterminateCheckBoxChange={(e) => {
                                handleIndeterminateCheckBoxChange(
                                    e.target.checked,
                                    table.getRowModel().rows,
                                )
                            }}
                        />
                    ),
                    cell: ({ row }) => (
                        <IndeterminateCheckbox
                            className={selectClassName}
                            checked={
                                checkboxChecked
                                    ? checkboxChecked(row.original)
                                    : row.getIsSelected()
                            }
                            disabled={!row.getCanSelect()}
                            indeterminate={row.getIsSomeSelected()}
                            onChange={row.getToggleSelectedHandler()}
                            onCheckBoxChange={(e) =>
                                handleCheckBoxChange(
                                    e.target.checked,
                                    row.original,
                                )
                            }
                        />
                    ),
                },
                ...columns,
            ]
        }
        return columns
    }, [columnsProp, selectable, loading, checkboxChecked])

    const table = useReactTable({
        data,
        columns: finalColumns as ColumnDef<unknown | object | any[], any>[],
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        manualPagination: true,
        manualSorting: true,
        onSortingChange: (sorter) => {
            setSorting(sorter as ColumnSort[])
        },
        state: {
            sorting: sorting as ColumnSort[],
        },
    })

    const resetSorting = () => {
        table.resetSorting()
    }

    const resetSelected = () => {
        table.resetRowSelection(true)
    }

    useImperativeHandle(ref, () => ({
        resetSorting,
        resetSelected,
    }))

    const handlePaginationChange = (page: number) => {
        if (!loading) {
            resetSelected()
            onPaginationChange?.(page)
        }
    }

    const handleSelectChange = (value?: number) => {
        if (!loading) {
            onSelectChange?.(Number(value))
        }
    }

    return (
        <Loading loading={Boolean(loading && data.length !== 0)} type="cover">
            <Table {...rest}>
                <THead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <Tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                const meta: {cellClassName?: string; cellStyle?: Record<string, string | number>} = header.column.columnDef?.meta || {}

                                return (
                                    <Th
                                        key={header.id}
                                        colSpan={header.colSpan}
                                        className={meta.cellClassName}
                                        style={meta.cellStyle}
                                    >
                                        {header.isPlaceholder ? null : (
                                            <div
                                                className={classNames(
                                                    header.column.getCanSort() &&
                                                        'cursor-pointer select-none point',
                                                    loading &&
                                                        'pointer-events-none',
                                                )}
                                                onClick={header.column.getToggleSortingHandler()}
                                            >
                                                {flexRender(
                                                    header.column.columnDef
                                                        .header,
                                                    header.getContext(),
                                                )}
                                                {header.column.getCanSort() && (
                                                    <Sorter
                                                        sort={header.column.getIsSorted()}
                                                    />
                                                )}
                                            </div>
                                        )}
                                    </Th>
                                )
                            })}
                        </Tr>
                    ))}
                </THead>
                {loading && data.length === 0 ? (
                    <TableRowSkeleton
                        columns={(finalColumns as Array<T>).length}
                        rows={pagingData.pageSize}
                        avatarInColumns={skeletonAvatarColumns}
                        avatarProps={skeletonAvatarProps}
                    />
                ) : (
                    <TBody>
                        {noData ? (
                            <Tr>
                                <Td
                                    className="hover:bg-transparent"
                                    colSpan={finalColumns.length}
                                >
                                    <div className="flex flex-col items-center gap-4">
                                        {customNoDataIcon ? (
                                            customNoDataIcon
                                        ) : (
                                            <>
                                                <FileNotFoundSvg />
                                                <span className="font-semibold">
                                                    No data found!
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </Td>
                            </Tr>
                        ) : (
                            table
                                .getRowModel()
                                .rows.slice(0, pageSize)
                                .map((row) => {
                                    return (
                                        <Tr key={row.id}>
                                            {row
                                                .getVisibleCells()
                                                .map((cell) => {
                                                    const meta: {cellClassName?: string; cellStyle?: Record<string, string | number>} = cell.column.columnDef?.meta || {}
                                                    return (
                                                        <Td
                                                            key={cell.id}
                                                            className={meta.cellClassName}
                                                            style={{
                                                                width: cell.column.getSize(),
                                                            }}
                                                        >
                                                            {flexRender(
                                                                cell.column
                                                                    .columnDef
                                                                    .cell,
                                                                cell.getContext(),
                                                            )}
                                                        </Td>
                                                    )
                                                })}
                                        </Tr>
                                    )
                                })
                        )}
                    </TBody>
                )}
            </Table>
            <div className="flex items-center justify-between mt-4">
                <Pagination
                    pageSize={pageSize}
                    currentPage={pageIndex}
                    total={total}
                    onChange={handlePaginationChange}
                />
                <div style={{ minWidth: 130 }}>
                    <Select
                        instanceId={instanceId}
                        size="sm"
                        menuPlacement="top"
                        isSearchable={false}
                        value={pageSizeOption.filter(
                            (option) => option.value === pageSize,
                        )}
                        options={pageSizeOption}
                        onChange={(option) => handleSelectChange(option?.value)}
                    />
                </div>
            </div>
        </Loading>
    )
}

export type { ColumnDef, Row, CellContext }
export default DataTable
