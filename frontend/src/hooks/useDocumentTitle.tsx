import { useLayoutEffect } from 'react';

const useDocumentTitle = (title: string) => {
	useLayoutEffect(() => {
		if (title) {
			document.title = title;
		} else {
			document.title = 'Nomid social | Social Network';
		}
	}, [title]);
};

export default useDocumentTitle;
