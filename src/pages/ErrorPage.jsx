import { useRouteError } from 'react-router-dom';
import { HomeLayout } from '../components/layout';

export default function ErrorPage() {
    const error = useRouteError();
    const isNotFound = error?.status === 404;

    return (
        <>
            <HomeLayout />
            <div className="fx_col gap-5 p-10">
                <h1 className="txt_3_5_bold">
                    {isNotFound ? '404 Error' : 'Server Error'}
                </h1>
                <p className="txt_1_125">
                    {isNotFound ? 'Page not found' : 'We are working on it...'}
                </p>
            </div>
        </>
    );
}
