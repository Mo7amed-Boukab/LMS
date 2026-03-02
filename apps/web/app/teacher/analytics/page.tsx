"use client";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatCard from "@/components/dashboard/StatCard";
import { ArrowUpRight, BarChart3, BookOpen, Star, TrendingUp, Users } from "lucide-react";

// Mock Data
const MOCK_STATS = [
  { title: "Total Revenue", value: "$4,250.00", trend: "12%", trendUp: true, icon: TrendingUp },
  { title: "Total Enrollments", value: "842", trend: "8%", trendUp: true, icon: Users },
  { title: "Completion Rate", value: "68%", trend: "2%", trendUp: false, icon: BookOpen },
  { title: "Average Rating", value: "4.8", trend: "0.2", trendUp: true, icon: Star },
];

const MOCK_MONTHLY_DATA = [
  { month: "Jan", revenue: 1200, enrollments: 45 },
  { month: "Feb", revenue: 1800, enrollments: 68 },
  { month: "Mar", revenue: 1400, enrollments: 52 },
  { month: "Apr", revenue: 2200, enrollments: 89 },
  { month: "May", revenue: 2800, enrollments: 110 },
  { month: "Jun", revenue: 2400, enrollments: 95 },
  { month: "Jul", revenue: 3100, enrollments: 125 },
  { month: "Aug", revenue: 3600, enrollments: 140 },
  { month: "Sep", revenue: 3200, enrollments: 130 },
  { month: "Oct", revenue: 4100, enrollments: 165 },
  { month: "Nov", revenue: 4800, enrollments: 190 },
  { month: "Dec", revenue: 5200, enrollments: 210 },
];

const MOCK_TOP_COURSES = [
  { id: 1, name: "Advanced React & Next.js Pro", category: "Development", enrollments: 324, revenue: 18500, rating: 4.9 },
  { id: 2, name: "UI/UX Design Masterclass", category: "Design", enrollments: 256, revenue: 12800, rating: 4.8 },
  { id: 3, name: "Python for Data Science", category: "Data Science", enrollments: 198, revenue: 9900, rating: 4.7 },
  { id: 4, name: "Digital Marketing Fundamentals", category: "Marketing", enrollments: 154, revenue: 6160, rating: 4.6 },
];

