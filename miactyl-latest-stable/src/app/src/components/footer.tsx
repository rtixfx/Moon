import '@/assets/css/footer.css';
import SystemContenxt from '@/state/system';

export const FullFooter = () => {
    const system = SystemContenxt.useStoreState((state: any) => state.system);
    return (
        <>
            <div className="footer">
                <span>@ {system.name} | Powered by <a href="https://github.com/misalibaytb/miactyl/tree/latest-stable">Miactyl</a></span>
                <span>{system.version} {system.update && <span className="update">Update Available</span>}</span>
            </div>
        </>
    )
}
