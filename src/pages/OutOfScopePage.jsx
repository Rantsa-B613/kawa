import { useNavigate } from "react-router-dom";
import { OutOfScopeNotice } from "../components/layout/OutOfScopeNotice";

export function OutOfScopePage({ label }) {
  const navigate = useNavigate();
  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-10 xl:px-12">
      <OutOfScopeNotice label={label} onBack={() => navigate("/reservations")} />
    </div>
  );
}
