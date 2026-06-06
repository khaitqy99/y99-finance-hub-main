import { PhoneCall } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const ZALO_URL = "https://zalo.me/+84788766009";
const WHATSAPP_URL = "https://wa.me/+84788766009";
const WHATSAPP_ICON_URL = "https://cdn-icons-png.flaticon.com/128/5968/5968841.png";
const FACEBOOK_URL = "https://www.facebook.com/profile.php?id=61575859284966";
const FACEBOOK_ICON_URL = "https://cdn-icons-png.flaticon.com/128/5968/5968764.png";
const HOTLINE_TEL = "tel:1900575792";

const fabBase =
  "flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white shadow-md transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:h-12 sm:w-12";

const iconLinkBase =
  "pointer-events-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:h-12 sm:w-12";

const FloatingContactDock = () => {
  const { toast } = useToast();

  return (
    <div
      className={cn(
        "pointer-events-none fixed z-40 flex flex-col items-center gap-2 sm:gap-2.5",
        "bottom-[calc(0.75rem+env(safe-area-inset-bottom,0px))] right-[calc(0.75rem+env(safe-area-inset-right,0px))]",
        "sm:bottom-[calc(2rem+env(safe-area-inset-bottom,0px))] sm:right-[calc(1.5rem+env(safe-area-inset-right,0px))]",
      )}
      aria-label="Liên hệ nhanh"
    >
      <a
        href={ZALO_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(fabBase, "pointer-events-auto bg-[#0068FF]")}
        aria-label="Chat Zalo Y99"
        onClick={() =>
          toast({
            title: "Đang mở Zalo",
            description: "Bạn sẽ được chuyển đến trang chat Zalo với Y99.",
          })
        }
      >
        <span className="text-[9px] font-extrabold tracking-tight sm:text-[10px]">Zalo</span>
      </a>

      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={iconLinkBase}
        aria-label="Chat WhatsApp Y99"
        onClick={() =>
          toast({
            title: "Đang mở WhatsApp",
            description: "Bạn sẽ được chuyển đến WhatsApp để chat với Y99.",
          })
        }
      >
        <img
          src={WHATSAPP_ICON_URL}
          alt=""
          width={48}
          height={48}
          draggable={false}
          className="h-9 w-9 object-contain sm:h-12 sm:w-12"
        />
      </a>

      <a
        href={FACEBOOK_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={iconLinkBase}
        aria-label="Facebook Y99"
        onClick={() =>
          toast({
            title: "Đang mở Facebook",
            description: "Bạn sẽ được chuyển đến trang Facebook chính thức của Y99.",
          })
        }
      >
        <img
          src={FACEBOOK_ICON_URL}
          alt=""
          width={48}
          height={48}
          draggable={false}
          className="h-9 w-9 object-contain sm:h-12 sm:w-12"
        />
      </a>

      <a
        href={HOTLINE_TEL}
        className={cn(fabBase, "pointer-events-auto bg-sky-500")}
        aria-label="Gọi hotline 1900575792"
        onClick={() =>
          toast({
            title: "Đang kết nối cuộc gọi",
            description: "Hotline Y99: 1900575792 — cảm ơn bạn đã liên hệ.",
          })
        }
      >
        <PhoneCall className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden />
      </a>
    </div>
  );
};

export default FloatingContactDock;
