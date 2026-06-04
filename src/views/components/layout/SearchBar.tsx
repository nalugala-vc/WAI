export function SearchBar() {
  return (
    <div className="px-4 py-2">
      <input
        type="search"
        placeholder="Search location"
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        readOnly
      />
    </div>
  )
}
