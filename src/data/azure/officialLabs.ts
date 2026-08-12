import type { StudyTab } from '../../types/azure';

export interface OfficialLab {
  exercise: number;
  title: string;
  url: string;
}

const BASE = 'https://mslabs.cloudguides.com/en-us/guides/AZ-104%20Exam%20Guide%20-%20Microsoft%20Azure%20Administrator%20Exercise%20';

const lab = (exercise: number, title: string): OfficialLab => ({
  exercise,
  title,
  url: `${BASE}${exercise}`,
});

/**
 * Labs oficiais do simulador da Microsoft (mslabs.cloudguides.com),
 * mapeados aos módulos de estudo do hub.
 *
 * São ambientes guiados gratuitos — praticas no portal real da Azure
 * sem precisares de subscrição própria.
 */
export const OFFICIAL_LABS: Partial<Record<StudyTab, OfficialLab[]>> = {
  identity: [
    lab(1, 'Gerir identidades no Microsoft Entra ID'),
  ],
  governance: [
    lab(2, 'Gerir subscrições e grupos de gestão'),
    lab(3, 'Governança com Azure Policy'),
  ],
  rbac: [
    lab(4, 'Atribuir papéis e permissões (RBAC)'),
    lab(5, 'Gerir recursos pelo portal Azure'),
    lab(6, 'Gerir recursos com ARM templates'),
  ],
  vnet: [
    lab(8, 'Implementar redes virtuais'),
    lab(9, 'Configurar conectividade intersite'),
    lab(10, 'Gestão de tráfego de rede'),
  ],
  storage: [
    lab(11, 'Gerir Azure Storage'),
  ],
  compute: [
    lab(12, 'Gerir máquinas virtuais'),
    lab(13, 'Implementar Web Apps'),
  ],
  containers: [
    lab(14, 'Azure Container Instances'),
    lab(15, 'Azure Kubernetes Service'),
  ],
  monitor: [
    lab(16, 'Implementar protecção de dados'),
    lab(17, 'Implementar monitorização'),
  ],
};

export function labsForTab(tab: StudyTab): OfficialLab[] {
  return OFFICIAL_LABS[tab] ?? [];
}

export const TOTAL_LABS = Object.values(OFFICIAL_LABS)
  .reduce((sum, labs) => sum + (labs?.length ?? 0), 0);
