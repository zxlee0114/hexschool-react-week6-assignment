import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import BeatLoader from "react-spinners/ClipLoader";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

function ProductDetailPage() {
  const [product, setProduct] = useState({});
  const [qtySelect, setQtySelect] = useState(1);
  const { id: product_id } = useParams(); // 重新命名
  const [isScreenLoading, setIsScreenLoading] = useState(false);
  const [isBtnLoading, setIsBtnLoading] = useState(false);

  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/v2/api/${API_PATH}/product/${product_id}`
        );
        setProduct(res.data.product);
      } catch (error) {
        alert("取得產品失敗");
      }
    };
    getProduct();
  }, [product_id]);

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
      <div className="container mt-5">
        <div className="row">
          <div className="col-6">
            <img
              className="img-fluid"
              src={product.imageUrl}
              alt={product.title}
            />
          </div>
          <div className="col-6">
            <div className="d-flex align-items-center gap-2">
              <h2>{product.title}</h2>
              <span className="badge text-bg-success">{product.category}</span>
            </div>
            <p className="mb-3">{product.description}</p>
            <p className="mb-3">{product.content}</p>
            <h5 className="mb-3">NT$ {product.price}</h5>
            <div className="input-group align-items-center w-75">
              <select
                value={qtySelect}
                onChange={(e) => setQtySelect(e.target.value)}
                id="qtySelect"
                className="form-select"
              >
                {Array.from({ length: 10 }).map((_, index) => (
                  <option key={index} value={index + 1}>
                    {index + 1}
                  </option>
                ))}
              </select>
              <button
                onClick={() => {
                  addCartItem(product.id, qtySelect);
                }}
                type="button"
                className="btn btn-primary"
                style={{
                  cursor: isBtnLoading ? "not-allowed" : "pointer",
                  opacity: isBtnLoading ? 0.7 : 1,
                  transition: "all 0.3s",
                }}
              >
                加入購物車
                {isBtnLoading && (
                  <BeatLoader size={8} color="#ffffff" margin={2} />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

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
    </>
  );
}

export default ProductDetailPage;
