import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ContextProvider } from "@/components/Context";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const SITE_URL = "https://developermeet.vercel.app";

export const metadata: Metadata = {
	metadataBase: new URL(SITE_URL),
	title: {
		default: "DevMeet",
		template: "%s | DevMeet",
	},
	description: "Coding Interview Platform",
	icons: { icon: "/favicon.ico" },
	verification: {
		google: "DDaadFfVcQiWKV4L3g33y8y_gMHRmtTiDsXKpZ2umX4",
	},
	openGraph: {
		title: "DevMeet",
		description: "Coding Interview Platform",
		url: SITE_URL,
		images: [`${SITE_URL}/preview.png`],
	},
	twitter: {
		card: "summary_large_image",
		title: "DevMeet",
		description: "Coding Interview Platform",
		images: [`${SITE_URL}/preview.png`],
	},
};

export default function RootLayout({ children }: LayoutProps<"/">) {
	return (
		<html
			lang="en"
			className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
		>
			<body className="min-h-full flex flex-col">
				<ContextProvider>{children}</ContextProvider>
				<Script
					async
					src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3992129122215131"
					crossOrigin="anonymous"
					strategy="afterInteractive"
				/>
			</body>
		</html>
	);
}
