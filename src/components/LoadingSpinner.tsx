import * as React from 'react';

export declare interface LoadingSpinnerProps {}

export const LoadingSpinner: React.FunctionComponent<LoadingSpinnerProps> = props => {
	return (
		<span className="d-flex justify-content-center align-items-center">
			<div className="spinner-border me-1" role="status">
				<span className="visually-hidden">Loading...</span>
			</div>
			Loading...
		</span>
	);
};

export default LoadingSpinner;
