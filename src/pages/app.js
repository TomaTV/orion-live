import Logo from "@/components/app/Logo";
import SearchBar from "@/components/app/SearchBar";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Logo />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <SearchBar />
      </div>
    </div>
  );
}
