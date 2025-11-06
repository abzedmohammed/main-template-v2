import { TextDynamic } from "abzed-utils";

export default function ErrorPage404() {
	return (
		<div className='fx_col gap-5 p-10'>
			<TextDynamic text={'404 Error'} className={'txt_h1'} tagName='h1' />
			<TextDynamic text={'Page not found'} className={'txt_body_xl'} />
		</div>
	);
}
