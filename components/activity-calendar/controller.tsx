import { getSession } from "@/lib/session";
import { getActivity } from "@/app/(main)/actions";
import ActivityCalendarView from "./view";

export default async function ActivityCalendarController() {
  const session = await getSession();
  const { success, data } = await getActivity(session.id);

  return (
    <div className="p-5">
      <ActivityCalendarView success={success} {...data} />
    </div>
  );
}
