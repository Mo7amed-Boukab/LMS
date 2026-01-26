"use client";

import { useState, useRef, useEffect } from "react";
import {
  Plus,
  Search,
  ChevronDown,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Check,
} from "lucide-react";
import Link from "next/link";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

// --- Mock Data ---
const courses = [
  {
    id: 1,
    title: "Introduction to UX Design",
    category: "Design",
    students: 317,
    price: 49.99,
    status: "Published",
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=100&auto=format&fit=crop&q=60",
  },
  {
    id: 2,
    title: "Advanced Python",
    category: "Development",
    students: 148,
    price: 89.99,
    status: "Published",
    image:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=100&auto=format&fit=crop&q=60",
  },
  {
    id: 3,
    title: "Digital Marketing 101",
    category: "Marketing",
    students: 0,
    price: 29.99,
    status: "Draft",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=100&auto=format&fit=crop&q=60",
  },
  {
    id: 4,
    title: "Data Science Bootcamp",
    category: "Data",
    students: 84,
    price: 129.99,
    status: "Published",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&auto=format&fit=crop&q=60",
  },
  {
    id: 5,
    title: "Project Management",
    category: "Business",
    students: 207,
    price: 59.99,
    status: "Archived",
    image:
      "https://images.unsplash.com/photo-1507537297725-24a1c434c67b?w=100&auto=format&fit=crop&q=60",
  },
  {
    id: 6,
    title: "React & Next.js Masterclass",
    category: "Development",
    students: 423,
    price: 99.99,
    status: "Published",
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=100&auto=format&fit=crop&q=60",
  },
];

const categories = [
  "All Categories",
  "Design",
  "Development",
  "Marketing",
  "Data",
  "Business",
  "Finance",
];
const statuses = ["All Status", "Published", "Draft", "Archived"];

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

function ActionMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-400 hover:text-gray-600 p-1.5 rounded-md hover:bg-gray-100 transition-colors"
      >
        <MoreVertical size={16} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-gray-100 rounded-md shadow-lg z-50 py-1.5 px-1">
          <button className="w-full text-left px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md flex items-center gap-3 transition-colors">
            <Eye size={16} /> View
          </button>
          <button className="w-full text-left px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md flex items-center gap-3 transition-colors">
            <Edit size={16} /> Edit
          </button>
          <button className="w-full text-left px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 rounded-md flex items-center gap-3 transition-colors">
            <Trash2 size={16} /> Delete
          </button>
        </div>
      )}
    </div>
  );
}

// --- Main Page ---

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedStatus, setSelectedStatus] = useState("All Status");

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All Categories" ||
      course.category === selectedCategory;
    const matchesStatus =
      selectedStatus === "All Status" || course.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <>
      <DashboardHeader
        title="Courses"
        description="Manage your courses, lessons, and quizzes."
      />

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Actions Bar: Search & Filters Grouped + Create Button */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          {/* Search + Filters Group */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Search Box */}
            <div className="relative w-full sm:w-64">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded text-sm focus:ring-1 focus:ring-red-500/20 focus:border-red-300 outline-none transition-all placeholder:text-gray-400"
              />
            </div>

            {/* Custom Dropdowns */}
            <CustomDropdown
              options={statuses}
              value={selectedStatus}
              onChange={setSelectedStatus}
              minWidth="w-full sm:w-40"
            />

            <CustomDropdown
              options={categories}
              value={selectedCategory}
              onChange={setSelectedCategory}
              minWidth="w-full sm:w-48"
            />
          </div>

          {/* Create Button */}
          <Link href="/teacher/courses/create">
            {" "}
            <button className="flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-sm font-medium text-sm transition-colors shadow-sm w-full md:w-auto justify-center">
              <Plus size={16} />
              <span>Create Course</span>
            </button>
          </Link>
        </div>

        {/* Table View */}
        <div className="bg-white rounded-md border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="text-left py-3 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Course Name
                  </th>
                  <th className="text-left py-3 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="text-left py-3 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Enrolled
                  </th>
                  <th className="text-left py-3 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="text-left py-3 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-right py-3 px-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredCourses.map((course) => (
                  <tr
                    key={course.id}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div
                          className="h-10 w-10 rounded-md bg-gray-100 bg-cover bg-center shrink-0"
                          style={{ backgroundImage: `url(${course.image})` }}
                        ></div>
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
                            {course.title}
                          </h4>
                          <span className="text-xs text-gray-400">
                            ID: #C-{1024 + course.id}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <span className="text-sm text-gray-600">
                        {course.category}
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      {course.students > 0 ? (
                        <div className="flex items-center gap-1.5">
                          <div className="flex -space-x-2">
                            {[...Array(Math.min(3, course.students))].map(
                              (_, i) => (
                                <div
                                  key={i}
                                  className="h-6 w-6 rounded-full bg-gray-200 border-2 border-white"
                                ></div>
                              ),
                            )}
                          </div>
                          <span className="text-xs text-gray-500">
                            +{course.students}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">
                          No enrollments yet
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-5">
                      <span className="text-sm font-medium text-gray-900">
                        ${course.price}
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          course.status === "Published"
                            ? "text-green-700"
                            : course.status === "Draft"
                              ? "text-red-700"
                              : "text-gray-600"
                        }`}
                      >
                        {course.status}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <ActionMenu />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-500">
              Showing {filteredCourses.length} of {courses.length} courses
            </span>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 text-xs border border-gray-200 rounded-md text-gray-500 hover:bg-gray-50 transition-colors">
                Previous
              </button>
              <button className="px-3 py-1.5 text-xs border border-gray-200 rounded-md text-gray-500 hover:bg-gray-50 transition-colors">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
