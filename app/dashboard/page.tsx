import { CardSkeleton } from "@/components/skelettons/skeletons";
import Card from "@/components/ui/Card";

import {
  getFournituresLength,
  getLastFiveTransactions,
  getLastTenArticles,
  getTransactionssLength,
  getUsersLength,
} from "@/lib/actions/api";
import React, { Suspense } from "react";

import { IoStatsChart } from "react-icons/io5";
import { BsGraphUpArrow } from "react-icons/bs";
import { ImStatsBars2 } from "react-icons/im";
import { Calendar } from "lucide-react";
import { TransArt, Transaction } from "@/lib/types";
import Chart from "@/components/ui/Chart";

const DashboardPage = async () => {
  const convertedDate = (date: Date | undefined) => {
    if (date) {
      const convertedDate = new Date(date).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      });

      return convertedDate;
    }
  };
  const fournituresLength = await getFournituresLength();
  const userLength = await getUsersLength();
  const transactionsLength = await getTransactionssLength();

  const transactions: Transaction[] = await getLastFiveTransactions();

  const articles: TransArt[] = await getLastTenArticles();

  return (
    <section className="flex flex-col items-start w-full h-full gap-20 p-4">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Suspense key={fournituresLength} fallback={<CardSkeleton />}>
          <Card
            l={fournituresLength}
            colorType="#f97316"
            icon={IoStatsChart}
            title="Articles"
            hour="20:15"
          />
        </Suspense>
        <Suspense key={userLength} fallback={<CardSkeleton />}>
          <Card
            l={userLength}
            colorType="#6366f1"
            icon={ImStatsBars2}
            title="Utilisateurs"
            hour="10:15"
          />
        </Suspense>
        <Suspense key={transactionsLength} fallback={<CardSkeleton />}>
          <Card
            l={transactionsLength}
            colorType="#ef4444"
            icon={BsGraphUpArrow}
            title="Transactions"
            hour="17:15"
          />
        </Suspense>
      </div>
      <div className="w-full flex flex-col md:flex-row items-start gap-8 mt-10">
        <div
          className="flex flex-col items-start gap-4 bg-white p-4"
          style={{
            boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
          }}
        >
          <div className="flex items-center gap-2">
            <Calendar size={20} className="text-gray-600" />
            <span className="font-semibold text-gray-600">
              Dernieres transactions
            </span>
          </div>
          {transactions.map((trans, index) => (
            <div
              key={trans._id}
              className={`w-full flex items-start gap-2 ${
                index < 4 ? "pb-4 border-b border-gray-200" : ""
              }`}
            >
              <span
                className={`flex items-center justify-center h-[6px] w-[6px] rounded-full mt-1 ${
                  index === 0 || index === 1
                    ? "bg-red-600"
                    : index === 2
                    ? "bg-blue-600"
                    : index === 3
                    ? "bg-orange-600"
                    : index === 4
                    ? "bg-emerald-600"
                    : ""
                }`}
              ></span>
              <div className="flex flex-col items-start gap-2">
                <span className="w-full flex items-center text-xs text-gray-600">
                  {`${convertedDate(trans.createdAt)} - ${trans.lastname} ${
                    trans.firstname
                  }`}
                </span>
                <div className="flex flex-col items-start gap-2">
                  <span className="text-sm font-semibold text-gray-800">
                    {trans.title}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <Suspense key={articles.length} fallback={<CardSkeleton />}>
        <Chart articles={articles} />
        </Suspense>
      </div>
      <div></div>
    </section>
  );
};

export default DashboardPage;
