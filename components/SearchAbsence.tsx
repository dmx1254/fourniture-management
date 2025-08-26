"use client";
import { ChangeEvent, useState } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { CiSearch } from "react-icons/ci";
import { ListFilter } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CalendarIcon,
  FilterIcon,
  XCircleIcon,
  CheckCircleIcon,
} from "lucide-react";

export default function SearchAbsence({
  placeholder,
}: {
  placeholder: string;
}) {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();
  const [startDate, setStartDate] = useState<string | null>();
  const [endDate, setEndDate] = useState<string | null>();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleSearchChange = useDebouncedCallback((searchTerm: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (searchTerm) {
      params.set("query", searchTerm);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 600);

  const handleDateChange = (startDate: string, endDate: string) => {
    setStartDate(startDate);
    setEndDate(endDate);
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (startDate) {
      params.set("startDate", startDate);
    } else {
      params.delete("startDate");
    }
    if (endDate) {
      params.set("endDate", endDate);
    } else {
      params.delete("endDate");
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="w-full relative flex">
      <input
        type="text"
        name="searchinput"
        id="searchinput"
        placeholder={placeholder}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          handleSearchChange(e.target.value)
        }
        defaultValue={searchParams.get("query")?.toString()}
        className="w-full text-sm py-2 rounded-[10px] text-white/80 bg-[#052e16] border-none placeholder:text-white/60 outline-none px-8"
      />
      <CiSearch className="absolute text-white/60 text-[22px] top-[21%] left-[2%]" />

      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <button className="absolute text-white/80 text-[22px] top-[21%] right-[2%]">
            <ListFilter size={18} />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-[450px] max-h-[80vh] p-0 border-0 shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 rounded-3xl max-h-[80vh] overflow-y-auto">
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={() => setIsPopoverOpen(false)}
                className="text-white/70 hover:text-white transition-colors hover:scale-110 bg-black/20 hover:bg-black/40 p-2 rounded-full"
                title="Fermer"
              >
                <XCircleIcon className="w-5 h-5" />
              </button>
            </div>

            {/* <div className="text-center mb-2">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-2">
                <CalendarIcon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Filtrer par période
              </h3>
              <p className="text-purple-200 text-sm">
                Sélectionnez une période pour filtrer les demandes d'absence
              </p>
            </div> */}

            <div className="space-y-3">
              {/* Date de début */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-purple-200 flex items-center gap-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full"></div>
                  Date de début
                </label>
                <div className="relative group">
                  <input
                    type="date"
                    value={startDate || ""}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-5 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-300 text-white placeholder-white/50 font-medium shadow-lg hover:bg-white/20 hover:border-white/30"
                    placeholder="Sélectionner une date"
                  />
                  {startDate && (
                    <button
                      onClick={() => setStartDate("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 text-white/60 hover:text-red-400 transition-all duration-200 hover:scale-110 bg-red-500/20 hover:bg-red-500/30 rounded-full"
                      title="Effacer la date"
                    >
                      <XCircleIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {startDate && (
                  <div className="text-xs text-purple-200 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg border border-white/20">
                    📅 Date sélectionnée :{" "}
                    <span className="font-semibold text-white">
                      {new Date(startDate).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                )}
              </div>

              {/* Date de fin */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-purple-200 flex items-center gap-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"></div>
                  Date de fin
                </label>
                <div className="relative group">
                  <input
                    type="date"
                    value={endDate || ""}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate || undefined}
                    className="w-full px-5 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-300 text-white placeholder-white/50 font-medium shadow-lg hover:bg-white/20 hover:border-white/30"
                    placeholder="Sélectionner une date"
                  />
                  {endDate && (
                    <button
                      onClick={() => setEndDate("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 text-white/60 hover:text-red-400 transition-all duration-200 hover:scale-110 bg-red-500/20 hover:bg-red-500/30 rounded-full"
                      title="Effacer la date"
                    >
                      <XCircleIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {endDate && (
                  <div className="text-xs text-purple-200 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg border border-white/20">
                    📅 Date sélectionnée :{" "}
                    <span className="font-semibold text-white">
                      {new Date(endDate).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="mt-4 flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => handleDateChange(startDate!, endDate!)}
                disabled={!startDate || !endDate}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none enabled:hover:scale-105 enabled:active:scale-95"
              >
                <FilterIcon className="w-4 h-4 mr-2 inline" />
                Appliquer le filtre
              </button>

              {(startDate || endDate) && (
                <button
                  onClick={() => {
                    setStartDate("");
                    setEndDate("");
                    // Réinitialiser le filtre si nécessaire
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  <XCircleIcon className="w-4 h-4 mr-2 inline" />
                  Effacer le filtre
                </button>
              )}
            </div>

            {/* Résumé du filtre actif */}
            {(startDate || endDate) && (
              <div className="mt-5 p-4 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-sm rounded-xl border border-emerald-400/30">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full flex items-center justify-center">
                    <CheckCircleIcon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-base font-bold text-emerald-200">
                    Filtre actif
                  </span>
                </div>
                <div className="text-emerald-100 text-sm leading-relaxed">
                  {startDate && endDate ? (
                    <>
                      🗓️ Période du{" "}
                      <span className="font-bold text-white">
                        {new Date(startDate).toLocaleDateString("fr-FR")}
                      </span>{" "}
                      au{" "}
                      <span className="font-bold text-white">
                        {new Date(endDate).toLocaleDateString("fr-FR")}
                      </span>
                    </>
                  ) : startDate ? (
                    <>
                      📅 À partir du{" "}
                      <span className="font-bold text-white">
                        {new Date(startDate).toLocaleDateString("fr-FR")}
                      </span>
                    </>
                  ) : (
                    <>
                      📅 Jusqu'au{" "}
                      <span className="font-bold text-white">
                        {new Date(endDate!).toLocaleDateString("fr-FR")}
                      </span>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
