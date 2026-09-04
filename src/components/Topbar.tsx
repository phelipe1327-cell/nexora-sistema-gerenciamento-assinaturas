import type { IconType } from "react-icons";

interface TopbarProps {
  title: string;
  icon?: IconType;
}

export default function Topbar({ title, icon: Icon }: TopbarProps) {
  return (
    <header className="topbar">
      <div className="topbar-title">
        {Icon ? <span className="topbar-icon"><Icon aria-hidden="true" /></span> : null}
        <div><span>Visão geral</span><h1>{title}</h1></div>
      </div>
      <span className="environment-label">Ambiente local</span>
    </header>
  );
}
