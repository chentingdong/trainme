import Image from "next/image";
import { FcSynchronize } from "react-icons/fc";
import { RxActivityLog } from "react-icons/rx";
import { BsCalendar3 } from "react-icons/bs";
import { FaDumbbell, FaGear, FaUser } from 'react-icons/fa6';
import { trpc } from '@/app/api/trpc/client';
import { signOut } from '@workos-inc/authkit-nextjs';
import { withAuth } from '@workos-inc/authkit-nextjs';

async function Header() {
  const { mutateAsync: syncStrava, isPending } = trpc.strava.sync.useMutation();
  const { user } = await withAuth({ ensureSignedIn: true });

  return (
    <header className="bg-slate-800 text-white p-2 fixed top-0 left-0 right-0 z-50">
      <nav className="flex justify-between items-center">
        <a href="/" className="text-xl font-normal flex gap-4">
          <div className="bg-blue-500 rounded-full w-6 h-6">
            <Image src="/TrainMe.webp" alt="Logo" width={48} height={48} />
          </div>
          <div className="text-blue-100">TrainMe</div>
        </a>
        <ul className="flex gap-2 items-center">
          <li>
            <a
              href="#"
              onClick={() => syncStrava({})}
              className="flex items-center gap-2 btn btn-link"
            >
              <FcSynchronize
                className={isPending ? "icon loading-icon" : "icon"}
              />
              Sync Latest
            </a>
          </li>
          <li>
            <a
              href="/calendar"
              className="hover:underline flex gap-2 items-center btn btn-link"
            >
              <BsCalendar3 className="icon" />
              Calendar
            </a>
          </li>
          <li className="relative flex gap-1 items-center">
            <a
              href="/activities"
              className="hover:underline flex gap-2 items-center btn btn-link"
            >
              <RxActivityLog className="icon" />
              Activities
            </a>
          </li>
          <li>
            <a href="/workouts" className="hover:underline flex gap-2 items-center btn btn-link">
              <FaDumbbell className="icon" />
              Workouts
            </a>
          </li>
          <li>
            <a href="/settings" className="hover:underline flex gap-2 items-center btn btn-link">
              <FaGear className="icon" />
              Settings
            </a>
          </li>
          <li className="flex gap-1 items-center">
            {!!user ? (
              <button onClick={signOut} className="btn btn-link">
                <FaUser className="icon" />
              </button>
            ) : (
              <button className="btn btn-link">
                <FaUser className="icon" />
              </button>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
