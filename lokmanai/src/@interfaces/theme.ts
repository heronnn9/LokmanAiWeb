export interface SidebarProps {
    isCollapsed?: boolean;
    onToggle?: () => void;
}

export interface SidebarRef {
    toggleMobile: () => void;
}

export interface MenuItem {
    id: string;
    label: string;
    href: string;
    icon: string;
}
