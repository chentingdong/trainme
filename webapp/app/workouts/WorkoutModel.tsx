import { Modal } from "flowbite-react";
import React from "react";
import { format } from "date-fns";
import WorkoutList from "./WorkoutList";
import WorkoutEditor from "./WorkoutEditor";

type Props = {
  date: Date;
  show: boolean;
  hide: () => void;
};

export default function WorkoutModel({ date, show, hide }: Props) {
  return (
    <Modal dismissible show={show} onClose={hide} size="xlg" position="center">
      <Modal.Header className="dark:bg-gray-600 dark:text-gray-100 dark:border-b-slate-900">
        <span>Add workout on: </span>
        <span> {format(date, "EEEE, yyyy-MM-dd")}</span>
      </Modal.Header>
      <Modal.Body className="dark:bg-gray-800 dark:text-gray-100">
        <div className="grid grid-cols-5 h-176">
          <div className="col-span-4 h-full overflow-auto">
            <WorkoutEditor />
          </div>
          <div className="col-span-1 border-l h-full overflow-auto border-slate-100 dark:border-slate-900 px-4">
            <WorkoutList />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="dark:bg-gray-600 dark:text-gray-200 dark:border-t-slate-900">
        <button className="btn btn-primary">Schedule it</button>
      </Modal.Footer>
    </Modal>
  );
}
