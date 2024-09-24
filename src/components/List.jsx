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

const List = ({ sort, barcode }) => {
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
  // console.log(searchQ,product.fpage.value)

  useEffect(() => {
    //FETCHING ALL DATA HERE IF YOU DONT APPLY ANY CATEGORY FILTER THEN IT FETCHES NORMAL DATA
    // OTHERWISE IT ADD CATEGORIES AS QUERY AND NOW FETCH QUERY DATA AND STORE IT IN FILTERED PRODUCTS
    // A THING TO NOTE EACH TIME A NEW CATEGORY FILTER IS APPLIED OLD FILTERED DATA WILL BE REMOVED
    // FROM REDUX STORE AND FPAGE WILL BE SET TO 1 AGAIN

    const fetchData = async () => {
      setLoading(true);
      setError(false);
      try {
        var url1 =
          "https://world.openfoodfacts.org/api/v1/search?page_size=10&page=";
        var url2 = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${product.searchQ}&json=true&page_size=10&page=`

        // FPAGE IS USED FOR CATEGORY DATA/FILTERED DATA
        // IF FPAGE VALUE IS ZERO THEN SIMPLE FETCH NORMAL DATA

        if (product.fpage.value !== 0) {
          url1 += product.fpage.value;
          url2 += product.fpage.value
        } else url1 += product.page;
        url1 += `&fields=${fields}`;
        url2 += `&fields=${fields}`;
        if (product.cat) {
          url1 += `&categories_tags_en=${product.cat}`;
        }
        var res
        if(product.searchQ) {
          res = await axios.get(url2)
          console.log(res)
        } else {
          res = await axios.get(url1);
        }
        
        const { products } = res.data;

        var arr = [];

        //STORING DATA IN TEMP ARRAY WHETHER ITS FILTERED DATA OR NORMAL

        if (product.fpage.value !== 0 && (product.cat || product.searchQ)) {
          if (product.fpage.value === 1) arr = [...products];
          else arr = [...product.filteredProducts, ...products];
          dispatch(addFilteredProducts({ products, fpage: product.fpage.value }));
        } else {
          arr = [...product.products, ...products];
          dispatch(addMoreProducts({ products }));
        }

        //IF THERE IS SORT QUERY THEN DO THESE OPERATION ON ANY DATA WHETHER FILTERED OR NORMAL

        if (sort) arr.sort((a, b) => compare(a, b, sort));

        //STORE DATA IN ARRAY

        setData(arr);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
        setError(true);
      }
    };
    if (product.prevPage !== product.page || (product.fpage.value !== 0 && (product.cat || product.searchQ))) {
      //ONLY FETCH DATA IF LOAD MORE WAS CLICKED OR CATEGORY WAS APPLIED

      fetchData();
      dispatch(setPrevPage())
    } else {
      //IF THIS ELSE RUNS THEN IT MEANS THERE IS NO CATEGORY APPLIED SO JUST GET THE NORMAL DATA
      //FROM REDUX STORE AND APPLY SORT QUERY IF ANY

      var arr = [...product.products];
      if (sort) {
        arr.sort((a, b) => compare(a, b, sort));
      }
      setData(arr);
    }
  }, [product.page, product.fpage, product.prevPage]);

  useEffect(() => {
    //WHEN NO NEW DATA IS FETCHED BUT SORT FILTER WAS APPLIED THEN RUN THIS
    //IF CATEGORY OR SEARCH IS THERE ON CURRENT DATA THEN GET FILTERED DATA OTHERWISE GET NORMAL DATA

    var arr = [...(product.cat || product.searchQ ? product.filteredProducts : product.products)];

    //APPLY SORT IF ANY

    if (sort) {
      arr.sort((a, b) => compare(a, b, sort));
    }
    setData(arr);
  }, [sort]);

  const handlePageChange = () => {
    //IF CATEGORY FILTER OR SEARCH WAS APPLIED AND THEN LOAD MORE WAS CLICKED THEN
    //UPDATE CATEGORY PAGE TO NEXT PAGE AND NOW DATA WILL AGAIN BE FETCHED FROM ABOVE USE EFFECT
    //SINCE FPAGE IS A DEPENDENCY THERE
    //IF NO CATEGORY WAS APPLIED THEN JUST INCREMENT PAGE COUNT FOR NORMAL DATA
    //DATA WILL AGAIN BE FETCHED FROM USE EFFECT SINCE PAGE IS A DEPENDENCY THERE

    if (product.cat || product.searchQ) dispatch(increasePageCount({listType: "category"}))
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
      {product.cat && loading && (
        <div className="self-center text-xs">
          <CircularProgress size={20} color="success" />
        </div>
      )}
      {product.cat && !loading && error && (
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
