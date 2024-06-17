import { data } from "@/lib/data";
import React from "react";
import { GoClock } from "react-icons/go";

const DashboardPage = () => {
  return (
    <section className="flex flex-col items-start w-full h-full p-4">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {data?.map((item) => (
          <div
            className={`flex flex-col p-4 rounded shadow-xl w-[250px] ${item?.colorType}`}
            key={item?.id}
            style={{
              background: `linear-gradient(to bottom, ${item?.colorType}, ${item?.colorType}88)`,
            }}
          >
            <div className="flex items-end justify-between pb-4 border-b border-gray-400">
              <div className="flex flex-col items-start">
                {item.price ? (
                  <span className="text-base text-white">{item.price}</span>
                ) : (
                  <span className="text-base text-white">{item.item}</span>
                )}

                <span className="text-sm text-white">{item.title}</span>
              </div>
              <span className="text-white text-3xl">
                <item.icon />
              </span>
            </div>
            <div className="flex items-center gap-2 pt-4">
              <GoClock className="text-white text-[12px]" />
              <span className="text-white text-xs">update :{item.date} am</span>
            </div>
          </div>
        ))}
      </div>
      <div></div>
      <div></div>
    </section>
  );
};

export default DashboardPage;
