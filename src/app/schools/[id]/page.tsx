import { notFound } from "next/navigation";
import Link from "next/link";
import schools from "@/data/schools";
import SchoolDetail from "@/components/SchoolDetail";

export function generateStaticParams() {
  return schools.map((school, index) => ({
    id: index.toString(),
  }));
}

export default function SchoolPage({ params }: { params: { id: string } }) {
  const schoolId = parseInt(params.id);
  
  if (isNaN(schoolId) || schoolId < 0 || schoolId >= schools.length) {
    notFound();
  }
  
  const school = schools[schoolId];
  
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-8">
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:text-blue-800 flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to all schools
          </Link>
        </div>
        
        <SchoolDetail school={school} schoolId={schoolId} />
      </div>
    </div>
  );
} 