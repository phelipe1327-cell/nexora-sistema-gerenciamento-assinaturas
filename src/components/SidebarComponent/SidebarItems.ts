import type { IconType } from "react-icons";
import { AiOutlineIdcard } from "react-icons/ai";
import { FiUsers } from "react-icons/fi";
import { MdOutlineSubscriptions } from "react-icons/md";

export interface SidebarItem {
  label: string;
  path: string;
  Icon: IconType;
}

export const sidebarItems: SidebarItem[] = [
  { label: "Assinaturas", path: "/assinaturas", Icon: MdOutlineSubscriptions },
  { label: "Planos", path: "/planos", Icon: AiOutlineIdcard },
  { label: "Usuários", path: "/usuarios", Icon: FiUsers },
];
