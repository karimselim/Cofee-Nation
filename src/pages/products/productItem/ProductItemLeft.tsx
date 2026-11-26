import OrderOptions from "../../../components/OrderOptions";

const ProductItemLeft = ({ details }: { details: { title: string; image: string } }) => (
  <aside className="flex flex-col gap-10 w-full items-center">
    <img
      src={details.image}
      alt={details.title}
      className="rounded-full aspect-square object-cover w-64"
    />
    <div className="shadow-primary p-4 px-8 rounded-xl w-full">
      <OrderOptions />
    </div>
  </aside>
);

export default ProductItemLeft;
