import { useRouteError } from 'react-router-dom';
import { TextDynamic } from 'abzed-utils';
import { HomeLayout } from '../components/layout';

export default function ErrorPage() {
    const error = useRouteError();
    const isNotFound = error?.status === 404;

    return (
        <>
            <HomeLayout />
            <div className="fx_col gap-5 p-10">
                <TextDynamic
                    tagName="h1"
                    className="txt_3_5_bold"
                    text={isNotFound ? '404 Error' : 'Server Error'}
                />
                <TextDynamic
                    tagName="p"
                    className="txt_1_125"
                    text={isNotFound ? 'Page not found' : 'We are working on it...'}
                />
            </div>
        </>
    );
}
