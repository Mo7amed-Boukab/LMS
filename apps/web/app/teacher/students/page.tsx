"use client";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { enrollmentApi } from "@/lib/services/enrollmentService";
import {
    Check,
    ChevronDown,
    Loader2,
    Search,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

// Helper function to format date consistently since we removed date-fns
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export interface DashboardStudent {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  joinedAt: string;
  courses: {
    courseId: string;
    title: string;
    enrolledAt: string;
  }[];
}

// --- Components ---

function CustomDropdown({
  options,
  value,
  onChange,
  minWidth = "min-w-[140px]",
}: {
  options: string[];
  value: string;
  onChange: (val: string) => void;
  minWidth?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative ${minWidth}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 bg-white border border-gray-200 rounded text-sm text-gray-700 hover:border-gray-300 transition-colors"
      >
        <span className="truncate">{value}</span>
        <ChevronDown
          size={14}
          className={`text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded shadow-lg z-50 py-1 max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center justify-between ${
                value === option
                  ? "text-red-600 font-medium bg-red-50"
                  : "text-gray-600"
              }`}
            >
              {option}
              {value === option && <Check size={14} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function StudentsPage() {
  const [students, setStudents] = useState<DashboardStudent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("All Courses");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setIsLoading(true);
        const data = await enrollmentApi.getInstructorStudents();
        setStudents(data);
      } catch (error) {
        console.error("Failed to fetch students:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const courseOptions = ["All Courses", ...Array.from(new Set(students.flatMap(s => s.courses.map(c => c.title))))];

  const filteredStudents = students.filter((student) => {
    const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
    const email = student.email.toLowerCase();
    const query = searchQuery.toLowerCase();

    const matchesSearch = fullName.includes(query) || email.includes(query);
    const matchesCourse = selectedCourse === "All Courses" || student.courses.some(c => c.title === selectedCourse);

    return matchesSearch && matchesCourse;
  });

  return (
    <>
      <DashboardHeader
        title="Students"
        description="View and manage the students enrolled in your courses."
      />

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Actions Bar: Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Search Box */}
            <div className="relative w-full sm:w-64">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded text-sm focus:ring-1 focus:ring-red-500/20 focus:border-red-300 outline-none transition-all placeholder:text-gray-400"
              />
            </div>

            {/* Course Filter Dropdown */}
            <CustomDropdown
              options={courseOptions}
              value={selectedCourse}
              onChange={setSelectedCourse}
              minWidth="w-full sm:w-56"
            />
          </div>
        </div>

        {/* Table View */}
        <div className="bg-white rounded border border-gray-100 min-h-[400px]">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={32} className="animate-spin text-red-600" />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50/50">
                    <tr>
                      <th className="text-left py-3 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Student Name
                      </th>
                      <th className="text-left py-3 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Email Address
                      </th>
                      <th className="text-left py-3 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Joined At
                      </th>
                      <th className="text-left py-3 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Enrolled Courses
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredStudents.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-12 text-center text-gray-500 text-sm">
                          No students found matching your criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredStudents.map((student) => (
                        <tr key={student._id} className="hover:bg-gray-50/50 transition-colors group">
                          <td className="py-4 px-5">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-red-50 text-red-600 flex items-center justify-center font-bold text-xs border border-red-100 uppercase">
                                {student.firstName[0]}
                                {student.lastName[0]}
                              </div>
                              <span className="text-sm font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
                                {student.firstName} {student.lastName}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-5 text-sm text-gray-600">
                            {student.email}
                          </td>
                          <td className="py-4 px-5 text-sm text-gray-600">
                            {formatDate(student.joinedAt)}
                          </td>
                          <td className="py-4 px-5">
                            <div className="flex flex-wrap gap-1.5">
                              {student.courses.map((course, idx) => (
                                <span
                                  key={course.courseId + "-" + idx}
                                  className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[11px] font-medium"
                                  title={`Enrolled: ${formatDate(course.enrolledAt)}`}
                                >
                                  {course.title}
                                </span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Info */}
              <div className="p-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  Showing {filteredStudents.length} of {students.length} students
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
