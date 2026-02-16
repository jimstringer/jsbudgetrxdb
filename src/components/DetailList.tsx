import { NumberFormater } from '../utils/NumberFormater';

interface DetailListProps {
  category: string,
  amount: number,
  type: "EXPENSE" | "INCOME"
}

export const DetailList = ({
  trans,
  type
}: {
    trans: DetailListProps[];
    type: "EXPENSE" | "INCOME";
}) => {
  // Display a list of details in a grid format
  // This component is used to display a list of details in a grid format
  // It uses the Tailwind CSS framework for styling
  // The component is a functional component that returns a JSX element

  return (
    <div
      className={`flow-root ${type === "EXPENSE" ? 'bg-pink-200' : 'bg-green-200'}`}
    >
      <dl className='-my-2 divide-y divide-gray-300 text-sm '>
        {trans.map(
          (item, index) =>
            item.type === type && (
              <div
                key={index}
                className='grid grid-cols-2 gap-1 p-3 sm:grid-cols-3 sm:gap-4'
              >
                <dt className='font-medium text-gray-900 text-left'>
                  {item.category}
                </dt>
                <dd className='text-gray-700 sm:col-span-1 text-right'>
                  {NumberFormater.format(item.amount / 100)}
                </dd>
              </div>
            )
        )}
      </dl>
    </div>
  );
};
