const shimmer =
  "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent";

export function InvoiceSkeleton() {
  return (
    <div className="flex flex-row items-center justify-between border-b dark:border-gray-700 border-gray-200 py-4">
      <div className="flex items-center">
        <div className="mr-2 h-8 w-8 rounded-full dark:bg-gray-400 bg-gray-200 animate-pulse" />
        <div className="min-w-0">
          <div className="h-5 w-40 rounded-md dark:bg-gray-400 bg-gray-200 animate-pulse" />
          <div className="mt-2 h-4 w-12 rounded-md dark:bg-gray-400 bg-gray-200 animate-pulse" />
        </div>
      </div>
      <div className="mt-2 h-6 w-16 rounded-md dark:bg-gray-400 bg-gray-200 animate-pulse" />
      <div className="mt-2 h-6 w-16 rounded-md dark:bg-gray-400 bg-gray-200 animate-pulse" />
      <div className="mt-2 h-6 w-16 rounded-md dark:bg-gray-400 bg-gray-200 animate-pulse" />
      <div className="mt-2 h-6 w-16 rounded-md dark:bg-gray-400 bg-gray-200 animate-pulse" />
    </div>
  );
}

export default function LatestInvoicesSkeleton() {
  return (
    <div
      className={`${shimmer} relative flex w-full flex-col overflow-hidden md:col-span-4`}
    >
      {/* <div className="mb-4 h-8 w-36 rounded-md bg-gray-100" /> */}
      <div className="flex grow flex-col justify-between rounded-xl dark:bg-[#1c1d22] bg-white p-4">
        <div className="dark:bg-[#1c1d22] bg-white px-6">
          <InvoiceSkeleton />
          <InvoiceSkeleton />
          <InvoiceSkeleton />
          <InvoiceSkeleton />
          <InvoiceSkeleton />
          <InvoiceSkeleton />
          <InvoiceSkeleton />
          <InvoiceSkeleton />
          <InvoiceSkeleton />
          <InvoiceSkeleton />
          <div className="flex items-center pb-2 pt-6">
            {/* <div className="h-5 w-5 rounded-full bg-gray-200" />
            <div className="ml-2 h-4 w-20 rounded-md bg-gray-200" /> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export const BeforeTabs = () => {
  return (
    <div className="flex items-center justify-between w-full mt-4">
      <div className="flex items-center gap-4">
        <div className="ml-2 h-8 w-24 rounded-md dark:bg-gray-400 bg-gray-200 animate-pulse text-sm font-medium" />
        <div className="ml-2 h-8 w-24 rounded-md dark:bg-gray-400 bg-gray-200 animate-pulse text-sm font-medium" />
      </div>
      <div className="flex items-center gap-4">
        <div className="ml-2 h-8 w-24 rounded-md dark:bg-gray-400 bg-gray-200 animate-pulse text-sm font-medium" />
        <div className="ml-2 h-8 w-8 rounded-md dark:bg-gray-400 bg-gray-200 animate-pulse text-sm font-medium" />
      </div>
    </div>
  );
};

export const CardSkeleton = () => {
  return (
    <div
      className={`${shimmer} flex flex-col items-start gap-6 w-[250px] p-4 rounded dark:shadow-sm shadow-xl dark:bg-[#1c1d22]`}
    >
      <div className="flex items-center justify-between w-full">
        <div className="h-5 w-5 rounded-md dark:bg-gray-400 bg-gray-200 animate-pulse" />
        <div className="ml-2 h-6 w-16 rounded-md dark:bg-gray-400 bg-gray-200 animate-pulse text-sm font-medium" />
      </div>
      <div className="flex items-center justify-between w-full">
        <div className="h-5 w-5 rounded-md dark:bg-gray-400 bg-gray-200 animate-pulse" />
        <div className="ml-2 h-6 w-16 rounded-md dark:bg-gray-400 bg-gray-200 animate-pulse text-sm font-medium" />
      </div>
    </div>
  );
};

export const UserTop = () => {
  return (
    <div className="flex items-center justify-between w-full">
      <div>
        <div className="h-5 w-10 rounded-md dark:bg-gray-400 bg-gray-200 animate-pulse" />
      </div>

      <div className="flex items-center gap-4">
        <div className="h-6 w-16 rounded-md dark:bg-gray-400 bg-gray-200 animate-pulse" />
        <div className="ml-2 h-6 w-16 rounded-md dark:bg-gray-400 bg-gray-200 animate-pulse text-sm font-medium" />
        <div className="ml-2 h-6 w-16 rounded-md dark:bg-gray-400 bg-gray-200 animate-pulse text-sm font-medium" />
      </div>
    </div>
  );
};
