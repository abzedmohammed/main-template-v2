import { TextDynamic } from "abzed-utils";

export default function SystemErrorPage() {
	return (
		<div className='fx_col gap-5 p-10'>
			<TextDynamic text={'Server Error'} className={'txt_h1'} tagName='h1' />
			<TextDynamic text={'We are working on it...'} className={'txt_body_xl'} />
		</div>
	);
}
