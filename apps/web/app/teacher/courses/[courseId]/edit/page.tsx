
'use client';

import { CourseEditorProvider } from "@/context/Course-editor-context";
import CourseEditor from './CourseEditor';

export default function EditCoursePage({ params }: { params: { courseId: string } }) {
    return (
        <CourseEditorProvider courseId={params.courseId}>
            <CourseEditor />
        </CourseEditorProvider>
    );
}
