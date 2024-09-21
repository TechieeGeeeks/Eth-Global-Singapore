const { Input } = require("@/components/ui/input");
const { Search } = require("lucide-react");

export const SearchBar = ({ searchQuery, setSearchQuery }) => (
  <div className="relative flex-1 max-w-sm">
    <Input
      placeholder="Search patients"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="pl-8 pr-4 py-2 text-sm"
    />
    <Search className="absolute left-2 top-2.5 text-gray-400" size={16} />
  </div>
);
