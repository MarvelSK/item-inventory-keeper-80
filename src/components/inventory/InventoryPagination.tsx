import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../ui/pagination";

interface InventoryPaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (value: string) => void;
}

export const InventoryPagination = ({
  currentPage,
  totalPages,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}: InventoryPaginationProps) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">Položky na stránku:</span>
        <Select
          value={itemsPerPage.toString()}
          onValueChange={onItemsPerPageChange}
        >
          <SelectTrigger className="w-[70px]">
            <SelectValue placeholder="50" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => onPageChange(currentPage - 1)}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
            >
              Predchádzajúca
            </PaginationPrevious>
          </PaginationItem>
          {Array.from({ length: Math.max(1, totalPages) }, (_, i) => i + 1).map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => onPageChange(page)}
                isActive={currentPage === page}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={() => onPageChange(currentPage + 1)}
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
            >
              Ďalšia
            </PaginationNext>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};