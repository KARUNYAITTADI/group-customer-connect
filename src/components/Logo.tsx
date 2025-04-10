
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/" className="flex items-center">
      <div className="flex flex-col items-center">
        <div className="bg-amber-400 w-16 h-16 rounded-md flex items-center justify-center shadow-md hover:shadow-lg transition-all">
          <span className="text-2xl font-bold text-black">BB</span>
        </div>
        <div className="text-xs font-semibold mt-1 text-black">BISTRO BILL</div>
      </div>
    </Link>
  );
};

export default Logo;
