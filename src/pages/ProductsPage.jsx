import { useEffect, useState } from "react";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import BeatLoader from "react-spinners/ClipLoader";
import { Link } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [isScreenLoading, setIsScreenLoading] = useState(false);
  const [isBtnLoading, setIsBtnLoading] = useState(false);
  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/products`);
        setProducts(res.data.products);
      } catch (error) {
        alert("取得產品失敗");
      }
    };
    getProducts();
  }, []);
  const addCartItem = async (product_id, qty) => {
    try {
      setIsBtnLoading(true);
      setIsScreenLoading(true);
      await axios.post(`${BASE_URL}/v2/api/${API_PATH}/cart`, {
        data: {
          product_id,
          qty: Number(qty),
        },
      });
    } catch (error) {
      alert("加入購物車失敗");
    } finally {
      setIsBtnLoading(false);
      setIsScreenLoading(false);
    }
  };
  return (
    <>
      <div className="container">
        <table className="table align-middle">
          <thead>
            <tr>
              <th>圖片</th>
              <th>商品名稱</th>
              <th>價格</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td style={{ width: "200px" }}>
                  <img
                    className="img-fluid"
                    src={product.imageUrl}
                    alt={product.title}
                  />
                </td>
                <td>{product.title}</td>
                <td>
                  <del className="h6">原價 {product.origin_price} 元</del>
                  <div className="h5">特價 {product.price}元</div>
                </td>
                <td>
                  <div className="btn-group btn-group-sm">
                    <Link
                      to={`/products/${product.id}`}
                      className="btn btn-outline-secondary"
                    >
                      查看更多
                    </Link>
                    <button
                      onClick={() => {
                        addCartItem(product.id, 1);
                      }}
                      type="button"
                      className="btn btn-outline-danger"
                      style={{
                        cursor: isBtnLoading ? "not-allowed" : "pointer",
                        opacity: isBtnLoading ? 0.7 : 1,
                        transition: "all 0.3s",
                      }}
                    >
                      加到購物車{" "}
                      {isBtnLoading && (
                        <BeatLoader size={8} color="#ffffff" margin={2} />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* loading */}
        {isScreenLoading && (
          <div
            className="loading-container"
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(255,255,255,0.3)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 9999,
            }}
          >
            <ClipLoader color="#36D7B7" loading={true} size={50} />
          </div>
        )}
      </div>
    </>
  );
}

export default ProductsPage;
