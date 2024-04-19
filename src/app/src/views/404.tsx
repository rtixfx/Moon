import '@/assets/css/404.css';
import Link from '@/api/Link';


const FourOFRour = () => {
    return (
        <>
            <div className="FoF__container">
                <h1 className="text-4xl">Page Not Found :(</h1>
                <span className="text-lg">Oops! 😖 The requested URL was not found.</span>
                <Link to="/"><button className="px-4 py-2 text-white bg-blue-500 rounded-md">Go Back</button></Link>
            </div>
        </>
    );
}

export default FourOFRour;