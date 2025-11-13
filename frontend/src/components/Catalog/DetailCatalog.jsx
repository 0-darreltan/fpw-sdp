import { useParams } from "react-router";

const DetailCatalog = () => {
  const { id } = useParams();

  return (
    <div className="detail-catalog">
      <h1>Product Detail</h1>
      <p>Product ID: {id}</p>
      {/* Add your product detail content here */}
    </div>
  );
};

export default DetailCatalog;
