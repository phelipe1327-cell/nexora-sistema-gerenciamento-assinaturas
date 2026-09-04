import { useState, type ReactNode } from "react";
import type { IconType } from "react-icons";
import Sidebar from "./SidebarComponent/Sidebar";
import Topbar from "./Topbar";
import { useTheme } from "../hooks/useTheme";

interface LayoutProps {
  title: string;
  icon?: IconType;
  children: ReactNode;
}

export default function Layout({ title, icon, children }: LayoutProps) {
  const [fontScale, setFontScale] = useState(1);
  const { isDarkMode, toggleTheme } = useTheme();

  function increaseFont() {
    setFontScale((scale) => Math.min(Number((scale + 0.1).toFixed(1)), 1.2));
  }

  function decreaseFont() {
    setFontScale((scale) => Math.max(Number((scale - 0.1).toFixed(1)), 0.9));
  }

  return (
    <div className={`app-shell ${isDarkMode ? "dark" : ""}`}>
      <div className="app-layout" style={{ fontSize: `${16 * fontScale}px` }}>
        <Sidebar
          onIncreaseFont={increaseFont}
          onDecreaseFont={decreaseFont}
          canIncreaseFont={fontScale < 1.2}
          canDecreaseFont={fontScale > 0.9}
          isDarkMode={isDarkMode}
          onToggleTheme={toggleTheme}
        />
        <div className="content-area">
          <Topbar title={title} icon={icon} />
          <main className="page-body">{children}</main>
        </div>
      </div>
    </div>
  );
}
