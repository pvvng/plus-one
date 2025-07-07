import Image from "next/image";
import Link from "next/link";

export default function HomeLink() {
  return (
    <Link href="/" className="font-semibold text-lg inline-flex items-center">
      <Image src="/plusone.webp" alt="플러스원! 로고" width={25} height={25} />
      플러스원!
    </Link>
  );
}
