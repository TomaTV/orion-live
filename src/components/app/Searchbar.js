import { useState } from "react";
import { Search } from "lucide-react";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [url, setUrl] = useState("");

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      console.log("Recherche:", query);
    } else if (url.trim()) {
      console.log("URL soumise:", url);
    }
  };

  return (
    <div className="flex justify-center pt-16">
      <form
        onSubmit={handleSubmit}
        className="flex items-center w-full max-w-3xl px-6 py-3 rounded-full
          bg-white border border-white/20 dark:bg-black dark:border-gray-700"
      >
        <Search className="w-6 h-6 text-gray-600 dark:text-white/60" />
        <input
          type="text"
          value={query || url}
          onChange={(e) => (query ? handleChange(e) : handleUrlChange(e))}
          placeholder={query ? "Rechercher..." : "Entrez votre URL"}
          className="ml-3 bg-transparent text-gray-900 placeholder-gray-600 outline-none flex-grow dark:text-white dark:placeholder-white/60"
        />
        <button
          type="submit"
          className="bg-orion-nebula text-white py-2 px-6 rounded-full ml-4 transition-colors duration-300 hover:bg-orion-nebula/80"
        >
          Envoyer
        </button>
      </form>
    </div>
  );
}
