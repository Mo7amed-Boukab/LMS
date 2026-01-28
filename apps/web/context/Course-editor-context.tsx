
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Course, CourseModule, CourseLesson, teacherCourseService } from '@/lib/services/teacher-course.service';
import { toast } from 'sonner';

interface CourseEditorContextType {
    course: Course | null;
    modules: CourseModule[];
    isLoading: boolean;
    isSaving: boolean;
    refreshCourse: () => Promise<void>;
    refreshModules: () => Promise<void>;
    updateCourse: (data: Partial<Course>) => Promise<void>;
    // Module actions
    createModule: (data: { title: string }) => Promise<void>;
    updateModule: (moduleId: string, data: Partial<CourseModule>) => Promise<void>;
    deleteModule: (moduleId: string) => Promise<void>;
    reorderModules: (moduleIds: string[]) => Promise<void>;
    // Lesson actions
    createLesson: (moduleId: string, data: { title: string; type: 'VIDEO' | 'PDF'; contentUrl: string }) => Promise<void>;
    updateLesson: (lessonId: string, data: Partial<CourseLesson>) => Promise<void>;
    deleteLesson: (lessonId: string) => Promise<void>;
    reorderLessons: (moduleId: string, lessonIds: string[]) => Promise<void>;
}

const CourseEditorContext = createContext<CourseEditorContextType | undefined>(undefined);

export function CourseEditorProvider({
    children,
    courseId
}: {
    children: ReactNode;
    courseId: string;
}) {
    const [course, setCourse] = useState<Course | null>(null);
    const [modules, setModules] = useState<CourseModule[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Initial load
    useEffect(() => {
        if (courseId) {
            loadData();
        }
    }, [courseId]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            await Promise.all([refreshCourse(), refreshModules()]);
        } catch (error) {
            console.error('Failed to load course data:', error);
            toast.error('Failed to load course data');
        } finally {
            setIsLoading(false);
        }
    };

    const refreshCourse = async () => {
        try {
            const data = await teacherCourseService.getCourse(courseId);
            setCourse(data);
        } catch (error) {
            console.error('Error fetching course:', error);
        }
    };

    const refreshModules = async () => {
        try {
            const modulesData = await teacherCourseService.getModulesByCourse(courseId);

            const modulesWithLessons = await Promise.all(
                modulesData.map(async (module) => {
                    const lessons = await teacherCourseService.getLessonsByModule(module._id);
                    return { ...module, lessons };
                })
            );

            setModules(modulesWithLessons);
        } catch (error) {
            console.error('Error fetching modules:', error);
        }
    };

    const updateCourse = async (data: Partial<Course>) => {
        setIsSaving(true);
        try {
            await teacherCourseService.updateCourse(courseId, data);
            await refreshCourse();
            toast.success('Course updated');
        } catch (error) {
            console.error('Error updating course:', error);
            toast.error('Failed to update course');
        } finally {
            setIsSaving(false);
        }
    };

    // --- Module Actions ---

    const createModule = async (data: { title: string }) => {
        setIsSaving(true);
        try {
            await teacherCourseService.createModule({
                courseId,
                title: data.title,
                order: modules.length + 1,
            });
            await refreshModules();
            toast.success('Section created');
        } catch (error) {
            console.error('Error creating module:', error);
            toast.error('Failed to create section');
        } finally {
            setIsSaving(false);
        }
    };

    const updateModule = async (moduleId: string, data: Partial<CourseModule>) => {
        try {
            await teacherCourseService.updateModule(moduleId, data);
            await refreshModules();
        } catch (error) {
            console.error('Error updating module:', error);
            toast.error('Failed to update section');
        }
    };

    const deleteModule = async (moduleId: string) => {
        if (!confirm('Are you sure you want to delete this section and all its lessons?')) return;

        setIsSaving(true);
        try {
            await teacherCourseService.deleteModule(moduleId);
            await refreshModules();
            toast.success('Section deleted');
        } catch (error) {
            console.error('Error deleting module:', error);
            toast.error('Failed to delete section');
        } finally {
            setIsSaving(false);
        }
    };

    const reorderModules = async (moduleIds: string[]) => {
        // Optimistic update
        const reorderedModules = [...modules].sort((a, b) =>
            moduleIds.indexOf(a._id) - moduleIds.indexOf(b._id)
        );
        setModules(reorderedModules);

        try {
            await teacherCourseService.reorderModules(courseId, moduleIds);
        } catch (error) {
            console.error('Error reordering modules:', error);
            toast.error('Failed to save order');
            await refreshModules(); // Revert on error
        }
    };

    // --- Lesson Actions ---

    const createLesson = async (moduleId: string, data: { title: string; type: 'VIDEO' | 'PDF'; contentUrl: string }) => {
        setIsSaving(true);
        try {
            await teacherCourseService.createLesson({
                moduleId,
                ...data,
            });
            await refreshModules(); // Need to refresh to see new lesson in module
            toast.success('Lesson created');
        } catch (error) {
            console.error('Error creating lesson:', error);
            toast.error('Failed to create lesson');
        } finally {
            setIsSaving(false);
        }
    };

    const updateLesson = async (lessonId: string, data: Partial<CourseLesson>) => {
        try {
            await teacherCourseService.updateLesson(lessonId, data);
            await refreshModules();
        } catch (error) {
            console.error('Error updating lesson:', error);
            toast.error('Failed to update lesson');
        }
    };

    const deleteLesson = async (lessonId: string) => {
        if (!confirm('Are you sure you want to delete this lesson?')) return;

        setIsSaving(true);
        try {
            await teacherCourseService.deleteLesson(lessonId);
            await refreshModules();
            toast.success('Lesson deleted');
        } catch (error) {
            console.error('Error deleting lesson:', error);
            toast.error('Failed to delete lesson');
        } finally {
            setIsSaving(false);
        }
    };

    const reorderLessons = async (moduleId: string, lessonIds: string[]) => {
        // Optimistic update logic
        const updatedModules = modules.map(m => {
            if (m._id === moduleId && m.lessons) {
                const reorderedLessons = [...m.lessons].sort((a, b) =>
                    lessonIds.indexOf(a._id) - lessonIds.indexOf(b._id)
                );
                return { ...m, lessons: reorderedLessons };
            }
            return m;
        });
        setModules(updatedModules);

        try {
            await teacherCourseService.reorderLessons(moduleId, lessonIds);
        } catch (error) {
            console.error('Error reordering lessons:', error);
            toast.error('Failed to save lesson order');
            await refreshModules();
        }
    };


    return (
        <CourseEditorContext.Provider
            value={{
                course,
                modules,
                isLoading,
                isSaving,
                refreshCourse,
                refreshModules,
                updateCourse,
                createModule,
                updateModule,
                deleteModule,
                reorderModules,
                createLesson,
                updateLesson,
                deleteLesson,
                reorderLessons,
            }}
        >
            {children}
        </CourseEditorContext.Provider>
    );
}

export function useCourseEditor() {
    const context = useContext(CourseEditorContext);
    if (context === undefined) {
        throw new Error('useCourseEditor must be used within a CourseEditorProvider');
    }
    return context;
}
