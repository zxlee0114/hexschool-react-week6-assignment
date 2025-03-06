import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Modal } from "bootstrap";
import { useForm } from "react-hook-form";
import ClipLoader from "react-spinners/ClipLoader";
import BeatLoader from "react-spinners/ClipLoader";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

function App() {
  const [products, setProducts] = useState([]);
  const [tempProduct, setTempProduct] = useState([]);
  const [cart, setCart] = useState({});
  const [isScreenLoading, setIsScreenLoading] = useState(false);
  const [isBtnLoading, setIsBtnLoading] = useState(false);

  const getCart = async () => {
    try {
      setIsScreenLoading(true);
      const response = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/cart`);
      setCart(response.data.data);
    } catch (error) {
      alert("取得購物車列表失敗");
    } finally {
      setIsScreenLoading(false);
    }
  };
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
    getCart();
  }, []);

  const productModalRef = useRef(null);
  useEffect(() => {
    new Modal(productModalRef.current, { backdrop: false });
  }, []);

  const openModal = () => {
    const modalInstance = Modal.getInstance(productModalRef.current);
    modalInstance.show();
  };

  const closeModal = () => {
    const modalInstance = Modal.getInstance(productModalRef.current);
    modalInstance.hide();
  };

  const handleSeeMore = (product) => {
    setTempProduct(product);
    openModal();
  };

  const [qtySelect, setQtySelect] = useState(1);

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
      getCart();
    } catch (error) {
      alert("加入購物車失敗");
    } finally {
      setIsBtnLoading(false);
      setIsScreenLoading(false);
    }
  };

  const removeCart = async () => {
    try {
      setIsScreenLoading(true);
      await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/carts`);
      getCart();
    } catch (error) {
      alert("刪除購物車失敗");
    } finally {
      setIsScreenLoading(false);
    }
  };

  const removeCartItem = async (id) => {
    try {
      setIsScreenLoading(true);
      await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/cart/${id}`);
      getCart();
    } catch (error) {
      alert("刪除此商品失敗");
    } finally {
      setIsScreenLoading(false);
    }
  };

  const updateCartItemNum = async (cartItem_id, product_id, qty) => {
    try {
      setIsScreenLoading(true);
      await axios.put(`${BASE_URL}/v2/api/${API_PATH}/cart/${cartItem_id}`, {
        data: {
          product_id,
          qty: Number(qty),
        },
      });
      getCart();
    } catch (error) {
      alert("更新商品數量失敗");
    } finally {
      setIsScreenLoading(false);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = handleSubmit((data) => {
    const { message, ...user } = data; // 其餘運算子
    const userInfo = {
      data: {
        user,
        message,
      },
    };
    handleCheckout(userInfo);
  });

  const handleCheckout = async (order) => {
    try {
      setIsScreenLoading(true);
      await axios.post(`${BASE_URL}/v2/api/${API_PATH}/order`, order);
    } catch (error) {
      alert("結帳失敗");
    } finally {
      setIsScreenLoading(false);
    }
    reset();
    getCart();
  };

  return (
    <div className="container">
      <div className="mt-4">
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
                    <button
                      onClick={() => handleSeeMore(product)}
                      type="button"
                      className="btn btn-outline-secondary"
                    >
                      查看更多
                    </button>
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

        <div
          ref={productModalRef}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          className="modal fade"
          id="productModal"
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title fs-5">
                  產品名稱：{tempProduct.title}
                </h2>
                <button
                  onClick={closeModal}
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <img
                  src={tempProduct.imageUrl}
                  alt={tempProduct.title}
                  className="img-fluid"
                />
                <p>內容：{tempProduct.content}</p>
                <p>描述：{tempProduct.description}</p>
                <p>
                  價錢：{tempProduct.price}{" "}
                  <del>{tempProduct.origin_price}</del> 元
                </p>
                <div className="input-group align-items-center">
                  <label htmlFor="qtySelect">數量：</label>
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
                </div>
              </div>
              <div className="modal-footer">
                <button
                  onClick={() => {
                    addCartItem(tempProduct.id, qtySelect);
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

        {cart.carts?.length > 0 && (
          <>
            <div className="text-end py-3">
              <button
                onClick={removeCart}
                className="btn btn-outline-danger"
                type="button"
              >
                清空購物車
              </button>
            </div>

            <table className="table align-middle">
              <thead>
                <tr>
                  <th></th>
                  <th>品名</th>
                  <th style={{ width: "150px" }}>數量/單位</th>
                  <th className="text-end">單價</th>
                </tr>
              </thead>

              <tbody>
                {cart.carts?.map((cartItem) => {
                  return (
                    <tr key={cartItem.id}>
                      <td>
                        <button
                          onClick={() => {
                            removeCartItem(cartItem.id);
                          }}
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                        >
                          x
                        </button>
                      </td>
                      <td>{cartItem.product.title}</td>
                      <td style={{ width: "150px" }}>
                        <div className="d-flex align-items-center">
                          <div className="btn-group me-2" role="group">
                            <button
                              onClick={() => {
                                updateCartItemNum(
                                  cartItem.id,
                                  cartItem.product_id,
                                  cartItem.qty - 1
                                );
                              }}
                              disabled={cartItem.qty === 1 || isScreenLoading}
                              type="button"
                              className="btn btn-outline-dark btn-sm"
                            >
                              -
                            </button>
                            <span
                              className="btn border border-dark"
                              style={{ width: "50px", cursor: "auto" }}
                            >
                              {cartItem.qty}
                            </span>
                            <button
                              onClick={() => {
                                updateCartItemNum(
                                  cartItem.id,
                                  cartItem.product_id,
                                  cartItem.qty + 1
                                );
                              }}
                              disabled={isScreenLoading}
                              type="button"
                              className="btn btn-outline-dark btn-sm"
                            >
                              +
                            </button>
                          </div>
                          <span className="input-group-text bg-transparent border-0">
                            {cartItem.product.unit}
                          </span>
                        </div>
                      </td>
                      <td className="text-end">{cartItem.total}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="3" className="text-end">
                    總計：
                  </td>
                  <td className="text-end" style={{ width: "130px" }}>
                    {cart.total}
                  </td>
                </tr>
              </tfoot>
            </table>
          </>
        )}
      </div>

      <div className="my-5 row justify-content-center">
        <form onSubmit={onSubmit} className="col-md-6">
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              {...register("email", {
                required: "此為必填欄位，請輸入有效的 Email 帳號",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "此 email 格式有誤，請確認後再輸入",
                },
              })}
              id="email"
              type="email"
              className={`form-control ${errors.email && "is-invalid"}`}
              placeholder="請輸入 Email"
            />
            {errors.email && (
              <p className="text-danger my-2">{errors.email.message}</p>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              收件人姓名
            </label>
            <input
              {...register("name", {
                required: "此為必填欄位，請輸入您的名字",
              })}
              id="name"
              className={`form-control ${errors.name && "is-invalid"}`}
              placeholder="請輸入姓名"
            />

            {errors.name && (
              <p className="text-danger my-2">{errors.name.message}</p>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="tel" className="form-label">
              收件人電話
            </label>
            <input
              {...register("tel", {
                required: "此為必填欄位，請輸入有效的電話號碼",
                pattern: {
                  value: /^(0[2-8]\d{7}|09\d{8})$/,
                  message: "此電話號碼格式有誤，請確認後再輸入",
                },
              })}
              id="tel"
              type="text"
              className={`form-control ${errors.tel && "is-invalid"}`}
              placeholder="請輸入電話"
            />

            {errors.tel && (
              <p className="text-danger my-2">{errors.tel.message}</p>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="address" className="form-label">
              收件人地址
            </label>
            <input
              {...register("address", {
                required: "此為必填欄位，請輸入有效的寄送地址",
              })}
              id="address"
              type="text"
              className={`form-control ${errors.address && "is-invalid"}`}
              placeholder="請輸入地址"
            />

            {errors.address && (
              <p className="text-danger my-2">{errors.address.message}</p>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="message" className="form-label">
              留言
            </label>
            <textarea
              {...register("message")}
              id="message"
              className="form-control"
              cols="30"
              rows="10"
            ></textarea>
          </div>
          <div className="text-end">
            <button type="submit" className="btn btn-danger">
              送出訂單
            </button>
          </div>
        </form>
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
    </div>
  );
}

export default App;
