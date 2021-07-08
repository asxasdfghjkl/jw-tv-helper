import * as React from 'react';

export declare interface MatIconProps extends React.HTMLProps<HTMLSpanElement> {
	children: string;
	className?: string;
}

export const MatIcon: React.FunctionComponent<MatIconProps> = ({ className = '', ...spanProps }) => {
	return <span {...spanProps} className={`material-icons ${className}`} />;
};

export default MatIcon;
