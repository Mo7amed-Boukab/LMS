export const getMediaUrl = (path: string | undefined | null) => {
  if (!path) return "/images/placeholder-course.jpg";
  
  if (path.startsWith("http")) {
    if (path.includes("localhost:3000/uploads")) {
      return path.replace("localhost:3000", "localhost:4000");
    }
    return path;
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || "http://localhost:4000";
  
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  
  return `${apiUrl}${cleanPath}`;
};
