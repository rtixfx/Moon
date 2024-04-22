import '@/assets/css/footer.css';
import SystemContenxt from '@/state/system';

export const FullFooter = () => {
    return (
        <>
            Footer
        </>
    )
}
export const TextFooter = () => {
    const system = SystemContenxt.useStoreState((state: any) => state.system);
    return (
        <>
            @ {system.name} | Powered by <a href="https://github.com/misalibaytb/miactyl/tree/latest-stable">Miactyl</a> {system.version} {system.update && <span className="update">with an update available</span>}
        </>
    )
}