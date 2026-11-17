import { FileSearch, Palette, Recycle, Settings, FileCog } from "lucide-react";

const STEPS = [
  {
    Icon: FileSearch,
    title: "Evaluate",
    text: "Measure effectiveness of designed Solutions and identify Gaps to maintain and achieve continuous efficiency.",
  },
  {
    Icon: Palette,
    title: "Design",
    text: "Monitor existing Infra and Manage deployed solutions by using tools & manpower either onsite or remotely for effective results.",
  },
  {
    Icon: Recycle,
    title: "Deploy",
    text: "Measure effectiveness of designed Solutions and identify Gaps to maintain and achieve continuous efficiency.",
  },
  {
    Icon: Settings,
    title: "Manage",
    text: "Monitor existing Infra and Manage deployed solutions by using tools & manpower either onsite or remotely for effective results.",
  },
  {
    Icon: FileCog,
    title: "Maintain",
    text: "Measure effectiveness of designed Solutions and identify Gaps to maintain and achieve continuous efficiency.",
  },
];

const WorkingProgress = () => (
  <section className="working-progress-section">
    <div className="working-progress-heading">
      <span className="working-progress-badge" />
      <h2 className="section-heading">
        Working <span className="gradient-text">Progress</span>
      </h2>
      <p>How we work for our valued customers.</p>
    </div>

    <div className="working-progress-timeline">
      {STEPS.map(({ Icon, title, text }, i) => (
        <div
          className={`working-progress-row ${
            i % 2 === 0 ? "row-left" : "row-right"
          }`}
          key={title}
        >
          <div className="working-progress-hex">
            <Icon size={28} strokeWidth={1.75} />
            <span>{title}</span>
          </div>
          <div className="working-progress-text">
            <h5>
              <span>{title.toUpperCase()}</span> :-
            </h5>
            <p>{text}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default WorkingProgress;
