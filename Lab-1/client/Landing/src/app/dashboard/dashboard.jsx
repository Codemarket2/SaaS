/**
 * Dashboard screen
 */

import React from "react";

import DotsImg from "../assets/icons/dots.png";
import CustomBarChart from "./custom-chart";

const Dashboard = () => {
  const data = [
    { year: "2006", SeriesA: 65, SeriesB: 28 },
    { year: "2007", SeriesA: 59, SeriesB: 48 },
    { year: "2008", SeriesA: 80, SeriesB: 40 },
    { year: "2009", SeriesA: 81, SeriesB: 19 },
    { year: "2010", SeriesA: 86, SeriesB: 56 },
    { year: "2011", SeriesA: 55, SeriesB: 27 },
    { year: "2012", SeriesA: 90, SeriesB: 40 },
  ];
  return (
    <div className="bg-gray-200 overflow-hidden">
      <div className="h-[70px] flex items-center pl-3">
        <h1 className="text-slate-800 text-[20px] font-semibold">Dashboard</h1>
      </div>
      <div
        className="w-full overflow-y-auto"
        style={{
          height: "calc(100vh - 150px)",
          maxHeight: "calc(100vh - 150px)",
        }}
      >
        <div className="m-4 p-4 mt-0 flex flex-col gap-7">
          <div className="h-[300px] w-full bg-white rounded-md shadow-md">
            <header className="w-full h-[30px] flex justify-between mt-2 px-1">
              <h1 className="font-semibold text-[16px] ml-6">Card 1</h1>
              <img src={DotsImg} className="h-5 max-h-5 cursor-pointer" />
            </header>
            <CustomBarChart data={data} height={250} />
          </div>
          <div className="flex gap-7 w-full">
            <div className="flex flex-col w-[50%] gap-7">
              <div className="h-[270px] bg-white rounded-md shadow-md">
                <header className="w-full h-[30px] flex justify-between mt-2 px-1">
                  <h1 className="font-semibold text-[16px] ml-6">Card 2</h1>
                  <img src={DotsImg} className="h-5 max-h-5 cursor-pointer" />
                </header>
                <CustomBarChart data={data} height={200} />
              </div>
              <div className="h-[270px] bg-white rounded-md shadow-md">
                <header className="w-full h-[30px] flex justify-between mt-2 px-1">
                  <h1 className="font-semibold text-[16px] ml-6">Card 3</h1>
                  <img src={DotsImg} className="h-5 max-h-5 cursor-pointer" />
                </header>
                <CustomBarChart data={data} height={200} />
              </div>
            </div>
            <div className="w-[50%] bg-white rounded-md shadow-md">
              <header className="w-full h-[30px] flex justify-between mt-2 px-1">
                <h1 className="font-semibold text-[16px] ml-6">Card 4</h1>
                <img src={DotsImg} className="h-5 max-h-5 cursor-pointer" />
              </header>
              <CustomBarChart data={data} height={200} />
            </div>
          </div>
          <div className="h-[300px] w-full bg-white rounded-md shadow-md">
            <header className="w-full h-[30px] flex justify-between mt-2 px-1">
              <h1 className="font-semibold text-[16px] ml-6">Card 5</h1>
              <img src={DotsImg} className="h-5 max-h-5 cursor-pointer" />
            </header>
            <CustomBarChart data={data} height={250} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
