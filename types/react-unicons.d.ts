declare module "@iconscout/react-unicons" {
	import type { ComponentType, SVGProps } from "react";

	type UniconProps = SVGProps<SVGSVGElement> & {
		color?: string;
		size?: string | number;
	};

	export const UilMultiply: ComponentType<UniconProps>;
}