export default function AnalyticsPage() {
  const maxRevenue = Math.max(...MOCK_MONTHLY_DATA.map((d) => d.revenue));

  return (
    <>
      <DashboardHeader
        title="Analytics & Reports"
        description="Monitor your course performance, revenue, and student engagement."
      />

      <div className="p-6 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500">
        {/* Top Stats Array */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {MOCK_STATS.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              trend={stat.trend}
              trendUp={stat.trendUp}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Revenue Chart Section (Takes 2/3 width on large screens) */}
          <div className="lg:col-span-2 bg-white rounded-sm border border-gray-100 p-6 flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <BarChart3 size={18} className="text-red-700" /> Revenue Overview
                </h3>
                <p className="text-sm text-gray-500 mt-1">Monthly revenue breakdown for the current year.</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-xs font-medium text-gray-600">
                  <span className="w-3 h-3 rounded-full bg-red-700 inline-block"></span> Revenue
                </span>
                <span className="flex items-center gap-1.5 text-xs font-medium text-gray-600">
                  <span className="w-3 h-3 rounded-full bg-red-100 border border-red-200 inline-block"></span> Enrollments
                </span>
              </div>
            </div>

            {/* Simulated Bar Chart */}
            <div className="flex-1 min-h-[300px] flex items-end gap-2 sm:gap-4 mt-auto pt-10 border-b border-gray-100 relative">
              {/* Y-Axis lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8 text-xs text-gray-400">
                <div className="flex w-full items-center border-b border-gray-50 h-0"><span className="absolute -translate-y-1/2 bg-white pr-2">${maxRevenue}</span></div>
                <div className="flex w-full items-center border-b border-gray-50 h-0"><span className="absolute -translate-y-1/2 bg-white pr-2">${Math.round(maxRevenue * 0.75)}</span></div>
                <div className="flex w-full items-center border-b border-gray-50 h-0"><span className="absolute -translate-y-1/2 bg-white pr-2">${Math.round(maxRevenue * 0.5)}</span></div>
                <div className="flex w-full items-center border-b border-gray-50 h-0"><span className="absolute -translate-y-1/2 bg-white pr-2">${Math.round(maxRevenue * 0.25)}</span></div>
                <div className="flex w-full items-center border-b border-gray-100 h-0"><span className="absolute -translate-y-1/2 bg-white pr-2">$0</span></div>
              </div>

              {/* Chart Bars */}
              <div className="w-full h-full flex items-end justify-between pl-12 pr-2 relative z-10 pb-1">
                {MOCK_MONTHLY_DATA.map((data, index) => {
                  const heightPercent = `${(data.revenue / maxRevenue) * 100}%`;
                  const enrollmentPercent = `${(data.enrollments / 250) * 100}%`; // Mock scaled
                  
                  return (
                    <div key={index} className="flex flex-col items-center group flex-1 px-0.5 sm:px-2">
                       <div className="w-full flex justify-center items-end gap-1 h-[250px]">
                          {/* Enrollment Bar (Ghost) */}
                          <div 
                             className="w-1/3 max-w-[12px] bg-red-100/80 rounded-t-sm transition-all duration-500 hover:bg-red-200" 
                             style={{ height: enrollmentPercent }}
                             title={`${data.enrollments} enrollments`}
                          ></div>
                          {/* Revenue Bar */}
                          <div 
                             className="w-2/3 max-w-[24px] bg-red-700/90 rounded-t-sm transition-all duration-500 hover:bg-red-800 relative cursor-pointer group" 
                             style={{ height: heightPercent }}
                          >
                             {/* Tooltip */}
                             <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity">
                                ${data.revenue}
                             </div>
                          </div>
                       </div>
                       <span className="text-[10px] sm:text-xs font-medium text-gray-500 mt-3">{data.month}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Insights / Summaries (Takes 1/3 width) */}
          <div className="bg-white rounded-sm border border-gray-100 p-6 flex flex-col">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Star size={18} className="text-yellow-500 fill-yellow-500" /> Student Insights
            </h3>
            
            <div className="space-y-6 flex-1">
               {/* Insight Card */}
               <div className="p-4 rounded border border-green-100 bg-green-50/50">
                  <h4 className="text-sm font-semibold text-green-800 mb-1 flex items-center gap-1.5"><TrendingUp size={14}/> Top Performer</h4>
                  <p className="text-xs text-green-700/80 leading-relaxed">
                     Your "Advanced React & Next.js Pro" course is generating 40% of your total revenue this month.
                  </p>
               </div>
               
               {/* Insight Card */}
               <div className="p-4 rounded border border-blue-100 bg-blue-50/50">
                  <h4 className="text-sm font-semibold text-blue-800 mb-1 flex items-center gap-1.5"><Users size={14}/> Student Retention</h4>
                  <p className="text-xs text-blue-700/80 leading-relaxed">
                     Students who complete your first module are 85% more likely to finish the entire course.
                  </p>
               </div>

               {/* Metric progress */}
               <div className="pt-4 border-t border-gray-100 mt-auto">
                  <div className="flex justify-between items-end mb-2">
                     <span className="text-sm font-semibold text-gray-700">Course Engagement Goal</span>
                     <span className="text-xs font-bold text-gray-900">75%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                     <div className="bg-red-700 h-2 rounded-full" style={{ width: '68%' }}></div>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-2 text-right">Target for Q4: 75% Completion</p>
               </div>
            </div>
          </div>
        </div>

        {/* Top Performing Courses Table */}
        <div className="bg-white rounded-sm border border-gray-100 overflow-hidden">
            <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 gap-4">
               <div>
                  <h3 className="text-base font-bold text-gray-900">Top Performing Courses</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Your most successful courses based on revenue and enrollments.</p>
               </div>
               <button className="text-sm font-medium text-red-700 hover:text-red-800 flex items-center gap-1 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded transition-colors">
                  Export Report <ArrowUpRight size={14} />
               </button>
            </div>

            <div className="overflow-x-auto">
               <table className="w-full">
                  <thead className="bg-gray-50/50">
                     <tr>
                        <th className="text-left py-3 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Course Name</th>
                        <th className="text-left py-3 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Category</th>
                        <th className="text-right py-3 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Enrollments</th>
                        <th className="text-right py-3 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Revenue</th>
                        <th className="text-right py-3 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Rating</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                     {MOCK_TOP_COURSES.map((course) => (
                        <tr key={course.id} className="hover:bg-gray-50/50 transition-colors">
                           <td className="py-4 px-5">
                              <h4 className="text-sm font-semibold text-gray-900">{course.name}</h4>
                           </td>
                           <td className="py-4 px-5">
                              <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2.5 py-1 rounded">{course.category}</span>
                           </td>
                           <td className="py-4 px-5 text-right">
                              <span className="text-sm font-medium text-gray-700">{course.enrollments}</span>
                           </td>
                           <td className="py-4 px-5 text-right">
                              <span className="text-sm font-bold text-gray-900">${course.revenue.toLocaleString()}</span>
                           </td>
                           <td className="py-4 px-5 text-right">
                              <div className="flex items-center justify-end gap-1 text-sm font-medium text-gray-700">
                                 {course.rating} <Star size={14} className="text-yellow-500 fill-yellow-500" />
                              </div>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
        </div>

      </div>
    </>
  );
}
