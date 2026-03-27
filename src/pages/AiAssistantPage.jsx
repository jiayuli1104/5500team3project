import { useMemo, useState } from "react";
import SectionCard from "../components/SectionCard";
import SimpleTable from "../components/SimpleTable";
import { extractTasksFromText, generateDailyPlan } from "../utils/aiHelpers";

export default function AiAssistantPage({ store }) {
  const [text, setText] = useState("Discuss onboarding flow; implement signup API ASAP; prepare unit tests; design error states for failed login");
  const [selectedProjectId, setSelectedProjectId] = useState(store.scopedProjects[0]?.id || "");
  const drafts = useMemo(() => extractTasksFromText(text), [text]);
  const plan = useMemo(() => generateDailyPlan(store.scopedTasks), [store.scopedTasks]);

  return (
    <div className="page-grid">
      <SectionCard title="Task Extraction" subtitle="Heuristic AI-style helper for free-form notes">
        <div className="form-grid">
          <textarea rows="6" value={text} onChange={(e) => setText(e.target.value)} />
          <select value={selectedProjectId} onChange={(e) => setSelectedProjectId(e.target.value)}>
            <option value="">Choose project</option>
            {store.scopedProjects.map((project) => (
              <option key={project.id} value={project.id}>{project.name}</option>
            ))}
          </select>
          <button className="primary-btn" onClick={() => {
            if (!selectedProjectId || !drafts.length) return;
            store.importDraftTasks(drafts, selectedProjectId);
          }}>Import Draft Tasks</button>
        </div>
        <SimpleTable
          columns={[
            { key: "title", label: "Draft Title" },
            { key: "priority", label: "Priority" },
            { key: "effort", label: "Est. Hours" },
          ]}
          rows={drafts}
          emptyLabel="Paste meeting notes or requirements to generate task drafts."
        />
      </SectionCard>

      <SectionCard title="Daily Plan Suggestions" subtitle="Recommended order based on due date and priority">
        <SimpleTable
          columns={[
            { key: "rank", label: "Rank" },
            { key: "title", label: "Task" },
            { key: "reason", label: "Reason" },
          ]}
          rows={plan}
          emptyLabel="No tasks available for planning."
        />
      </SectionCard>
    </div>
  );
}
