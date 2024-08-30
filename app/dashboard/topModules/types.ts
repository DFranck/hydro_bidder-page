export enum TabLabel {
    VOTING = 'voting',
    DEPLOYED = 'deployed',
    LOCKUPS = 'lockups',
    TRIBUTE = 'tribute'
};

export type TopModulesProps = {
    isProposalDetailView: boolean,
    isConnected: boolean,
    tab?: TabLabel
    onTabChange?: (value: TabLabel) => void
}