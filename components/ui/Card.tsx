import React from "react";
import { GoClock } from "react-icons/go";
import { IconType } from "react-icons/lib";

const Card = ({
  l,
  colorType,
  icon: Icon,
  title,
  hour
}: {
  l: number;
  colorType: string;
  icon: IconType;
  title: string;
  hour: string;
}) => {
  return (
    <div
      className={`flex flex-col p-4 rounded shadow-xl w-full  max-w-[300px] ${colorType}`}
      style={{
        background: `linear-gradient(to bottom, ${colorType}, ${colorType}88)`,
      }}
    >
      <div className="flex items-end justify-between pb-4 border-b border-gray-400">
        <div className="flex flex-col items-start">
          <span className="text-base text-white">{l}</span>

          <span className="text-sm text-white">{title}</span>
        </div>
        <span className="text-white text-3xl">
          <Icon />
        </span>
      </div>
      <div className="flex items-center gap-2 pt-4">
        <GoClock className="text-white text-[12px]" />
        <span className="text-white text-xs">Mis à jour à :{hour} am</span>
      </div>
    </div>
  );
};

export default Card;
