import Loader from "@/components/loader";

export default function UpdatePageLoading() {
  return (
    <div className="p-5 w-full h-screen flex justify-center items-center font-paperlogy">
      <div className="space-y-3 text-center">
        <Loader />
        <p>로딩 중입니다..</p>
      </div>
    </div>
  );
}
