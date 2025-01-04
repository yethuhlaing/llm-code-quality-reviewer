import Dashboard from "./components/Dashboard";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 mt-12"> 
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-4xl font-bold mb-8">GitHub Code Quality Review</h1>
        <Dashboard />
      </main>
    </div>
  );
}
