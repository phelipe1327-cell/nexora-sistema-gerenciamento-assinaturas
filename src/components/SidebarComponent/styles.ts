import styled from "styled-components";

export const SidebarContainer = styled.aside<{ $expanded: boolean }>`
  width: ${({ $expanded }) => ($expanded ? "17rem" : "5.5rem")};
  min-width: ${({ $expanded }) => ($expanded ? "17rem" : "5.5rem")};
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: sticky;
  top: 0;
  padding: 1rem 0.75rem;
  overflow-y: auto;
  background: var(--sidebar-background);
  border-right: 1px solid var(--sidebar-border);
  transition: width 0.24s ease, min-width 0.24s ease;

  @media (max-width: 760px) {
    width: 4.75rem;
    min-width: 4.75rem;
    padding-inline: 0.5rem;
  }
`;

export const SidebarBrand = styled.div`
  display: flex;
  align-items: center;
  min-height: 4.25rem;
  padding: 0 0.55rem 1rem;
  border-bottom: 1px solid var(--sidebar-border);

  @media (max-width: 760px) {
    justify-content: center;
    padding-inline: 0;
    .brand-copy { display: none; }
  }
`;

export const AccessibilityActions = styled.div<{ $expanded: boolean }>`
  display: grid;
  grid-template-columns: ${({ $expanded }) => ($expanded ? "repeat(4, 1fr)" : "1fr")};
  gap: 0.45rem;
  padding: 1rem 0 0.5rem;

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 2.4rem;
    padding: 0.45rem;
    color: var(--sidebar-muted);
    background: transparent;
    border: 1px solid transparent;
    border-radius: 0.7rem;
    cursor: pointer;
    transition: background 0.18s ease, color 0.18s ease;

    span { display: none; }
    svg { width: 1.1rem; height: 1.1rem; }
    &:hover { color: var(--sidebar-text); background: var(--sidebar-hover); }
    &:disabled { opacity: 0.35; cursor: not-allowed; }
  }
`;

export const SidebarNav = styled.nav<{ $expanded: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding: 1.1rem 0;

  a {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: ${({ $expanded }) => ($expanded ? "flex-start" : "center")};
    gap: 0.8rem;
    min-height: 3rem;
    padding: ${({ $expanded }) => ($expanded ? "0.65rem 0.85rem" : "0.65rem")};
    color: var(--sidebar-muted);
    border-radius: 0.8rem;
    font-size: 0.88em;
    font-weight: 600;
    text-decoration: none;
    transition: background 0.18s ease, color 0.18s ease;

    span { display: ${({ $expanded }) => ($expanded ? "inline" : "none")}; }
    svg { width: 1.25rem; height: 1.25rem; flex-shrink: 0; }
    &:hover { color: var(--sidebar-text); background: var(--sidebar-hover); }
    &.active {
      color: #00150a;
      background: linear-gradient(135deg, #00ff88, #57ffad);
      box-shadow: 0 0.65rem 1.5rem rgba(0, 255, 136, 0.18);
    }

    @media (max-width: 760px) {
      justify-content: center;
      padding-inline: 0.65rem;
      span { display: none; }
    }
  }
`;

export const SidebarFooter = styled.footer<{ $expanded: boolean }>`
  display: grid;
  gap: 0.55rem;
  padding-top: 1rem;
  border-top: 1px solid var(--sidebar-border);
`;

export const ProfileMini = styled.div<{ $expanded: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${({ $expanded }) => ($expanded ? "flex-start" : "center")};
  gap: 0.7rem;
  min-height: 2.75rem;
  padding: 0.55rem;
  color: var(--sidebar-text);
  background: var(--sidebar-hover);
  border-radius: 0.75rem;
  font-size: 0.78em;
  font-weight: 600;

  span { display: ${({ $expanded }) => ($expanded ? "block" : "none")}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  svg { width: 1.35rem; height: 1.35rem; flex-shrink: 0; }

  @media (max-width: 760px) {
    justify-content: center;
    span { display: none; }
  }
`;

export const LogoutButton = styled.button<{ $expanded: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${({ $expanded }) => ($expanded ? "flex-start" : "center")};
  gap: 0.7rem;
  min-height: 2.5rem;
  padding: 0.55rem 0.7rem;
  color: var(--sidebar-muted);
  background: transparent;
  border: 0;
  border-radius: 0.7rem;
  font-size: 0.8em;
  font-weight: 600;
  cursor: pointer;

  span { display: ${({ $expanded }) => ($expanded ? "inline" : "none")}; }
  svg { width: 1.15rem; height: 1.15rem; }
  &:hover { color: #fb7185; background: rgba(244, 63, 94, 0.09); }

  @media (max-width: 760px) {
    justify-content: center;
    span { display: none; }
  }
`;
