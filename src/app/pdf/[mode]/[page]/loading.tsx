import { Loader } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex justify-center py-10 text-sm text-gray-500">
      <Loader
        className="animate-spin w-5 h-5 text-gray-600 mr-2"
        strokeWidth={1}
      />
      <span>Loading</span>
    </div>
  );
}
