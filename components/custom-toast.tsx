import Image from "next/image";

interface CustomToastProps {
  success: boolean;
  message: string;
}

export default function CustomToast({ success, message }: CustomToastProps) {
  return (
    <div className="font-paperlogy flex gap-2 items-center">
      <Image
        src="/plusone.webp"
        alt="플러스원! 로고"
        width={40}
        height={40}
        draggable={false}
      />
      <div>
        <p
          className={`${
            success ? "text-blue-500" : "text-red-500"
          } font-semibold`}
        >
          {success ? message : "에러가 발생했습니다."}
        </p>
        <p className="text-xs text-neutral-600 text-wrap whitespace-break-spaces">
          {success ? "내일도 플러스원 해주세요 :)" : message}
        </p>
      </div>
    </div>
  );
}
