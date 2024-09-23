import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addFilteredProducts,
  addMoreProducts,
  increasePageCount,
  setPrevPage,
} from "../features/products/productSlice";
import ListItem from "./ListItem";
import { CircularProgress } from "@mui/material";

const fields =
  "categories_tags_en,product_name,nutrition_grades,image_front_small_url,nutriments,ingredients,labels_tags,code,image_front_url";

const List = ({ searchQ, sort, cat, barcode }) => {
  // DUE TO MY IMPLEMENTATION i NEED A PREV COUNT SO I DONT FETCH SAME PAGE DATA AGAIN AND ADD IT TO THE LIST OF PRODUCTS

  // NEED THIS TO FETCH EITHER NORMAL PRODUCTS OR FILTERED PRODUCTS

  const product = useSelector((state) => state.product);
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [data, setData] = useState([]);

  // IF USER USES BARCODE AS QUERY THEN NEED ONLY SINGLE PRODUCT HENCE CREATED THIS SEPARATELY

  const [barData, setBarData] = useState(null);

  useEffect(() => {
    // FETCHING BARCODE PRODUCT IF IT EXISTS
    const fetchBarData = async () => {
      setError(false);
      setLoading(true);
      try {
        const res = await axios.get(
          `https://world.openfoodfacts.org/api/v0/product/${barcode}.json?fields=${fields}`
        );
        if (res.data.status === 0) {
          setError(true);
        } else setBarData(res.data.product);
        setLoading(false);
      } catch (err) {
        setError(true);
        setLoading(false);
      }
    };
    if (barcode) {
      fetchBarData();
    } else {
      // IF BARCODE QUERY WAS SET TO BLANK THEN JUST RESET ERROR AND BARDATA

      setBarData(null);
      setError(false);
    }
  }, [barcode]);

  useEffect(() => {
    //FETCHING ALL DATA HERE IF YOU DONT APPLY ANY CATEGORY FILTER THEN IT FETCHES NORMAL DATA
    // OTHERWISE IT ADD CATEGORIES AS QUERY AND NOW FETCH QUERY DATA AND STORE IT IN FILTERED PRODUCTS
    // A THING TO NOTE EACH TIME A NEW CATEGORY FILTER IS APPLIED OLD FILTERED DATA WILL BE REMOVED
    // FROM REDUX STORE AND FPAGE WILL BE SET TO 1 AGAIN

    const fetchData = async () => {
      setLoading(true);
      setError(false);
      try {
        var url =
          "https://world.openfoodfacts.org/api/v1/search?page_size=10&page=";

        // FPAGE IS USED FOR CATEGORY DATA/FILTERED DATA
        // IF FPAGE VALUE IS ZERO THEN SIMPLE FETCH NORMAL DATA

        if (product.fpage.value !== 0) {
          url += product.fpage.value;
        } else url += product.page;
        url += `&fields=${fields}`;
        if (cat) {
          url += `&categories_tags_en=${cat}`;
        }
        const res = await axios.get(url);
        const { products } = res.data;

        var arr = [];

        //STORING DATA IN TEMP ARRAY WHETHER ITS FILTERED DATA OR NORMAL

        if (product.fpage.value !== 0) {
          if (product.fpage.value === 1) arr = [...products];
          else arr = [...product.filteredProducts, ...products];
          dispatch(addFilteredProducts({ products, fpage: product.fpage.value }));
        } else {
          arr = [...product.products, ...products];
          dispatch(addMoreProducts({ products }));
        }

        //IF THERE IS SORT/SEARCH QUERY THEN DO THESE OPERATION ON ANY DATA WHETHER FILTERED OR NORMAL

        if (sort) arr.sort((a, b) => compare(a, b, sort));
        if (searchQ) {
          arr = arr.filter((item) => {
            if (
              item?.product_name
                .toLowerCase()
                .match(searchQ.toLocaleLowerCase()) ||
              item?.code?.toLowerCase()?.match(searchQ.toLocaleLowerCase())
            ) {
              return item;
            }
          });
        }

        //STORE DATA IN ARRAY

        setData(arr);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
        setError(true);
      }
    };
    if (product.prevPage !== product.page || product.fpage.value !== 0) {
      //ONLY FETCH DATA IF LOAD MORE WAS CLICKED OR CATEGORY WAS APPLIED

      fetchData();
      dispatch(setPrevPage())
    } else {
      //IF THIS ELSE RUNS THEN IT MEANS THERE IS NO CATEGORY APPLIED SO JUST GET THE NORMAL DATA
      //FROM REDUX STORE AND APPLY SORT/SEARCH QUERY IF ANY

      var arr = [...product.products];
      if (sort) {
        arr.sort((a, b) => compare(a, b, sort));
      }
      if (searchQ) {
        arr = arr.filter((item) => {
          if (
            item?.product_name
              .toLowerCase()
              .match(searchQ.toLocaleLowerCase()) ||
            item?.code?.toLowerCase()?.match(searchQ.toLocaleLowerCase())
          ) {
            return item;
          }
        });
      }
      setData(arr);
    }
  }, [product.page, product.fpage, product.prevPage]);

  useEffect(() => {
    //WHEN NO NEW DATA IS FETCHED BUT SORT OR QUERY FILTER WAS APPLIED THEN RUN THIS
    //IF CATEGORY IS THERE ON CURRENT DATA THEN GET FILTERED DATA OTHERWISE GET NORMAL DATA

    var arr = [...(cat ? product.filteredProducts : product.products)];

    //APPLY SEARCH IF ANY

    if (searchQ) {
      arr = arr.filter((item) => {
        if (
          item?.product_name.toLowerCase().match(searchQ.toLocaleLowerCase()) ||
          item?.code?.toLowerCase()?.match(searchQ.toLocaleLowerCase())
        ) {
          return item;
        }
      });
    }

    //APPLY SORT IF ANY

    if (sort) {
      arr.sort((a, b) => compare(a, b, sort));
    }
    setData(arr);
  }, [searchQ, sort]);

  const handlePageChange = () => {
    //IF CATEGORY FILTER WAS APPLIED AND THEN LOAD MORE WAS CLICKED THEN
    //UPDATE CATEGORY PAGE TO NEXT PAGE AND NOW DATA WILL AGAIN BE FETCHED FROM ABOVE USE EFFECT
    //SINCE FPAGE IS A DEPENDENCY THERE
    //IF NO CATEGORY WAS APPLIED THEN JUST INCREMENT PAGE COUNT FOR NORMAL DATA
    //DATA WILL AGAIN BE FETCHED FROM USE EFFECT SINCE PAGE IS A DEPENDENCY THERE

    if (cat) dispatch(increasePageCount({listType: "category"}))
    else dispatch(increasePageCount({listType:"page"}))
  };

  //CUSTOM SORT FUNC SINCE I COULD NOT FIND A SORT_BY IN OPEN FOOD FACTS API
  //FOR THE FOLLOWING KEYS

  const compare = useCallback((a, b, sortField) => {
    if (sortField === "p_dsc") {
      return a.product_name < b.product_name ? 1 : -1;
    } else if (sortField === "p_asc") {
      return a.product_name > b.product_name ? 1 : -1;
    } else if (sortField === "n_dsc") {
      return a.nutrition_grades < b.nutrition_grades ? 1 : -1;
    } else return a.nutrition_grades > b.nutrition_grades ? 1 : -1;
  }, []);


  return (
    <div className="overflow-y-auto overflow-x-hidden flex flex-col gap-10 pr-2">
      {cat && loading && (
        <div className="self-center text-xs">
          <CircularProgress size={20} color="success" />
        </div>
      )}
      {cat && !loading && error && (
        <span className="self-center text-red-600 font-bold">
          An Error Occurred!
        </span>
      )}

      {/* //IF BARCODE QUERY WAS NOT APPLIED THEN JUST DISPLAY THE ARRAY OF DATA */}

      {!barcode &&
        data?.map((product, i) => <ListItem key={i} product={product} />)}

      {/* //IF BARCODE IS THERE THEN SHOW ONLY ONE PRODUCT IF IT EXISTS ELSE SHOW ERROR */}

      {barcode && barData && <ListItem product={barData}></ListItem>}
      {!barcode && !loading && !error && (
        <span
          onClick={handlePageChange}
          className="self-center text-slate-500 cursor-pointer"
        >
          Load More
        </span>
      )}
      {loading && (
        <div className="self-center text-xs">
          <CircularProgress size={20} color="success" />
        </div>
      )}
      {!loading && error && (
        <span className="self-center text-red-600 font-bold">
          An Error Occurred!
        </span>
      )}
    </div>
  );
};

export default List;
