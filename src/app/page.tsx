import SchoolsList from "@/components/SchoolsList";
import Link from "next/link";

export default function Home() {
  return (
    <div className="py-4 animate-fade-in">
      {/* Hero Section */}
      <section className="mb-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-sm">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Find Special Educational Needs Schools in Liverpool
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            A comprehensive directory of SEN schools to help you make informed decisions for your child's education
          </p>
          <div className="bg-white p-4 rounded-lg shadow-sm inline-block">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                {new Date().toLocaleDateString('en-GB', {year: 'numeric', month: 'long'})} Update
              </span>
              <span>•</span>
              <span>{30} schools listed</span>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-slide-up" style={{animationDelay: '0.1s'}}>
            <div className="bg-blue-100 text-blue-700 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Find Schools</h3>
            <p className="text-gray-600">
              Search our comprehensive directory to find SEN schools in Liverpool that meet your requirements.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-slide-up" style={{animationDelay: '0.2s'}}>
            <div className="bg-indigo-100 text-indigo-700 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Save Favorites</h3>
            <p className="text-gray-600">
              Create an account to save your favorite schools and make notes for future reference.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-slide-up" style={{animationDelay: '0.3s'}}>
            <div className="bg-green-100 text-green-700 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Contact Schools</h3>
            <p className="text-gray-600">
              Get direct contact information for each school to help you reach out and ask questions.
            </p>
          </div>
        </div>
      </section>
      
      {/* Schools List Section */}
      <section>
        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Browse All Schools</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Use the search box to find specific schools or browse through our comprehensive listing.
            </p>
          </div>
          
          <SchoolsList />
        </div>
      </section>
    </div>
  );
}
