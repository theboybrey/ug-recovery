import Image from "next/image";

export default function WebsiteFooter() {
  return (
    <footer className="w-full bg-sidebar text-white py-6 mt-auto flex flex-col items-center border-t border-white/10">
      <div className="flex items-center gap-3 mb-2">
        <Image
          src="/assets/ugrecover.png"
          alt="Institution Logo"
          width={36}
          height={36}
          className="border border-white rounded bg-white"
        />
        <span className="font-bold text-lg tracking-wide">UGRecover</span>
      </div>
      <p className="text-xs text-gray-200">
        &copy; {new Date().getFullYear()} All rights reserved. University Lost
        &amp; Found Platform.
      </p>
    </footer>
  );
}
