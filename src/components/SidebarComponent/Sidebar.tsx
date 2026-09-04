import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { BsBoxArrowRight, BsArrowBarLeft, BsArrowBarRight } from "react-icons/bs";
import { BiUserCircle } from "react-icons/bi";
import {
  MdContrast,
  MdOutlineTextDecrease,
  MdOutlineTextIncrease,
} from "react-icons/md";
import { sidebarItems } from "./SidebarItems";
import { useAuth } from "../../hooks/useAuth";
import Brand from "../Brand";
import {
  SidebarContainer,
  SidebarBrand,
  AccessibilityActions,
  SidebarNav,
  SidebarFooter,
  ProfileMini,
  LogoutButton,
} from "./styles";

interface SidebarProps {
  onIncreaseFont: () => void;
  onDecreaseFont: () => void;
  canIncreaseFont: boolean;
  canDecreaseFont: boolean;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export default function Sidebar({
  onIncreaseFont,
  onDecreaseFont,
  canIncreaseFont,
  canDecreaseFont,
  isDarkMode,
  onToggleTheme,
}: SidebarProps) {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(true);
  const { user, signOut } = useAuth();

  function handleLogout() {
    signOut();
    navigate("/", { replace: true });
  }

  return (
    <SidebarContainer $expanded={isExpanded} data-expanded={isExpanded}>
      <SidebarBrand>
        <Brand compact={!isExpanded} inverse={isExpanded} />
      </SidebarBrand>

      <AccessibilityActions $expanded={isExpanded}>
        <button
          type="button"
          title="Contraste"
          aria-label="Alternar entre tema claro e escuro"
          aria-pressed={isDarkMode}
          onClick={onToggleTheme}
        >
          <MdContrast aria-hidden="true" />
          <span>Contraste</span>
        </button>
        <button
          type="button"
          title="Aumentar texto"
          aria-label="Aumentar tamanho das letras"
          onClick={onIncreaseFont}
          disabled={!canIncreaseFont}
        >
          <MdOutlineTextIncrease aria-hidden="true" />
          <span>Aumentar</span>
        </button>
        <button
          type="button"
          title="Diminuir texto"
          aria-label="Diminuir tamanho das letras"
          onClick={onDecreaseFont}
          disabled={!canDecreaseFont}
        >
          <MdOutlineTextDecrease aria-hidden="true" />
          <span>Diminuir</span>
        </button>
        <button
          type="button"
          title={isExpanded ? "Diminuir menu" : "Expandir menu"}
          aria-label={isExpanded ? "Diminuir menu lateral" : "Expandir menu lateral"}
          aria-expanded={isExpanded}
          onClick={() => setIsExpanded((expanded) => !expanded)}
        >
          {isExpanded ? <BsArrowBarLeft aria-hidden="true" /> : <BsArrowBarRight aria-hidden="true" />}
          <span>{isExpanded ? "Diminuir" : "Expandir"}</span>
        </button>
      </AccessibilityActions>

      <SidebarNav $expanded={isExpanded} aria-label="Menu principal">
        {sidebarItems.map(({ label, path, Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) => (isActive ? "active" : undefined)}
          >
            <Icon aria-hidden="true" />
            <span>{label}</span>
          </NavLink>
        ))}
      </SidebarNav>

      <SidebarFooter $expanded={isExpanded}>
        <ProfileMini $expanded={isExpanded}>
          <BiUserCircle aria-hidden="true" />
          <span>{user?.name ?? "Usuário"}</span>
        </ProfileMini>

        <LogoutButton $expanded={isExpanded} type="button" onClick={handleLogout}>
          <BsBoxArrowRight aria-hidden="true" />
          <span>Sair</span>
        </LogoutButton>
      </SidebarFooter>
    </SidebarContainer>
  );
}
