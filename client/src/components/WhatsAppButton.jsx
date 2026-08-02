import { FaWhatsapp } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { fetchSettings } from "../services/settingsService.js";

const WhatsAppButton = () => {
  const { data } = useQuery({ queryKey: ["public-settings"], queryFn: fetchSettings });
  const phone = data?.data?.phone?.replace(/[^\d]/g, "") || "9770000000000";

  return (
    <a
      href={`https://wa.me/${phone}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white
                 w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-lg
                 transition-transform hover:scale-110"
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp />
    </a>
  );
};

export default WhatsAppButton;
