export default function Button({ children, onClick, variant = 'primary' }) {
  const baseStyle = "padding-10px-20px border-radius-5px font-bold cursor-pointer";
  const primaryStyle = variant === 'primary' ? "bg-blue-500 text-white" : "bg-gray-200 text-black";

  return (
    <button className={`${baseStyle} ${primaryStyle}`} onClick={onClick}>
      {children}
    </button>
  );
}