import React, { useState } from "react";
import { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { addToCart } from "../features/cart/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { CircularProgress } from "@mui/material";

const Single = () => {
  const params = useParams();
  const location = useLocation();
  const [product, setProduct] = useState(location.state?.product || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const dispatch = useDispatch();
  const [inCart, setInCart] = useState(false);
  var { cart } = useSelector((state) => state.cart);

  useEffect(() => {
    const fetchSingleProduct = async () => {
      setLoading(true);
      try {
        const url = `https://world.openfoodfacts.org/api/v0/product/${params.id}.json?fields=categories_tags_en,product_name,nutriments,nutrition_grades,image_front_small_url,ingredients,labels_tags,code,image_front_url`;
        const res = await axios.get(url);
        if (res.data.status === 0) {
          setError(true);
        } else {
          setProduct(res.data?.product);
          var searchCart = cart?.find(
            (item) =>
              item?.code === res.data?.product?.code &&
              item.product_name === res.data?.product?.product_name
          );
          searchCart && setInCart(true);
        }
        setLoading(false);
        
      } catch (err) {
        setLoading(false);
        setError(true);
      }
    };
    if (!product) fetchSingleProduct();
    else {
      var searchCart = cart?.find(
        (item) =>
          item?.code === product?.code &&
          item.product_name === product?.product_name
      );
      searchCart && setInCart(true);
    }
  }, []);
  return (
    <div className="w-full lg:w-[80%] h-[calc(100vh-56px)] sm:h-[calc(100vh-81px)] p-2 mx-auto">
      <div className="bg-myGreenLight h-full flex xl:flex-row flex-col gap-4">
        <div className="h-full bg-myGreen flex-1 p-4 rounded-xl">
          <div className="bg-white w-full h-full flex flex-col gap-5 justify-center rounded-md p-2">
            {product && (
              <div className="flex border flex-col md:flex-row overflow-y-scroll p-2">
                <div className="flex-1 flex items-center justify-center">
                  <img
                    src={product?.image_front_url || "/extralogo.png"}
                    alt=""
                    className="max-h-[250px] md:min-h-[400px] object-contain"
                  />
                </div>
                <div className="flex-1 flex gap-5 flex-col">
                  <h1 className=" text-2xl md:text-4xl">
                    {product?.product_name}
                  </h1>
                  <div className="flex flex-wrap gap-2">
                    {product?.categories_tags_en.map((cat) => (
                      <span
                        key={cat}
                        className="font-semibold text-sm md:text-md lg:text-lg w-fit flex bg-myYellow py-1 px-2 md:px-3 lg:px-2 rounded-full"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                  <div className=" gap-2 items-center">
                    <span className=" text-lg md:text-xl font-semibold">
                      Ingredients:{" "}
                    </span>
                    <span className="italic text-md md:text-lg font-light">
                      {product?.ingredients?.map((item) => {
                        var ans = `${item?.id?.substr(3)}, `;
                        return ans;
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg md:text-xl font-semibold">
                      Nutrition Grade:{" "}
                    </span>
                    <span className="text-green-500 text-md md:text-lg font-Gloria">
                      {product?.nutrition_grades || "NA"}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg md:text-xl font-semibold">
                      Nutrition Value
                    </h3>
                    <div className="flex flex-wrap gap-2 items-center">
                      <div className="flex gap-1 items-center">
                        <span className="text-sm text-slate-500">
                          Alcohol:{" "}
                        </span>
                        <span className="text-sm text-gray-800 text-blue-800">
                          {product?.nutriments?.alcohol || 0} ,
                        </span>
                      </div>
                      <div className="flex gap-1 items-center">
                        <span className="text-sm text-slate-500">
                          Carbohydrates:{" "}
                        </span>
                        <span className="text-sm text-gray-800">
                          {product?.nutriments?.carboydrates || 0} ,
                        </span>
                      </div>
                      <div className="flex gap-1 items-center">
                        <span className="text-sm text-slate-500">Energy: </span>
                        <span className="text-sm text-gray-800">
                          {product?.nutriments?.energy || 0} ,
                        </span>
                      </div>
                      <div className="flex gap-1 items-center">
                        <span className="text-sm text-slate-500">Fat: </span>
                        <span className="text-sm text-gray-800">
                          {product?.nutriments?.fat || 0} ,
                        </span>
                      </div>
                      <div className="flex gap-1 items-center">
                        <span className="text-sm text-slate-500">
                          Proteins:{" "}
                        </span>
                        <span className="text-sm text-gray-800">
                          {product?.nutriments?.proteins || 0} ,
                        </span>
                      </div>
                      <div className="flex gap-1 items-center">
                        <span className="text-sm text-slate-500">Salt: </span>
                        <span className="text-sm text-gray-800">
                          {product?.nutriments?.salt || 0} ,
                        </span>
                      </div>
                      <div className="flex gap-1 items-center">
                        <span className="text-sm text-slate-500">
                          Saturated Fats:{" "}
                        </span>
                        <span className="text-sm text-gray-800">
                          {product?.nutriments?.["saturated-fats"] || 0} ,
                        </span>
                      </div>
                      <div className="flex gap-1 items-center">
                        <span className="text-sm text-slate-500">Sodium: </span>
                        <span className="text-sm text-gray-800">
                          {product?.nutriments?.sodium || 0} ,
                        </span>
                      </div>
                      <div className="flex gap-1 items-center">
                        <span className="text-sm text-slate-500">Sugars: </span>
                        <span className="text-sm text-gray-800">
                          {product?.nutriments?.sugars || 0} ,
                        </span>
                      </div>
                    </div>
                  </div>
                  {!inCart ? (
                    <button
                      onClick={() => {
                        dispatch(addToCart({ product }));
                        setInCart(true);
                      }}
                      className="p-2 border text-slate-800 font-light border-yellow-500 self-center md:w-fit"
                    >
                      ADD TO BASKET
                    </button>
                  ) : (
                    <div className="p-2 border text-slate-800 font-light border-blue-600 self-center md:w-fit">
                      ADDED TO BASKET
                    </div>
                  )}
                </div>
              </div>
            )}
            {loading && (
              <div className="self-center text-xs">
                <CircularProgress size={20} color="success" />
              </div>
            )}
            {!product && !loading && (
              <span className="text-xl text-red-500">Product Not Found :/</span>
            )}
            {!loading && error && (
              <span className="self-center text-red-600 font-bold">
                An Error Occurred!
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Single;
