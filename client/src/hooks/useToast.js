import { useContext } from "react";
import { ToastContext } from "../contexts/ToastContext.jsx";

const useToast = () => useContext(ToastContext);

export default useToast;
