import { Loader } from "lucide-react";

export default function Loading() {
  return (
    <div className="p-1 text-sm text-gray-500 border rounded-md">
      <div className="flex justify-center border min-h-screen py-12 rounded-md">
        <Loader
          className="animate-spin w-5 h-5 text-gray-600 mr-2"
          strokeWidth={1}
        />
        <span>Loading</span>
      </div>
    </div>
  );
}
