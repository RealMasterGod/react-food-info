import { useDispatch, useSelector } from "react-redux";
import { removeFromCart } from "../features/cart/cartSlice";

const Cart = () => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  return (
    <div className="w-full lg:w-[80%] h-[calc(100vh-56px)] sm:h-[calc(100vh-81px)] p-2 mx-auto">
      <div className="bg-myGreenLight h-full flex xl:flex-row flex-col gap-4">
        <div className="h-full bg-myGreen flex-1 p-4 rounded-xl">
          <div className="bg-white w-full h-full flex flex-col gap-5 rounded-md p-2">
            <h1 className="text-center text-myGreen text-5xl">Your Basket</h1>
            <div className="flex flex-wrap overflow-y-scroll gap-3 pr-2">
              {cart.length > 0 &&
                cart?.map((product) => (
                  <div
                    key={product?.code}
                    className="flex w-full sm:max-w-[200px] flex-col gap-2 border p-2 justify-between"
                  >
                    <img
                      className="w-full h-[150px] sm:max-w-[200px] object-contain"
                      src={product?.image_front_small_url || "/extralogo.png"}
                      alt=""
                    />
                    <Link state={{ product }} className="link" to={`/${product?.code}`}><h1 className="text-xl font-bold">
                      {product?.product_name || "NA"}
                    </h1></Link>
                    <div className="">
                      <span className="text-slate-800 text-lg font-semibold">
                        Category:
                      </span>
                      <div className="text-sm font-light">
                        {product?.categories_tags_en?.[0] || "NA"}
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        dispatch(
                          removeFromCart({
                            code: product?.code,
                            name: product?.name,
                          })
                        )
                      }
                      className="w-full bg-red-500 text-white p-2"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              {cart.length <= 0 && (
                <h3 className="text-lg w-full text-myGreen text-center">
                  NO ITEMS IN CART
                </h3>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
