import ItemCard from "./ItemCard";

function ItemList({ items, account, onClaim, onResolve }) {
  if (items.length === 0) {
    return (
      <div className="border border-dashed border-neutral-800 py-16 text-center font-mono text-sm text-neutral-600">
        no reports filed yet
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, index) => (
        <div
          key={item.id.toString()}
          className="animate-fade-in-up"
          style={{ animationDelay: `${index * 60}ms` }}
        >
          <ItemCard item={item} account={account} onClaim={onClaim} onResolve={onResolve} />
        </div>
      ))}
    </div>
  );
}

export default ItemList;