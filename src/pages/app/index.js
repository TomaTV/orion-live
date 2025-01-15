import withAuth from "../../components/hooks/withAuth";
import HeaderApp from "@/components/app/Header";

function AppPage() {
  return (
    <div className="min-h-screen bg-orion-dark-bg">
      <HeaderApp />
    </div>
  );
}

export default withAuth(AppPage);
