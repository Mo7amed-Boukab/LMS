"use client";

import { CourseEditorProvider } from "@/context/Course-editor-context";
import { use } from "react";
import CourseEditor from "./CourseEditor";

export default function EditCoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = use(params);

  return (
    <CourseEditorProvider courseId={courseId}>
      <CourseEditor />
    </CourseEditorProvider>
  );
}
