import { BiLoaderCircle } from "react-icons/bi";

export default function Loader(){
    return(
        <div className="w-screen h-screen flex justify-center items-center ">
      <BiLoaderCircle className="animate-spin text-blue-200 text-5xl"/>
      </div>
    )
}