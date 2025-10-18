import { CheckCircle, Info, AlertCircle, Edit3, RefreshCw, PlusCircle } from "lucide-react";

export default function FormGuidelines() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
      
      {/* Left Column - Guidelines */}
      <div className="bg-gradient-to-b from-white to-gray-100 dark:from-black/10 dark:to-gray-900 p-6 rounded-2xl shadow-xl space-y-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <Info className="w-5 h-5 text-blue-600" /> Guidelines
        </h2>
        <ul className="space-y-2 text-gray-600 dark:text-gray-300 text-sm">
          <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-600 mt-1" /> Choose the correct category from the dropdown for each field.</li>
          <li className="flex items-start gap-2"><AlertCircle className="w-4 h-4 text-red-500 mt-1" /> Do not make typos when filling numeric or text fields.</li>
          <li className="flex items-start gap-2"><PlusCircle className="w-4 h-4 text-pink-600 mt-1" /> Use the “+ Add” button for multiple entries.</li>
          <li className="flex items-start gap-2"><Edit3 className="w-4 h-4 text-yellow-500 mt-1" /> Fill all required fields to ensure accurate calculations.</li>
        </ul>
      </div>

      {/* Right Column - Best Practices */}
      <div className="bg-gradient-to-b from-white to-gray-100 dark:from-black/10 dark:to-gray-900 p-6 rounded-2xl shadow-xl space-y-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-600" /> Best Practices
        </h2>
        <ul className="space-y-2 text-gray-600 dark:text-gray-300 text-sm">
          <li className="flex items-start gap-2"><RefreshCw className="w-4 h-4 text-blue-600 mt-1" /> Double-check amounts before submitting the form.</li>
          <li className="flex items-start gap-2"><Edit3 className="w-4 h-4 text-yellow-500 mt-1" /> Make sure to hit SAVE button.</li>
          <li className="flex items-start gap-2"><Info className="w-4 h-4 text-purple-600 mt-1" /> Review your entries periodically to update or correct them.</li>
          <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-600 mt-1" /> Use consistent formatting for amounts and text.</li>
        </ul>
      </div>

    </div>
  );
}
