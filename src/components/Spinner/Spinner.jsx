import { CircleLoader } from "react-spinners";

export default function Spinner({ size = 50, color = "#2563EB" }) {
  return (
    <div className="flex justify-center items-center h-screen">
      <CircleLoader size={size} color={color} />
    </div>
  );
}
