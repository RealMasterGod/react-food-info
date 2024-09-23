import { Add } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { addToCart } from "../features/cart/cartSlice";
import CheckIcon from "@mui/icons-material/Check";

const ListItem = ({ product }) => {
  const dispatch = useDispatch();
  const inCart = useSelector((state) =>
    state.cart.cart?.find(
      (item) =>
        item.code === product.code && item.product_name === product.product_name
    )
  );
  return (
    <div className="border h-auto sm:h-[175px] w-full flex-col sm:flex-row flex p-2 gap-3">
      <div className="sm:h-full h-[100px] self-center w-[150px] flex items-center justify-center">
        <img
          src={product?.image_front_small_url || "/extralogo.png"}
          className="h-full object-contain"
          alt=""
        />
      </div>
      <div className="flex-1 relative flex flex-col gap-1 sm:gap-3 justify-between">
        <Link state={{ product }} to={`/${product.code}`} className="link">
          <h3 className="text-[16px] sm:text-2xl font-bold">
            {product?.product_name || "NA"}
          </h3>
        </Link>
        <span className="py-1 sm:py-2 px-2 text-xs sm:text-[16px] rounded-md font-semibold w-fit bg-myYellow">
          {product?.categories_tags_en?.[0] || "NA"}
        </span>
        <div className="sm:flex gap-2 items-center">
          <span className=" text-sm xs:text-md sm:text-[16px] font-semibold">
            Ingredients:{" "}
          </span>
          <span className="italic text-xs xs:text-sm">
            {product?.ingredients?.slice(0, 5).map((item) => {
              var ans = `${item?.id?.substr(3)}, `;
              return ans;
            })}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm xs:text-md sm:text-[16px] font-semibold">
            Nutrition Grade:{" "}
          </span>
          <span className="text-green-500 font-Gloria">
            {product?.nutrition_grades || "NA"}
          </span>
        </div>
        {!inCart ? (
          <button
            onClick={() => dispatch(addToCart({ product }))}
            className="absolute bottom-0 right-0 p-2 xs:top-auto xs:-right-2 rounded-full xs:rounded-none xs:absolute xs:-bottom-2 bg-green-300 flex items-center text-sm font-semibold text-myGreen"
          >
            <Add />
            <span className="hidden sm:block">Add to Basket</span>
          </button>
        ) : (
          <div className="absolute bottom-0 right-0 p-2 xs:top-auto xs:-right-2 rounded-full xs:rounded-none xs:absolute xs:-bottom-2 bg-slate-400 flex items-center text-sm font-semibold text-black">
            <CheckIcon />
            <span className="hidden sm:block">Added To Basket</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListItem;
