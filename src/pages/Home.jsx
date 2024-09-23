import { useCallback, useEffect, useState } from "react";
import List from "../components/List";
import debounce from "lodash.debounce";
import { useSelector } from "react-redux";

const Home = () => {
  const [searchQ,setSearchQ] = useState("")
  const [sort,setSort] = useState("")
  const [cat,setCat] = useState("")
  const [fpage,setFPage] = useState({value: 0})
  const [barcode,setBarcode] = useState("")
  const product = useSelector(state => state.product)
  const handleCatChange = (e) => {
    setCat(e.target?.value)
    if(!e.target?.value) {
      setFPage({value: 0})
    } else {
      setFPage({value: 1})
    }
  }
  const debounceOnChange = debounce((e) => {
    setSearchQ(e.target?.value)
  },200)

  const debounceOnBarChange = debounce((e) => {
    setBarcode(e.target?.value)
  },500)

  return (
    <div className="h-[calc(100vh-56px)] sm:h-[calc(100vh-81px)] w-full p-2 lg:w-[80%] mx-auto">
      <div className="bg-myGreenLight h-full flex xl:flex-row flex-col gap-4 ">
        <div className="h-full bg-myGreen flex-1 p-4 rounded-xl">
          <div
            className="bg-white h-full flex rounded-md"
            style={{ backgroundImage: 'url("/banner.jpeg")', backgroundRepeat: 'no-repeat',backgroundSize: 'cover' ,backgroundPosition: 'center' }}
          >
            <h1 className="text-xl sm:text-5xl xs:self-center xl:self-auto p-5 text-myGreen font-bold">
              Find Information About All Your Favorite Foods.
            </h1>
          </div>
        </div>
        <div className="sm:flex-[3] p-4 overflow-hidden bg-myGreen rounded-xl">
            <div className="bg-white w-full h-full flex flex-col gap-5 rounded-md p-2">
                <div className="flex-wrap flex justify-between lg:justify-normal gap-2">
                    <input onChange={debounceOnChange} type="text" className="w-full sm:w-[32%] outline-none p-1 sm:p-2 border rounded-none border-slate-400" placeholder="Search by name" />
                    <input onChange={debounceOnBarChange} type="text" className="w-full sm:w-[32%] outline-none p-1 sm:p-2 border rounded-none border-slate-400" placeholder="Search by barcode no." />
                    <select onChange={(e) => setSort(e.target.value)} className="border sm:w-[33%] w-full p-1 sm:p-2 outline-none border-slate-400" name="" id="">
                        <option value="">Sort</option>
                        <option value="p_asc">Product Name (A-Z)</option>
                        <option value="p_dsc">Product Name (Z-A)</option>
                        <option value="n_asc">Nutrition Grade (ASC)</option>
                        <option value="n_dsc">Nutrition Grade (DSC)</option>
                    </select>
                    <select onChange={handleCatChange} className="border xl:w-auto w-full sm:w-auto p-1 sm:p-2 outline-none border-slate-400" name="" id="">
                        <option value="">Filter By category</option>
                        {product?.categories?.map(cat => (
                          <option key={cat.name} value={cat?.name}>{cat?.name || "NA"}</option>
                        ))}
                    </select>
                </div>
                <List searchQ={searchQ} cat={cat} barcode={barcode} sort={sort} fpage={fpage} setFPage={setFPage}  />
            </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
