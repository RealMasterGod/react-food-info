import {
  ArrowCircleLeftOutlined,
  ShoppingBasketOutlined,
} from "@mui/icons-material";
import { Badge, IconButton } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [open, setOpen] = useState(true);
  const {quantity} = useSelector(state => state.cart)
  const {pathname} = useLocation()
  return (
    <div className="h-14 p-2 sm:h-20 bg-myGreenLight">
      <div className="md:w-full lg:w-[80%] mx-auto h-full flex items-center justify-between gap-5">
        <div className="h-full flex items-center gap-4 cursor-default">
          <img className="h-full" src="/logo.png" alt="" />
          <span className="text-myGreen font-bold text-xl sm:text-3xl font-Gloria">
            Zesty Foods
          </span>
        </div>
        <div className="hidden sm:flex gap-5 md:gap-12 text-myGreen text-lg font-bold items-center">
          <Link to={"/"} className="link"><span className={pathname === "/" ? "cursor-pointer transition-all transform hover:scale-110 hover:text-black border-b-2 border-b-myGreen" : "cursor-pointer transition-all transform hover:scale-110 hover:text-black"}>
            Home
          </span></Link>
          <span className="cursor-pointer transition-all transform hover:scale-110 hover:text-black">
            About
          </span>
          <span className="cursor-pointer transition-all transform hover:scale-110 hover:text-black">
            Contact
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div
            className={
              open
                ? "sm:hidden relative z-50 duration-500 transition-all"
                : "sm:hidden transition-all transform rotate-180 duration-500 relative z-50"
            }
            onClick={() => setOpen((prev) => !prev)}
          >
            <ArrowCircleLeftOutlined
              style={{ color: "#155815", fontSize: "32px" }}
            />
          </div>
          <button className="bg-myGreen hover:bg-[#008000] text-white text-xs sm:text-sm rounded-full px-2 py-[6px] sm:px-3 sm:py-1">
            Sign In
          </button>
          <Link to={"/cart"} className="link">
            <IconButton aria-label="cart">
              <Badge badgeContent={quantity} color="success">
                <ShoppingBasketOutlined style={{ color: "#155815" }} />
              </Badge>
            </IconButton>
          </Link>
        </div>
      </div>
      <div
        className={
          open
            ? "w-[123px] sm:hidden absolute transition-all top-0 transform bg-myGreenLight -right-full duration-500 h-screen gap-5 flex flex-col items-center justify-center"
            : "w-[123px] sm:hidden absolute right-0 z-10 bg-myGreenLight flex flex-col items-center justify-center transition-all duration-500 gap-5 top-0 h-screen"
        }
      >
        <Link to={"/"} className="link"><div className="text-lg font-bold">Home</div></Link>
        <div className="text-lg font-bold">Contact</div>
        <div className="text-lg font-bold">About</div>
      </div>
    </div>
  );
};

export default Navbar;
