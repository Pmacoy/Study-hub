import type { LucideIcon } from 'lucide-react';

/**
 * Tipo unificado para itens do menu da Sidebar.
 * Usado por App.tsx e Sidebar.tsx para evitar conflitos de tipos
 * entre os MenuGroup de cada domínio (DevOps, Azure, AWS, etc).
 */
export interface SidebarMenuItem {
  id: string;
  label: string;
  sublabel: string;
  icon: LucideIcon;
}

export interface SidebarMenuGroup {
  title: string;
  items: SidebarMenuItem[];
}
