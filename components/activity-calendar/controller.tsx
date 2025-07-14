import { getActivity } from "@/app/(main)/actions";
import ActivityCalendarView from "./view";
import {
  getUserData,
  GetUserStatus,
} from "@/lib/supabase/actions/get-user-data";
import { LockClosedIcon, LockOpenIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { logout } from "@/lib/supabase/actions/logout";
import { redirect } from "next/navigation";

export default async function ActivityCalendarController() {
  const result = await getUserData();

  if (result.status === GetUserStatus.DB_MISSING) {
    await logout(); // 사용자 로그아웃
    redirect("/login");
  }

  if (result.status !== GetUserStatus.SUCCESS) {
    return <GuestActivityCalendar />;
  }

  const { success, data } = await getActivity(result.data.id);

  return <ActivityCalendarView success={success} {...data} />;
}

function GuestActivityCalendar() {
  return (
    <section
      className="w-full max-w-screen-xl mx-auto sm:p-5 p-3 relative border rounded-lg
      border-neutral-50 dark:border-neutral-900 dark:bg-neutral-900 shadow"
    >
      <div className="absolute inset-0 backdrop-blur-[2px] z-1 flex justify-center items-center">
        <div className="flex flex-col justify-center items-center gap-3">
          <LockClosedIcon className="size-6 mx-auto" />
          <p className="text-lg">
            스트릭 데이터는 로그인 후 확인할 수 있습니다.
          </p>
          <Link
            href="/login"
            className="font-semibold px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 transition text-white
            flex items-center gap-1"
          >
            <LockOpenIcon className="size-5" /> 1초만에 로그인하기
          </Link>
        </div>
      </div>
      <div className="flex items-center justify-between mb-3">
        <div className="text-start font-medium text-lg flex items-center gap-1">
          <div className="size-5 bg-neutral-100 dark:bg-neutral-800 rounded-full" />
          <div className="w-20 h-3 bg-neutral-100 dark:bg-neutral-800 rounded-full" />
        </div>
        <div className="w-16 h-5 bg-neutral-100 dark:bg-neutral-800 rounded" />
      </div>
      <div className="mt-5 w-full h-[192px] bg-neutral-100 dark:bg-neutral-800 rounded" />
      <div className="flex justify-end">
        <div className="w-24 h-3 mt-4 bg-neutral-100 dark:bg-neutral-800 rounded" />
      </div>
    </section>
  );
}
