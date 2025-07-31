import { Loader } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex justify-center p-25 min-h-screen text-sm text-gray-500 border rounded-md">
      <Loader
        className="animate-spin w-5 h-5 text-gray-600 mr-2"
        strokeWidth={1}
      />
      <span>Loading</span>
    </div>
  );
}
