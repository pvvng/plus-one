import { getSession } from "@/lib/session";
import { getActivity } from "@/app/(main)/actions";
import ActivityCalendarView from "./view";

export default async function ActivityCalendarController() {
  await new Promise((r) => setTimeout(r, 3000));
  const session = await getSession();
  const { success, data } = await getActivity(session.id);

  return <ActivityCalendarView success={success} {...data} />;
}
