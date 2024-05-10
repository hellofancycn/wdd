interface DefaultSettings {
    title: string;
    showSettings: boolean;
    tagsView: boolean;
    fixedHeader: boolean;
    sidebarLogo: boolean;
    errorLog: string;
}

const defaultSettings: DefaultSettings = {
    title: 'wdd-admin',
    showSettings: false,
    tagsView: true,
    fixedHeader: true,
    sidebarLogo: true,
    errorLog: 'production'
};

export default defaultSettings;
