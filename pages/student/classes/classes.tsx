import { fetchClasses, type Class } from "../../../lib/studentData";
import { useEffect, useState } from "react";
import Loading from "../../../components/common/loading";
interface Props {
  studentId: string;
  classesData?: Class[];
}

const StudentClasses: React.FC<Props> = ({ studentId }) => {
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState<Class[]>([]);

  useEffect(() => {
    loadStudentData();
  }, []);
  const loadStudentData = async () => {
    try {
      setLoading(true);
      // Simulate fetching from database
      const studentId = "STD-2024-001"; // In real app, get from auth

      const [classesData] = await Promise.all([fetchClasses(studentId)]);

      setClasses(classesData);
    } catch (error) {
      console.error("Error loading student data:", error);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <Loading message="Loading your dashboard..." />
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {classes.map((classItem) => (
        <div
          key={classItem.id}
          className="bg-white rounded-lg shadow overflow-hidden"
        >
          <div className={`h-2 bg-${classItem.color}-600`}></div>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {classItem.name}
                </h3>
                <p className="text-sm text-gray-600">{classItem.code}</p>
              </div>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                {classItem.credits} Credits
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-gray-600">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                {classItem.instructor}
              </div>
              <div className="flex items-center text-gray-600">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {classItem.schedule}
              </div>
              <div className="flex items-center text-gray-600">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {classItem.room}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
export default StudentClasses;

function setLoading(arg0: boolean) {
  throw new Error("Function not implemented.");
}
