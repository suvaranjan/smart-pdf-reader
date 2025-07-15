"use client";

import React from "react";
import { usePDF } from "@/context/PDFContext";
import { usePathname, useRouter } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";

function PageNavigation() {
  const {
    pageNumbers,
    loading: { isLoading },
  } = usePDF();

  const pathname = usePathname();
  const router = useRouter();

  const currentPage = (() => {
    const match = pathname.match(/\/(\d+)$/);
    return match ? parseInt(match[1], 10) : 1;
  })();

  const isOcrRoute = pathname.includes("/pdf/ocr");
  const isNormalRoute = pathname.includes("/pdf/normal");

  const baseRoute = isOcrRoute
    ? "/pdf/ocr"
    : isNormalRoute
    ? "/pdf/normal"
    : "";

  const handleNavigation = (page: number) => {
    if (!isLoading && baseRoute) {
      router.push(`${baseRoute}/${page}`);
    }
  };

  if (!pageNumbers || pageNumbers.length === 0) return null;

  const isFirstPage = currentPage === pageNumbers[0];
  const isLastPage = currentPage === pageNumbers[pageNumbers.length - 1];

  // Get up to 3 visible pages depending on current page
  const getVisiblePages = (): number[] => {
    const total = pageNumbers.length;
    const index = pageNumbers.findIndex((p) => p === currentPage);

    if (total <= 3) {
      return pageNumbers;
    }

    if (currentPage <= 2) {
      return pageNumbers.slice(0, 3);
    }

    if (currentPage >= total - 1) {
      return pageNumbers.slice(total - 3);
    }

    return pageNumbers.slice(index - 1, index + 2);
  };

  const visiblePages = getVisiblePages();

  return (
    <Pagination className="mt-4 mb-2">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => handleNavigation(currentPage - 1)}
            aria-disabled={isFirstPage || isLoading}
            className={
              isFirstPage || isLoading
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>

        {visiblePages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              isActive={page === currentPage}
              onClick={() => handleNavigation(page)}
              aria-disabled={isLoading}
              className={
                isLoading ? "pointer-events-none opacity-50" : "cursor-pointer"
              }
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        {visiblePages[visiblePages.length - 1] <
          pageNumbers[pageNumbers.length - 1] && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        <PaginationItem>
          <PaginationNext
            onClick={() => handleNavigation(currentPage + 1)}
            aria-disabled={isLastPage || isLoading}
            className={
              isLastPage || isLoading
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

export default PageNavigation;
