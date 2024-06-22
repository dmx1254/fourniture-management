"use client";

import { pagination } from "@/lib/utils";
import clsx from "clsx";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";

export const Pagination = ({
  totalPages,
  currentPage,
}: {
  totalPages: number;
  currentPage: number;
}) => {
  const pages = pagination(currentPage, totalPages);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();


  const handlePageParams = (page: string | number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center justify-between w-full mt-4 select-none">
      <button
        className={clsx(
          "flex items-center gap-1 text-sm border border-[#111b21] bg-[#111b21] text-gray-500 rounded p-1 xs:p-2 outline-none",
          {
            "opacity-90 pointer-events-none": currentPage === 1,
          }
        )}
        onClick={() => handlePageParams(currentPage - 1)}
      >
        <GoArrowLeft />
        Previous
      </button>
      <div className="flex items-center gap-2">
        {pages?.map((page, index) => (
          <span
            key={index}
            className={clsx(
              "flex items-center justify-center h-5 w-5 xs:h-6 xs:w-6 p-1 text-sm font-normal rounded text-[#111b21] cursor-pointer",
              {
                "font-extrabold bg-[#111b21] text-gray-400": currentPage === page,
              }
            )}
            onClick={() => handlePageParams(page)}
            
          >
            {page}
          </span>
        ))}
      </div>
      <button
        className={clsx(
          "flex items-center gap-1 text-sm border border-[#111b21] bg-[#111b21] text-gray-500 rounded p-1 xs:p-2 cursor-pointer outline-none",

          {
            "pointer-events-none opacity-90": currentPage === totalPages,
          }
        )}
        onClick={() => handlePageParams(currentPage + 1)}
      >
        Next
        <GoArrowRight />
      </button>
    </div>
  );
};
