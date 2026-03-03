// This will be a bar that shows total expenses and total income

export const TotalsBar = () => {
  return (
    <div className="flex justify-center-safe bg-cyan-600">
      <div className="mr-4 block md:mt-0">Expenses: $2000</div>
      <div className="mr-4 block md:mt-0">Income: $3000</div>
    </div>
  );
};
