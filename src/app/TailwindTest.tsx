'use client';

export default function TailwindTest() {
  return (
    <div className="p-4 m-4 bg-blue-500 text-white text-center rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold">Tailwind Test Component</h2>
      <p className="mt-2">If you can see this styled box, Tailwind CSS is working!</p>
      <button className="mt-4 px-4 py-2 bg-white text-blue-500 rounded hover:bg-blue-100 transition-colors">
        Test Button
      </button>
    </div>
  );
} 